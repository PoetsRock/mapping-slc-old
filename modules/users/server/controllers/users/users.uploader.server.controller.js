'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  Users = require('./users.profile.server.controller.js'),
  Project = mongoose.model('Project'),
  AWS = require('aws-sdk'),
  s3 = {
    keys: require('../../../../../config/env/production.js'),
    bucket: 'mapping-slc-file-upload',
    region: 'us-west-1',
    directory: {
      project: 'project-directory',
      user: 'user-directory',
      admin: 'admin-directory'
    }
  },
  crypto = require('crypto'),
  moment = require('moment'),
  s3Url = 'https://' + s3.bucket + '.s3-' + s3.region + '.amazonaws.com';


/**
 * upload user profile image to Amazon S3
 */

exports.uploadUserProfileImage = function (req, res) {
  var user = req.body.user;
  var fileName = req.body.filename.replace(/\s/g, '_'); //substitute all whitespace with underscores
  var path = s3.directory.user + '/' + user._id + '/' + fileName;
  var readType = 'private';
  var expiration = moment().add(5, 'm').toDate(); //15 minutes
  var s3Policy = {
    'expiration': expiration,
    'conditions': [{
      'bucket': s3.bucket
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

  var stringPolicy = JSON.stringify(s3Policy);
  var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

  // sign policy
  var signature = crypto.createHmac('sha1', s3.keys.aws.s3Secret)
    .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

  var credentials = {
    url: s3Url,
    fields: {
      key: path,
      AWSAccessKeyId: s3.keys.aws.s3Id,
      acl: readType,
      policy: base64Policy,
      signature: signature,
      'Content-Type': req.body.type,
      success_action_status: 201
    }
  };


  //now save url to mongoDb
  user.profileImageURL = 'https://s3-' + s3.region + '.amazonaws.com/' + s3.bucket + '/' + s3.directory.user + '/' + user._id + '/' + fileName;

  var updateUser = {
    user: user
  };
  res.jsonp(credentials);

  Users.update(updateUser);

};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    //var request = require('request');
    //request.put({url: '/api/v1/users'}, {req: user}, function (error, response, body) {
    //  if (!error && response.statusCode == 200) {
    //console.log('response:\n', response); // Show the HTML for the Google homepage.
    //console.log('body:\n', body); // Show the HTML for the Google homepage.
    //}
    //});

    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};




/**
 * get file from AWS S3
 */

exports.getS3File = function (req, res) {

  var s3File = new AWS.S3({
    accessKeyId: config.aws.s3Id,
    secretAccessKey: config.aws.s3Secret,
    region: 'us-west-1'
  });
  var file = req.params.photoId;
  var userIdBucket = req.params.userId;
  var params = {
    Bucket: s3.bucket + '/' + s3.directory.user + '/' + userIdBucket,
    Key: file
  };

  //var file = require('fs').createWriteStream(exampleFile);
  //s3File.getObject(params).createReadStream().pipe(file);

  //function for return as an object .... i guess
  //source: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
  s3File.getObject(params, function (err, data) {
    if (err) {
      console.log('ERRRRRRRRRRORORORORORO!!!:::::', err, err.stack);
    }
    else {
      console.log('SUCCESS!!!');
      console.log('backend data', data);
      new TypedArray(data);
      res.send(data);
    }
  });



};




//todo refactor
/**
 * upload project files to Amazon S3
 */

exports.uploadProject = function (req, res) {
  var request = req.body;
  var fileName = request.filename;
  var project = req.body.project;
  var path = s3.directory.project + '/' + project._id + '/' + fileName;

  var readType = 'private';

  var expiration = moment().add(5, 'm').toDate(); //15 minutes

  var s3Policy = {
    'expiration': expiration,
    'conditions': [{
      'bucket': s3.bucket
    },
      ['starts-with', '$key', path],
      {
        'acl': readType
      },
      {
        'success_action_status': '201'
      },
      ['starts-with', '$Content-Type', request.type],
      ['content-length-range', 2048, 10485760], //min and max
    ]
  };

  var stringPolicy = JSON.stringify(s3Policy);
  var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

  // sign policy
  var signature = crypto.createHmac('sha1', s3.keys.aws.s3Secret)
    .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

  var credentials = {
    url: s3Url,
    fields: {
      key: path,
      AWSAccessKeyId: s3.keys.aws.s3Id,
      acl: readType,
      policy: base64Policy,
      signature: signature,
      'Content-Type': req.body.type,
      success_action_status: 201
    }
  };
  console.log('credentials:\n', credentials);
  res.jsonp(credentials);
  //todo call on above `update()` object to update mongo
  //see above for working thingy
  //User.profileImageURL = 'https://s3-' + s3.region + '.amazonaws.com/' + s3.bucket + '/' + s3.directory.user + '/' + fileName;
};

