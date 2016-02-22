'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  path = require('path'),
  bodyParser = require('body-parser'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  Users = require('./users.profile.server.controller.js'),
  Project = mongoose.model('Project'),
  AWS = require('aws-sdk'),
  s3Config = {
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
  tinify = require('tinify'),
  s3Url = 'https://' + s3Config.bucket + '.s3-' + s3Config.region + '.amazonaws.com';


/**
 * upload user profile image to Amazon S3
 */

exports.uploadUserProfileImage = function (req, res) {
  var user = req.body.user;
  var fileName = req.body.filename.replace(/\s/g, '_'); //substitute all whitespace with underscores
  var path = s3Config.directory.user + '/' + user._id + '/' + fileName;
  var readType = 'private';
  var expiration = moment().add(5, 'm').toDate(); //15 minutes
  var s3Policy = {
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

  var stringPolicy = JSON.stringify(s3Policy);
  var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

  // sign policy
  var signature = crypto.createHmac('sha1', config.S3_SECRET)
    .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

  var credentials = {
    url: s3Url,
    fields: {
      key: path,
      AWSAccessKeyId: config.S3_ID,
      acl: readType,
      policy: base64Policy,
      signature: signature,
      'Content-Type': req.body.type,
      success_action_status: 201
    }
  };
  res.jsonp(credentials);


  ////now save url to mongoDb

  //user.profileImageURL = 'https://s3-' + s3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + s3Config.directory.user + '/' + user._id + '/' + fileName;
  //
  //var updateUser = {
  //  user: user
  //};

  //Users.update(updateUser);

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
      console.log('err:\n', err);
      res.send({
        message: 'ERROR, yo: ' + err
      })
    } else {
      // var imageAsBase64Array = callback.Body.toString('base64');
      // var imageAsUtf8 = callback.Body.toString('Utf8');

      console.log('callback.Body:\n', callback.Body, '\n\n\n');
      console.log('userProfileImage:\n', userProfileImage, '\n\n\n');

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


  ////////////////////////////////////////////////////////////////////////////////////////

  //let remotePath = 'https://s3-us-west-1.amazonaws.com/' + imageData.params.Bucket + '/' + imageData.params.Key;
  ////let localPath = '../../../users/client/img/profile/';
  //let localPath = './modules/users/server/img/uploads';
  ////path.resolve('./modules/core/server/controllers/
  //
  //
  //  s3.getObject(imageData.params, function (err, data) {
  //  if (err) {
  //    res.status(400).send({
  //      message: console.log(err)
  //    });
  //  }
  //
  //  //var file = require('fs').createWriteStream(name);
  //  var file = fs.createWriteStream(localPath);
  //
  //  console.log('::::::  file ::::::\n', file, '\n\n');
  //
  //  var read = AWS.util.buffer.toStream(data.Body);
  //
  //  //console.log('::::::  read ::::::\n', read, '\n\n');
  //
  //
  //  read.pipe(file);
  //  read.on('data', function (chunk) {
  //    console.log('got %d bytes of data', chunk.length);
  //  });
  //});


  ////////////////////////////////////////////////////////////////////////////////////////


  //var file = require('fs').createWriteStream('/path/to/file.jpg');
  //s3File.getObject(imageData.params).createReadStream().pipe(file);


  ////////////////////////////////////////////////////////////////////////////////////////


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


/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var message = null;
  //var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  //var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

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
