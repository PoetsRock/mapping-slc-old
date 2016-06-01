'use strict';

let Promise = require('bluebird'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    multiparty = require('multiparty'),
    config = require(path.resolve('./config/config')),
    AWS = require('aws-sdk'),
    shortId = require('shortid'),
    moment = require('moment'),
    mediaUtilities = require('./projects.server.utilities.js');

// console.log('mongoose.connections.db:\n', mongoose.connections[0].db);

let s3Config = {
  bucket: 'mapping-slc-file-upload',
  region: 'us-west-1',
  directory: [
    { name: 'admin', path: 'admin-directory' },
    { name: 'project', path: 'project-directory' },
    { name: 'user', path: 'user-directory' }
  ]
};
/** config aws s3 config settings, file object, and create a new instance of the s3 service */
let awsS3Config = {
  accessKeyId: config.S3_ID,
  secretAccessKey: config.S3_SECRET,
  region: 'us-west-1'
};

let tinify = Promise.promisifyAll(require('tinify'));
let s3 = new AWS.S3(awsS3Config);
Promise.promisifyAll(s3);
mongoose.Promise = Promise;
let Project = mongoose.model('Project');

/**
 *
 * @param configObj
 * @returns {*}
 * @private
 */
let _imageOptimizationAndThumb = (configObj) => {
  return _compressImage(configObj.file)
  .then(response => {
    console.log('response'.response);
    return _createThumbnail(configObj.projectId, configObj.fileName, configObj.filePathThumb);
  });
};


/**
 *
 * * Compress an image before uploading file
 *
 * @param {Buffer} file - image as buffer stream
 *
 * @returns {Buffer} optimizedImg
 * @private
 */
let _compressImage = (file) => {
  console.log('_compressImage fn  `file`\n', file, '\n\n');
  tinify.key = config.TINY_PNG_KEY;
  let compressionsThisMonth = tinify.compressionCount;
  console.log('compressionsThisMonth  before\n', compressionsThisMonth);
  
  // return tinify.fromBuffer(file).toBufferAsync()
  return tinify.fromFile(file).toBufferAsync()
  .then(response => {
    console.log('response from `_compressImage()\n', response);
    console.log('compressionsThisMonth  after\n', compressionsThisMonth);
    return response;
  });
};


/**
 *
 * sends image to TingPNG, which creates optimized thumbnail of image and then uploads thumb to s3
 *
 * @param {string} projectId
 * @param {string} fileName
 * @param {string} filePath
 *
 * @returns {string} optimizedImg
 * @private
 */
let _createThumbnail = (projectId, fileName, filePath, file) => {
  tinify.key = config.TINY_PNG_KEY;
  let source = tinify.fromFile(filePath);
  return source.resize({
    method: 'cover',
    width: 150,
    height: 150
  })
  .store({
    service: 's3',
    aws_access_key_id: config.S3_ID,
    aws_secret_access_key: config.S3_SECRET,
    region: 'us-west-1',
    path: s3Config.bucket + '/' + 'project-directory/' + projectId + '/thumbs/' + 'thumb_' + fileName
  });
};

let configFileData = (fileInput, projectId) => {
  console.log('\nconfigFileData ::::  fileInput\n', fileInput, '\n\n');
  let fileData = {
    file: fileInput.data.files.file[0],
    path: fileInput.data.files.file[0].path,
    name: fileInput.data.files.file[0].originalFilename,
    type: fileInput.data.files.file[0].headers['content-type'],
    size: fileInput.data.files.file[0].size,
    fileId: shortId.generate(),
    isDefaultImage: fileInput.default || false,
    imageTags: fileInput.data.files.file[0].tags || [],
    aclLevel: fileInput.data.fields['data[securityLevel]'] || 'read-only'
  };

  fileData.fileExt = mediaUtilities.getFileExt(fileData.type, fileData.name).extension;

  //todo refactor to make immutable object
  if (/\s/g.test(fileData.name)) {
    fileData.name = fileData.name.replace(/\s/g, '_');
  }
//   return fileData;
// };
//
//
// let configS3Obj = (fileData, projectId) => {
  console.log('\nconfigS3Obj ::::  s3Input\n', fileData, '\n\n');

  //todo refactor to allow this to be a variable passed in on the req obj
  let s3Directory = s3Config.directory[1].path;

  let imageFileStream = fs.createReadStream(fileData.path);

  let imageUrlRoot = 'https://s3-' + s3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + s3Directory + '/' + projectId;

  fileData.fullImageUrl = imageUrlRoot + '/' + fileData.fileId + '.' + fileData.fileExt;
  fileData.thumbImageUrl = imageUrlRoot + '/thumb_' + fileData.fileId + '.' + fileData.fileExt;

  fileData.s3Obj = new Object({
    header: { 'x-amz-decoded-content-length': fileData.size },
    // ACL: 'read-only' || fileData.aclLevel || req.body.data.fields['data[securityLevel]'] || 'private',
    region: 'us-west-1',
    Key: s3Directory + '/' + projectId + '/' + fileData.fileId + '.' + fileData.fileExt,
    Bucket: s3Config.bucket,
    ContentLength: fileData.size,
    ContentType: fileData.type,
    Body: imageFileStream,
    Metadata: {
      imageId: fileData.fileId,
      imageType: fileData.type,
      imageExt: fileData.fileExt,
      imageTag: fileData.imageTags.toString(),
      imageName: fileData.name,
      isDefault: fileData.isDefaultImage.toString() || 'false',
    }
  });
  return fileData;
};


let configMongoObj = (fileData) => {
  /** now configure object to update on database */
  let currentAdminId = '5611ca9493e8d4af5022bc17';

  let fieldsToUpdate = {
    $addToSet: {
      imageGallery: {
        imageUrl: fileData.fullImageUrl ,
        imageId: fileData.fileId,
        thumbImageUrl: fileData.thumbImageUrl,
        thumbImageId: 'thumb_' + fileData.fileId,
        imageSize: fileData.size,
        imageType: fileData.type,
        imageExt: fileData.fileExt,
        imageName: fileData.name,
        imageTag: fileData.tags,
        isDefaultImage: fileData.isDefaultImage
      },
      modified: {
        modifiedBy: currentAdminId,
        modifiedAt: moment.utc(Date.now())
      }
    }
  };
  return fieldsToUpdate;
};




exports.configReqObj = (req, res, next) => {
  console.log('req.body v1:\n', req.body);
  console.log('req.body.files[0] v1:\n', req.body.files[0]);
  req.body = {
    data: {
      files: {
        file: req.body.files[0],
        // path: req.body.files.file[0].path,
        // name: req.body.files.file[0].originalFilename,
        // type: req.body.files.file[0].content-type,
        // size: req.body.files.file[0].size,
        fileId: shortId.generate(),
        isDefaultImage: req.body.default || false,
        imageTags: req.body.files[0].file[0].tags || [],
      }
    }
  };
  console.log('req.body v2:\n', req.body);
  console.log('req.body.data.files v2:\n', req.body.data.files);
  next();
};



/**
 *
 * Multiparty Middleware for Handling Multipart Form Data
 *
 * @param req
 * @param res
 * @param next
 */
exports.parseFileUpload = (req, res, next) => {
  // parse a file upload
  // console.log('\nparseFileUpload ::::  req\n', req, '\n\n');
  console.log('\nparseFileUpload ::::  req.body\n', req.body, '\n\n');
  var form = new multiparty.Form();
  form.parse(req, ((err, fieldsObject, filesObject) => {
    if (err) {
      console.log('parseFileUpload callback `err`:\n', err, '\n\n');
    }
    if (!req.body) {
      return req.body = {};
    }
    req.body.data = {
      fields: fieldsObject,
      files: filesObject
    };
    // console.log('\nparseFileUpload ::::  req.body\n', req.body, '\n\n');
    // console.log('\nparseFileUpload ::::  req.body.data\n', req.body.data, '\n\n');
    next();
  }));
};




exports.configFileData = (req, res, next) => {
  console.log('\nconfigFileData ::::  req.body\n', req.body, '\n\n');
  let fileData = {
    file: req.body.data.files.file[0],
    path: req.body.data.files.file[0].path,
    name: req.body.data.files.file[0].originalFilename,
    type: req.body.data.files.file[0].headers['content-type'],
    size: req.body.data.files.file[0].size,
    fileId: shortId.generate(),
    isDefaultImage: req.body.default || false,
    imageTags: req.body.data.files.file[0].tags || [],
    aclLevel: req.body.data.fields['data[securityLevel]'] || 'read-only'
  };

  fileData.fileExt = mediaUtilities.getFileExt(fileData.type, fileData.name).extension;

  //todo refactor to make immutable object
  if (/\s/g.test(fileData.name)) {
    fileData.name = fileData.name.replace(/\s/g, '_');
  }
  req.body.fileData = fileData;
  next();
};


exports.configS3Obj = (req, res, next) => {
  // console.log('\nconfigS3Obj ::::  req\n', req, '\n\n');
  // console.log('\nconfigS3Obj ::::  req.body\n', req.body, '\n\n');
  let fileData = req.body.fileData;

  //todo refactor to allow this to be a variable passed in on the req obj
  let s3Directory = s3Config.directory[1].path;

  let imageFileStream = fs.createReadStream(fileData.path);

  let imageUrlRoot = 'https://s3-' + s3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + s3Directory + '/' + req.params.projectId;

  fileData.fullImageUrl = imageUrlRoot + '/' + fileData.fileId + '.' + fileData.fileExt;
  fileData.thumbImageUrl = imageUrlRoot + '/thumb_' + fileData.fileId + '.' + fileData.fileExt;

  fileData.s3Obj = new Object({
    header: { 'x-amz-decoded-content-length': fileData.size },
    // ACL: 'read-only' || fileData.aclLevel || req.body.data.fields['data[securityLevel]'] || 'private',
    region: 'us-west-1',
    Key: s3Directory + '/' + req.params.projectId + '/' + fileData.fileId + '.' + fileData.fileExt,
    Bucket: s3Config.bucket,
    ContentLength: fileData.size,
    ContentType: fileData.type,
    Body: imageFileStream,
    Metadata: {
      imageId: fileData.fileId,
      imageType: fileData.type,
      imageExt: fileData.fileExt,
      imageTag: fileData.imageTags.toString(),
      imageName: fileData.name,
      isDefault: fileData.isDefaultImage.toString() || 'false',
    }
  });
  req.body.fileData = fileData;
  next();
};

exports.configMongoObj = (req, res, next) => {
  let fileData = req.body.fileData;
  /** now configure object to update on database */
  let currentAdminId = '5611ca9493e8d4af5022bc17';

  let fieldsToUpdate = {
    $addToSet: {
      imageGallery: {
        imageUrl: fileData.fullImageUrl ,
        imageId: fileData.fileId,
        thumbImageUrl: fileData.thumbImageUrl,
        thumbImageId: 'thumb_' + fileData.fileId,
        imageSize: fileData.size,
        imageType: fileData.type,
        imageExt: fileData.fileExt,
        imageName: fileData.name,
        imageTag: fileData.tags,
        isDefaultImage: fileData.isDefaultImage
      },
      modified: {
        modifiedBy: currentAdminId,
        modifiedAt: moment.utc(Date.now())
      }
    }
  };
  req.body.fieldsToUpdate = fieldsToUpdate;
  next();
};

/**
 *
 * Uploads images to s3 - stores files in `mapping-slc-file-upload/project-directory/<project-id>/`
 *
 * @param req
 * @param res
 */
exports.uploadProjectImages = (req, res) => {
  // let fileData = configFileData(req.body, req.params.projectId);
  let fieldsToUpdate = configMongoObj(fileData);

  let fileData = req.body.fileData;
  // let fieldsToUpdate = req.body.fieldsToUpdate;

  /** upload image to S3 */
  let s3Params = { Bucket: fileData.s3Obj.Bucket, Key: fileData.s3Obj.Key, Metadata: fileData.s3Obj.Metadata, Body: fileData.s3Obj.Body };

  return s3.uploadAsync(s3Params)
    .then(uploadedImage => {
      fieldsToUpdate.$addToSet.imageGallery.imageS3Key = uploadedImage.Key;

      /** now save the image URLs to mongoDb */
      let query = Project.findOneAndUpdate(
        { _id: req.params.projectId },
        fieldsToUpdate,
        { new: true }
      ).exec();

      query.then(response => {
        /** now send response to front end */
        return res.jsonp({ link: fileData.fullImageUrl });
      })
      .catch(err => {
        console.error('\n\nERROR updating Mongo:\n', err);
        return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
      });

  });
};

/**
 *
 * @param s3ObjClone
 * @param fileData
 * @param projectId
 */

let updateDb = (s3ObjClone, fileData, projectId) => {

  
};

/**
 *
 * Uploads documents to s3:
 * * stores files path bucket: `mapping-slc-file-upload/project-directory/<project-id>/`
 * * url to access documents: ``
 *
 * @param req
 * @param res
 *
 */
exports.streamProjectDocuments = (req, res) => {
  
  var project = req.project;
  
  var file = req.body.data.files.file[0];
  var filePath = req.body.data.files.file[0].path;
  var fileName = req.body.data.files.file[0].originalFilename;
  var type = req.body.data.files.file[0].headers['content-type'];
  var aclLevel = req.body.data.fields['data[securityLevel]'];
  
  if (/\s/g.test(fileName)) {
    fileName = fileName.replace(/\s/g, '_');
  }
  
  /** config aws s3 config settings, file object, and create a new instance of the s3 service */
    // let awsS3Config = {
    //   accessKeyId: config.S3_ID,
    //   secretAccessKey: config.S3_SECRET,
    //   region: 'us-west-1',
    //   Key: 'project-directory/' + project._id + '/' + fileName,
    //   Bucket: s3Config.bucket
    // };
  let fileStream = fs.createReadStream(filePath);
  let s3Obj = {
    header: { 'x-amz-decoded-content-length': file.size },
    ACL: aclLevel || 'private',
    region: 'us-west-1',
    Key: 'project-directory/' + project._id + '/' + fileName,
    Bucket: s3Config.bucket,
    ContentLength: file.size,
    ContentType: type,
    Body: fileStream
    // ServerSideEncryption: 'AES256'
  };

  
  s3.upload({ Bucket: s3Obj.Bucket, Key: s3Obj.Key, Metadata: {}, Body: s3Obj.Body })
  .on('httpUploadProgress', function (evt) {
    console.log(evt);
  })
  .send(function (err, data) {
    if (err) {
      console.log('s3 upload error message:\n', err);
    }
    console.log('s3 upload project files :: SUCCESSFUL UPLOAD :: Response var `data`:\n', data);
    
    /** now save main document url and ETag to mongoDb */
    let updatedProject = {
      fileUrls: data.Location,
      fileEtags: data.ETag
    };
    Project.update(updatedProject);
    
    /** now respond with a success message */
      // res.jsonp({ message: 's3 file upload was successful', mainImageUrl: data.Location });
    
    let response = {
        message: 's3 file upload was successful',
        s3Obj: s3Obj
      };
    res.jsonp(response);
    
  });
  
};
