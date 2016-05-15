'use strict';


var mongoose = require('mongoose'),
  fs = require('fs'),
  path = require('path'),
  util = require('util'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Project = mongoose.model('Project'),
  multiparty = require('multiparty'),
  config = require(path.resolve('./config/config')),
  projects = require('./projects.server.controller'),
  Promise = require('bluebird'),
  s3Config = {
    bucket: 'mapping-slc-file-upload',
    region: 'us-west-1',
    directory: [
      { name: 'project', path: 'project-directory' },
      { name: 'user', path: 'user-directory' },
      { name: 'admin', path: 'admin-directory' }
    ]
  },
  s3Url = 'https://' + s3Config.bucket + '.s3-' + s3Config.region + '.amazonaws.com',
  crypto = require('crypto'),
  moment = require('moment'),
  tinify = require('tinify');




/**
 *
 * create AWS credentials for front end upload to S3
 *
 * @param req
 * @param res
 *
 */
exports.createUploadCredentials = (req, res) => {
  let project = req.body.project;
  let fileType = req.body.type;
  let fileName = req.body.filename;
  if (1 !== 1) {
    fileName = req.body.filename.replace(/\s/g, '_'); //substitute all whitespace with underscores
  }
  let path = 'project-directory/' + project._id + '/' + fileName;
  let readType = 'public-read';
  let expiration = moment().add(5, 'm').toDate(); //15 minutes
  let s3Policy = {
    'expiration': expiration,
    'conditions': [{
      'bucket': s3Config.bucket
    },
      ['starts-with', '$key', path],
      {
        'acl': readType
      },
      {
        'success_action_status': '201'
      },
      ['starts-with', '$Content-Type', req.body.type],
      ['content-length-range', 2048, 10485760], //min and max
    ]
  };

  let stringPolicy = JSON.stringify(s3Policy);
  let base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

  // sign policy
  let signature = crypto.createHmac('sha1', config.S3_SECRET)
    .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

  let credentials = {
    url: s3Url,
    fields: {
      key: path,
      AWSAccessKeyId: config.S3_ID,
      acl: readType,
      policy: base64Policy,
      signature: signature,
      'Content-Type': fileType,
      success_action_status: 201
    }
  };

  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    fileType = 'application/docx'
  }
  /** save document URLs to MongoDb */
  let newFile = {
    fileUrl: 'https://s3-us-west-1.amazonaws.com/' + s3Config.bucket + '/' + 'project-directory/' + project._id + '/' + fileName,
    fileName: fileName,
    fileType: fileType,
    fileSize: req.body.size
  };

  project.fileUrls = project.fileUrls || [];
  project.fileUrls.push(newFile);
  Project.update({ _id: project._id }, { fileUrls: project.fileUrls }, { runValidators: true }, function (err, response) {
    if (err) {
      let errMessage = {
        message: 'Error dating database for project file upload',
        error: err
      };
      console.log('errMessage:\n', errMessage, '\n\n');
      res.jsonp(errMessage);
    }
    console.log('::::: file upload update db successful::: var `response`:\n', response, '\n\n');
    res.jsonp(credentials);
  });
};
