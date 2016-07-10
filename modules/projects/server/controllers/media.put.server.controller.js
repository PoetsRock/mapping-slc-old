'use strict';

let Promise = require('bluebird'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  os = require('os'),
  path = require('path'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multiparty = require('multiparty'),
  config = require(path.resolve('./config/config')),
  AWS = require('aws-sdk'),
  shortId = require('shortid'),
  moment = require('moment'),
  projectUtilities = require('./projects.server.utilities.js');

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

exports.testUpload = (req, res) => {
  
  
  
};

exports.testUpload = (req, res) => {
  console.log('req:\n', req, '\n\n\n');
  let fileId = shortId.generate();
  let fileExt = projectUtilities.getFileExt(req.headers['content-type'], req.headers['file-name']).extension;
  // let body = '';
  
  // req.on('data', (chunk) => {
  //   body += chunk;
  // });
  
  // req.on('end', () => {
    // console.log('body:\n', body, '\n\n\n');
    console.log('typeof req.body: ', typeof req.body, '\n\n\n');
    // const imageBuffer = Buffer.from(body);
    let s3Params = {
      header: { 'x-amz-decoded-content-length': req.headers['size'] },
      region: 'us-west-1',
      ContentLength: req.headers['size'],
      ContentType: req.headers['content-type'],
      Bucket: s3Config.bucket,
      Key: `${s3Config.directory[1].path}/${req.params.projectId}/${fileId}.${fileExt}`,
      Body: req.body
    };
    console.log('s3Params:\n', s3Params);
    
    return s3.uploadAsync(s3Params)
    .then(s3Response => {
      console.log('s3Response:\n', s3Response);
      res.jsonp(s3Response);
    })
    .catch(err => {
      console.log('ERROR: s3 response error:\n', err);
    });
  // });
};


//req.setEncoding('base64'); //does this i need this?
// let fileId = shortId.generate();
// let fileExt = projectUtilities.getFileExt(req.headers['content-type'], req.headers['file-name']).extension;
// let writeStream = fs.createWriteStream(os.homedir() + '/Downloads/' + fileId + '.' + fileExt);

/**
 *
 * Uploads images to s3 - stores files in `mapping-slc-file-upload/project-directory/<project-id>/` and saves image data in Mongo
 *
 * @param req
 * @param res
 */
exports.uploadProjectImages = (req, res) => {
  let fileData = req.body.fileData;
  let fieldsToUpdate = req.body.fieldsToUpdate;
  
  /* for direct uploads, file stream is on `fileData.s3Obj.Body.file`; for multipart form data, stream is on `fileData.s3Obj.Body`  */
  if (fileData.s3Obj.Body.file) {
    fileData.body.stream = fileData.s3Obj.Body.file;
  } else if (fileData.s3Obj.Body) {
    fileData.body.stream = fileData.s3Obj.Body
  }

// todo -- current issue is that `fieldsToUpdate` is undefined, so i'm getting an error: "'$addToSet' of undefined"
  //todo - workaround; need to refactor
  fileData.s3Obj.Metadata.imageName = req.headers['file-name'] || req.body.fileData.file.originalFilename;
  
  /** upload image to S3 */
  let s3Params = {
    Bucket: fileData.s3Obj.Bucket,
    Key: fileData.s3Obj.Key,
    Metadata: fileData.s3Obj.Metadata,
    Body: fileData.s3Obj.Body || fileData.body.stream //refactor
  };
  console.log('does the image begin with data:image/jpeg;base64,/9j ... ???\n\n\n\n\n');
  console.log('s3Params.Body for upload Project Image:\n', s3Params.Body);
  
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
 * Streams files (docs or media) to s3:
 *
 * @param req - file should already be a stream
 * @param res
 *
 */

exports.streamProjectFiles = (req, res) => {
  
  let fileData = req.body.fileData;
  let fieldsToUpdate = req.body.fieldsToUpdate;
  
  /** upload image to S3 */
  let s3Params = {
    Bucket: fileData.s3Obj.Bucket,
    Key: fileData.s3Obj.Key,
    Metadata: fileData.s3Obj.Metadata,
    Body: fileData.s3Obj.Body
  };
  
  return s3.uploadAsync(s3Params)
  .then(uploadedImage => {
    fieldsToUpdate.$addToSet.imageGallery.imageS3Key = uploadedImage.Key;
    
    /** update mongoDb */
    let mongoData = {
      collection: 'Project',
      queryId: req.params.projectId,
      fieldsToUpdate: fieldsToUpdate,
      options: { new: true }
    };
    let mongoResponse = projectUtilities.updateDb(mongoData);  // <-- do/can I to promisify this call????  
    
    /** send response (success or error) to front end */
    let statusCode = mongoResponse.statusCode || 205;
    let response = {
      message: 's3 file upload was successful',
      s3Obj: s3Obj,
      response: mongoResponse
    };
    res.statusCode(statusCode).jsonp(response);
    
    
    // projectUtilities.updateDb(mongoData, (response => {     // <-- do/can I to promisify this call????
    //   let statusCode = response.statusCode || 205;
    //   let response = {
    //     message: 's3 file upload was successful',
    //     s3Obj: s3Obj
    //   };
    //   res.statusCode(statusCode).jsonp(response);
    // }));
    
    
    // projectUtilities.updateDb(mongoData);  // <-- do i need to promisify this call????
    // let statusCode = response.statusCode || 205;
    // let response = {
    //   message: 's3 file upload was successful',
    //   s3Obj: s3Obj
    // };
    // res.statusCode(statusCode).jsonp(response);
  });
};