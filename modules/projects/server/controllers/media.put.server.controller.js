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



/**
 *
 * NOT WORKING !!!
 * in progress!!!
 * 
 * 1) Uploads images to a temp bucket in s3
 * 2) returns link to wysiwyg for displaying image
 * 3) sends image to TinyPng to optimize main image
 * 4) sends optimized image to TingPng to create a thumbnail
 * 5) Uploads main optimized image to s3 `mapping-slc-file-upload/project-directory/<project-id>/<imageId>`
 * 6) Uploads thumbnail to s3 `mapping-slc-file-upload/project-directory/<project-id>/thumb_<imageId>`
 * 7) stores file URLs and data in Mongo
 *
 * @param req
 * @param res
 */
exports.uploadProjectImagesV2 = (req, res) => {
  let fileData = req.body.fileData;
  let fieldsToUpdate = req.body.fieldsToUpdate;
  
  /** upload image to temp bucket in S3 */
  let s3Params = {
    Bucket: 'mslc-temp-projects-images',
    Key: fileData.s3Obj.Key,
    Metadata: fileData.s3Obj.Metadata,
    Body: fileData.s3Obj.Body
  };
  
  return s3.uploadAsync(s3Params)
  .then(uploadedImage => {
    res.jsonp({ link: fileData.fullImageUrl });
    fieldsToUpdate.$addToSet.imageGallery.imageS3Key = uploadedImage.Key;
  })
  .then(() => {
    /** upload image to projects bucket S3 */
    s3Params = {
      Bucket: fileData.s3Obj.Bucket,
      Key: fileData.s3Obj.Key,
      Metadata: fileData.s3Obj.Metadata,
      Body: fileData.s3Obj.Body
    };
    return s3.uploadAsync(s3Params);
  })
  .finally(() => {
    /** now save the image URLs to mongoDb */
    let query = Project.findOneAndUpdate(
      { _id: req.params.projectId },
      fieldsToUpdate,
      { new: true }
    ).exec();
    
    query.then(response => {
      /** now send response to front end */
      // res.jsonp({ link: fileData.fullImageUrl });
    })
    .catch(err => {
      console.error('\n\nERROR updating Mongo:\n', err);
      return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
    })
  })
  .catch(err => {
    
  });
  
};










/**
 *
 * WORKING!!!
 *
 * Uploads images to s3 - stores files in `mapping-slc-file-upload/project-directory/<project-id>/` and saves image data in Mongo
 *
 * @param req
 * @param res
 */
exports.uploadProjectImages = (req, res) => {
  let fileData = req.body.fileData;
  let fieldsToUpdate = req.body.fieldsToUpdate;

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