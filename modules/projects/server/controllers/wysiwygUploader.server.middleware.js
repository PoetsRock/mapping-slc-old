'use strict';

const fs = require('fs'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

const s3Config = {
  bucket: 'mapping-slc-file-upload',
  region: 'us-west-1',
  directory: [
    { name: 'admin', path: 'admin-directory' },
    { name: 'project', path: 'project-directory' },
    { name: 'user', path: 'user-directory' }
  ]
};


/**
 *
 */
exports.wysiwygS3Obj = (req, res, next) => {
  let fileData = req.body.fileData;

  //todo refactor to allow this to be a variable passed in on the req obj
  let s3Directory = s3Config.directory[1].path;

  let imageFileStream = fs.createReadStream(fileData.path);

  let imageUrlRoot = 'https://s3-' + s3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + s3Directory + '/' + req.params.projectId;

  fileData.fullImageUrl = imageUrlRoot + '/' + fileData.fileId + '.' + fileData.fileExt;
  fileData.thumbImageUrl = imageUrlRoot + '/thumb_' + fileData.fileId + '.' + fileData.fileExt;

  fileData.s3Obj = _.extend({}, {
    header: { 'x-amz-decoded-content-length': fileData.size },
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

  if (fileData.s3Obj.Body.file) {
    console.log('IF :: "fileData.s3Obj.Body.file"');
    fileData.body.stream = fileData.s3Obj.Body.file;
  } else if (fileData.body) {
    console.log('ELSE IF :: "fileData.body"');
    fileData.body.stream = fileData.s3Obj.Body
  }

  req.body.fileData = fileData;
  next();
};
