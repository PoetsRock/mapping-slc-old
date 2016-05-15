'use strict';


var mongoose = require('mongoose'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Project = mongoose.model('Project'),
  config = require(path.resolve('./config/config')),
  projects = require('./projects.server.controller'),
  Promise = require('bluebird'),
  AWS = require('aws-sdk'),
  s3Config = {
    bucket: 'mapping-slc-file-upload',
    region: 'us-west-1',
    directory: [
      { name: 'project', path: 'project-directory' },
      { name: 'user', path: 'user-directory' },
      { name: 'admin', path: 'admin-directory' }
    ]
  },
  s3Url = 'https://' + s3Config.bucket + '.s3-' + s3Config.region + '.amazonaws.com';






exports.deleteImageByImageId = (req, res) => {

};
