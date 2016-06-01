'use strict';

let Promise = require('bluebird'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    path = require('path'),
    config = require(path.resolve('./config/config')),
    projects = require('./projects.server.controller'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash'),
    multiparty = require('multiparty'),
    AWS = require('aws-sdk'),
    tinify = Promise.promisifyAll(require('tinify')),
    shortId = require('shortid'),
    moment = require('moment'),
    mediaUtilities = require('./projects.server.utilities.js');

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


mongoose.Promise = Promise;
let Project = mongoose.model('Project');

let s3 = new AWS.S3(awsS3Config);
Promise.promisifyAll(s3);



/**
 * Project middleware for getProjectById
 **/
exports.projectById = function (req, res, next, id) {
  let query = Project.findById(id)
    .populate('user')
    .exec();

  query.then(project => {
    if (!project) {
      next({ message: 'Failed to load Project ' + id, errorMessage: errorHandler.getErrorMessage(project) });
    }
    req.project = project;
    next();
  })
  .catch(err => {
    console.log('err:\n', err);
    return next(new Error(err));
  });
};


/**
 * Middleware that return sourceId from url params
 */
exports.source = (req, res, next, id) => {
  req.source = id;
  next();
};

/**
 * Middleware that return an imageId from the url params
 */
exports.imageId = (req, res, next, id) => {
  req.imageId = id;
  next();
};


/**
 * Project authorization middleware
 */
exports.hasAuthorization = (req, res, next) => {
  if (req.project.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};


// exports.configReqObj = (req, res, next) => {
//   console.log('req.body v1:\n', req.body);
//   console.log('req.body.files[0] v1:\n', req.body.files[0]);
//   req.body = {
//     data: {
//       files: {
//         file: req.body.files[0],
//         // path: req.body.files.file[0].path,
//         // name: req.body.files.file[0].originalFilename,
//         // type: req.body.files.file[0].content-type,
//         // size: req.body.files.file[0].size,
//         fileId: shortId.generate(),
//         isDefaultImage: req.body.default || false,
//         imageTags: req.body.files[0].file[0].tags || [],
//       }
//     }
//   };
//   console.log('req.body v2:\n', req.body);
//   console.log('req.body.data.files v2:\n', req.body.data.files);
//   next();
// };



/**
 *
 * Multiparty Middleware for Parsing Multipart Form Data
 *
 * `req`
 *
 * @param req - {Object}
 * @param req.body - {Object}
 * @param res - {Object}
 * @param next - {Function}
 * @ returns {object} - req.body.
 */
exports.parseFileUpload = (req, res, next) => {
  var form = new multiparty.Form();
  form.parse(req, ((err, fieldsObject, filesObject) => {
    if (err) { console.log('parseFileUpload callback `err`:\n', err, '\n\n'); }
    if (!req.body) { return req.body = {}; }
    req.body.data = {
      fields: fieldsObject,
      files: filesObject
    };
    next();
  }));
};


/**
 * Middleware 
 * 
 * @param req
 * @param res
 * @param next
 */
exports.configFileData = (req, res, next) => {
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