'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  path = require('path'),
  bodyParser = require('body-parser'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  Users = require('./users.profile.server.controller.js'),
  AWS = require('aws-sdk'),
  crypto = require('crypto'),
  moment = require('moment');

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
let User = mongoose.model('User');



/**
 * get pre-signed URL from AWS S3
 *
 * req.params.id {string} - user._id
 * req.params.imageId {string} - file name with extension
 */
exports.getS3SignedUrl = (req, res) => {
  console.log('hereh hereh herehe her herhe rehr eh r');
  // var params = { Bucket: 'myBucket', Key: 'myKey' };

  var awsS3Config = {
    accessKeyId: config.S3_ID,
    secretAccessKey: config.S3_SECRET,
    region: 'us-west-1'
  };
  var s3 = new AWS.S3(awsS3Config);
  var fileToGet = req.params.imageId;
  var userIdBucket = req.params.userId;
  var imageData = {
    fileToGet: fileToGet,
    userIdBucket: userIdBucket,
    params: {
      Bucket: s3Config.bucket + '/' + s3Config.directory.user + '/' + userIdBucket,
      Key: fileToGet
    }
  };
  // var pathToLocalDisk = 'modules/users/client/img/profile/uploads/';
  // var userProfileImage = pathToLocalDisk + fileToGet;

  s3.getSignedUrl('getObject', imageData.params,
    (err, url) => {
      if(err) {
        res.status(400).send({
          message: 'Error',
          error: err
        })
      }
    console.log('The URL is: ', url);
      res.status(200).send({
        message: 'Success: URL is availble for 15 minutes',
        url: url
      })
  });
};

/**
 * get file from AWS S3
 *
 * req.params.id {string} - user._id
 * req.params.imageId {string} - file name with extension
 */

exports.getS3File = function (req, res) {
  var awsS3Config = {
    accessKeyId: config.S3_ID,
    secretAccessKey: config.S3_SECRET,
    region: 'us-west-1'
  };
  var s3 = new AWS.S3(awsS3Config);
  var fileToGet = req.params.imageId;
  var userIdBucket = req.params.userId;
  var imageData = {
    fileToGet: fileToGet,
    userIdBucket: userIdBucket,
    params: {
      Bucket: s3Config.bucket + '/' + s3Config.directory.user + '/' + userIdBucket,
      Key: fileToGet
    }
  };
  var pathToLocalDisk = 'modules/users/client/img/profile/uploads/';
  var userProfileImage = pathToLocalDisk + fileToGet;
  //var fileType = '';


  s3.getObject(imageData.params, function (err, callback) {
    //require('string_decoder');
    if (err) {
      console.log('getObject ERROR `err`:\n', err);
      res.send({
        message: 'ERROR, yo: ' + err
      })
    } else {
      // var imageAsBase64Array = callback.Body.toString('base64');
      // var imageAsUtf8 = callback.Body.toString('Utf8');

      // console.log('callback.Body:\n', callback.Body, '\n\n\n');
      // console.log('userProfileImage:\n', userProfileImage, '\n\n\n');

      fs.writeFile(userProfileImage, callback.Body, 'base64',
        (err) => {
          if (err) {
            throw err;
          }
          res.status(200).send({
            message: 'Success: Profile Image Delivered:\n'
            // fullResponse: callback,
            // imageAsBase64Array: imageAsBase64Array,
            // imageAsUtf8: imageAsUtf8
          });
        });
    }
  });

};




/**
 * upload user profile image to Amazon S3
 */

exports.uploadUserProfileImageWithOptimization = function (req, res) {

  var user = req.body.user;
  var bufferImage = new Buffer(req.body.toString('base64'), 'base64');
  var fileName = req.body.fileName;
  var path = s3Config.directory.user + '/' + user._id + '/' + fileName;
  var readType = 'private';
  //todo refactor to use moment on back end
  var expiration = moment().add(5, 'm').toDate(); //15 minutes

  tinify.key = config.tinyPngKey;

  var tinyParams = {
    service: 's3',
    aws_access_key_id: config.aws.s3Id,
    aws_secret_access_key: config.aws.s3Secret,
    region: s3Config.region,
    path: s3Config.bucket + '/' + path
  };
  var source = tinify.fromFile(req.body.fileName);

  source.store(tinyParams);

  //now save url to mongoDb
  var query = {
    _id: user._id
  };

  var propertiesToUpdate = {
    profileImageURL: 'https://s3-' + s3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + s3Config.directory.user + '/' + user._id + '/' + fileName,
    profileImageFileName: fileName,
    updated: Date.now()
  };
  var options = {};

  //call on mongoose Model.update function to update db
  User.update(query, propertiesToUpdate).exec();

  res.jsonp(source);

};
