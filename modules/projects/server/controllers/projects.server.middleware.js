'use strict';

let Promise = require('bluebird'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    http = require('http'),
    stream = require('stream'),
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
exports.hasAdminAuthorization = (req, res, next) => {
  if (req.project.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};



/**
 * Middleware that validates current session user's userId against all admin and superAdmin userIds
 */
exports.hasAdminAuthorization = (req, res, next) => {
  console.log('req.session: ', req.session, '\n', req.session.passport, '\n', req.session.passport.user, '\n\n');

  // refactor to return an array userIds of all users with a role of either admin or superAdmin
  let authorizedAdmins = req.session.passport.user || '5611ca9493e8d4af5022bc17';
  req.admin = {
    isAdmin: true,
    userId: '5611ca9493e8d4af5022bc17'
  };
  if (req.session.passport.user !== authorizedAdmins) {
    req.admin.isAdmin = false;
    // return res.status(403).send('User is not an admin and is not authorized');
  }
  console.log('::::  req.isAdmin::::::: ', req.isAdmin);
  next();
};


exports.createImageStream = (req, res, next) => {

  // The filename is simple the local directory and tacks on the requested url
  let imageUrl = __dirname+req.url;

  // This line opens the file as a readable stream
  let readStreamImage = fs.createReadStream(imageUrl);

  // This will wait until we know the readable stream is actually valid before piping
  readStreamImage.on('open', function () {
    // This just pipes the read stream to the response object (which goes to the client)
  // readStreamImage.pipe(res);
  });

  readStreamImage.on('error', function(err) {
    res.end(err);
  });

  // let body = '';
  // req.on('data', (chunk) => {
  //   body += chunk;
  // });
  // req.on('end', () => {
  //   req.body.file = body;
  // });

};

/**
 *
 * Middleware that prepares req obj from front end streamed file uploads
 *
 * @param req
 * @param res
 * @param next
 */
exports.transformHeaders = (req, res, next) => {
  let isDefaultImage = (req.headers['default-image'] === 'true');
  let imageTags = req.headers['tags'].split(',%,%,%'); //split with a symbol that won't be used in any tag so that i can parse back into an array later


  // The filename is simple the local directory and tacks on the requested url
  let imageUrl = __dirname+req.url;

  // This line opens the file as a readable stream
  let readStreamImage = fs.createReadStream(imageUrl);

  // This will wait until we know the readable stream is actually valid before piping
  readStreamImage.on('open', function () {
    // This just pipes the read stream to the response object (which goes to the client)
    // readStreamImage.pipe(res);



  let preConfigObj = {
    files: {
      file: [{
        file: req.body.file,
        path: null,
        name: req.headers['file-name'] || req.body.file.originalFilename,
        type: req.headers['content-type'] || req.body.file['content-type'],
        size: req.headers['size'],
        isDefaultImage: isDefaultImage || false,
        imageTags: imageTags || [],
        aclLevel: req.headers['aclLevel'] || 'read-only',
        bucket: req.headers['bucket']
      }]
    }
  };
  _.extend(req.body, preConfigObj);

  });  // close `end` event

  readStreamImage.on('error', err => {
    console.log('\n\n\n\n!!  !!  !!  !!streaming ERROR:\n', err);
    res.end(err);
  });

  console.log('req.body:::::::::::\n', req.body, '\n\n\n');

  next();
};


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
    if (!req.body) { req.body = {}; }
    req.body = {
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
  let file = req.body.files.file[0];
  let fileData = {
    file: file,
    path: file.path || null,
    name: file.name || file.originalFilename,
    type: file.type || file.headers['content-type'],
    size: file.size,
    fileId: shortId.generate(),
    isDefaultImage: file.isDefaultImage || req.body.default || false,
    imageTags: file.tags || file.imageTags || [],
    aclLevel:  file.aclLevel || req.body.fields['data[securityLevel]']
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

  let source = mediaUtilities.setSourceId();
  console.log('from mediaUtilities.setSourceId `source`:\n', source);

  let imageUrlRoot = 'https://s3-' + s3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + source.s3Directory + '/' + source.sourceId;
  fileData.fullImageUrl = imageUrlRoot + '/' + fileData.fileId + '.' + fileData.fileExt;
  fileData.thumbImageUrl = imageUrlRoot + '/thumb_' + fileData.fileId + '.' + fileData.fileExt;

  if(fileData.path) {
    fileData.imageFileStream = fs.createReadStream(fileData.path);
  }
  if(fileData.imageFileStream) {
    fileData.body = fileData.imageFileStream
  } else if(fileData.file) {
    fileData.body = fileData.file.file;
  }

  fileData.s3Obj = new Object({
    header: { 'x-amz-decoded-content-length': fileData.size },
    region: 'us-west-1',
    Key: source.s3Directory + '/' + source.sourceId + '/' + fileData.fileId + '.' + fileData.fileExt,
    Bucket: s3Config.bucket,
    ContentLength: fileData.size,
    ContentType: fileData.type,
    Body: fileData.body,
    Metadata: {
      imageId: fileData.fileId,
      imageType: fileData.type,
      imageExt: fileData.fileExt,
      imageTags: fileData.imageTags.toString(),
      imageName: fileData.name || fileData.body.name,
      isDefault: fileData.isDefaultImage.toString() || 'false',
    }
  });
  req.body.fileData = fileData;
  next();
};


/**
 *  Creates and configures an object to update the associated database document
 * @param req
 * @param res
 * @param next
 */
exports.configMongoObj = (req, res, next) => {
  let fileData = req.body.fileData;

  // todo make dynamic !!
  let currentAdminId = '5611ca9493e8d4af5022bc17';

  req.body.fieldsToUpdate = {
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
        imageTags: fileData.imageTags,
        isDefaultImage: fileData.isDefaultImage
      },
      modified: {
        modifiedBy: currentAdminId,
        modifiedAt: moment.utc(Date.now())
      }
    }
  };

  next();
};