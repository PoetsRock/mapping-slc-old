'use strict';

// import multiparty from 'multiparty';
// import Promise from 'bluebird';
// import errorHandler from '../../../core/server/controllers/errors.server.controller';

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


// exports.configImageStream = (req, res, next) => {
exports.configImageStream = (req, res) => {
  console.log('req:\n', req, '\n\n\n');
  
  let isDefaultImage = (req.headers['default-image'] === 'true');
  let imageTags = req.headers['tags'].split(',%,%,%'); //split with a symbol that won't be used in any tag so that i can parse back into an array later
  let fileName;
  //todo refactor to make immutable object
  if (/\s/g.test(req.headers['file-name'])) {
    fileName = req.headers['file-name'].replace(/\s/g, '_');
  }
  
  let fileData = {
    name: fileName || req.headers['file-name'],
    type: req.headers['content-type'],
    size: req.headers['size'],
    fileId: shortId.generate(),
    isDefaultImage: isDefaultImage,
    imageTags: imageTags || [],
    bucket: req.headers['bucket']
  };
  fileData.fileExt = mediaUtilities.getFileExt(fileData.type, fileData.name).extension;
  
  // let source = mediaUtilities.setSourceId();
  // let imageUrlRoot = 'https://s3-' + s3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + source.s3Directory + '/' + source.sourceId;
  let imageUrlRoot = 'https://s3-' + s3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + s3Config.directory[1].path + '/' + req.params.projectId;
  fileData.fullImageUrl = imageUrlRoot + '/' + fileData.fileId + '.' + fileData.fileExt;
  fileData.thumbImageUrl = imageUrlRoot + '/thumb_' + fileData.fileId + '.' + fileData.fileExt;
  
  fileData.s3Obj = new Object({
    header: { 'x-amz-decoded-content-length': fileData.size },
    region: 'us-west-1',
    Key: s3Config.directory[1].path + '/' + req.params.projectId + '/' + fileData.fileId + '.' + fileData.fileExt,
    Bucket: s3Config.bucket,
    ContentLength: fileData.size,
    ContentType: fileData.type,
    Metadata: {
      imageId: fileData.fileId,
      imageType: fileData.type,
      imageExt: fileData.fileExt,
      imageTags: fileData.imageTags.toString(),
      imageName: fileData.name || fileData.body.name,
      isDefault: fileData.isDefaultImage.toString() || 'false',
    }
  });
  
  // req.body.fileData = fileData;
  // next();
  let awsFileName = fileData.fileId + '.' + fileData.fileExt;
  console.log('awsFileName:\n', awsFileName);
  let writeFile = fs.createWriteStream(awsFileName);
  fileData.s3Obj.Body = req.pipe(writeFile);
  
  console.log('hereeeeeeeee!');
  console.log('fileData.s3Obj.Key: ', fileData.s3Obj.Key);
  console.log('\n\n\nfileData.s3Obj.Body: ', fileData.s3Obj.Body);
  
  s3.uploadAsync(fileData.s3Obj)
  .then(response => {
    console.log('response:\n', response);
    res.jsonp(response);
  });

};


exports.putImageStream = (req, res, next) => {
  let writeFile = fs.createWriteStream(req);
  let file = req.pipe(writeFile);
  
  s3.uploadAsync(file)
  .then(response => {
    console.log('response:\n', response);
    res.jsonp(response);
  });
  // next(); //now save data to mongo
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
  
  let preConfigObj = {
    files: {
      file: [{
        file: data,
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

  console.log('transformHeaders() middleware  `req.body`:::::::::::\n', req.body, '\n\n\n');

  next();
};


/**
 *
 * Multiparty Middleware for Parsing Multipart Form Data

 console.log('configFileData `req.body #2`:\n', req.body, '\n\n');
 console.log('configFileData `req.body #2`:\n', req.fields, '\n\n');
 console.log('configFileData `req.body #2`:\n', req.files, '\n\n');

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
  console.log('configFileData `req.body #2`:\n', req.body, '\n\n');
  console.log('configFileData `req.body #2`:\n', req.fields, '\n\n');
  console.log('configFileData `req.body #2`:\n', req.files, '\n\n');
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



/**
 *
 * current
 *
 **/
 exports.configS3Obj = (req, res, next) => {
  console.log('configS3Obj `req.body` #3:\n', req.body, '\n\n');
  let fileData = req.body.fileData;

  let source = mediaUtilities.setSourceId(req.body.fields.bucket[0], req.body.fields.bucketId[0]);

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

  fileData.s3Obj = _.extend({}, {
    header: { 'x-amz-decoded-content-length': fileData.size },
    region: 'us-west-1',
    Key: source.s3Directory + '/' + source.sourceId + '/' + fileData.fileId + '.' + fileData.fileExt,
    ThumbKey: source.s3Directory + '/' + source.sourceId + '/thumb_' + fileData.fileId + '.' + fileData.fileExt,
    Bucket: s3Config.bucket,
    ACL: fileData.aclLevel,
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

/**
 *  Creates and configures an object to update the associated database document
 * @param req
 * @param res
 * @param next
 */
exports.mongoObjUserImg = (req, res, next) => {
  let fileData = req.body.fileData;

  console.log('fileData:\n', fileData);

  // todo make dynamic !!
  let currentAdminId = '5611ca9493e8d4af5022bc17';

  req.body.fieldsToUpdate = {
    profileImage: {
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
    $addToSet: {
      modified: {
        modifiedBy: currentAdminId,
        modifiedAt: moment.utc(Date.now())
      }
    }
  };

  console.log('req.body.fieldsToUpdate:\n', req.body.fieldsToUpdate);

  next();
};
