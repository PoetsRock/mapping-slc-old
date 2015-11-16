'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Project = mongoose.model('Project'),
  aws = {
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
  s3Url = 'https://' + aws.bucket + '.s3-' + aws.region + '.amazonaws.com';

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  console.log('req.body::::::::::::::::::::::::::\n', req.body);
  console.log('req.user::::::::::::::::::::::::::\n', req.user);
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
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
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  console.log('req.body::::::::::::::::::::::::::\n', req.body);
  var user = req.user;
  var message = null;

  if (user) {
    fs.writeFile('./modules/users/client/img/profile/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = 'modules/users/client/img/profile/uploads/' + req.files.file.name;

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
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};



/**
 * upload user profile image to Amazon S3
 */

exports.uploadUserProfileImage = function(req, res) {
  var request = req.body;
  var user = request.user;
  console.log('user:\n', user);


  var fileName = request.filename;
  //var path = aws.directory.user + '/' + fileName;
  var path = aws.directory.user + '/' + user._id + '/' + fileName;

  var readType = 'private';

  var expiration = moment().add(5, 'm').toDate(); //15 minutes

  var s3Policy = {
    'expiration': expiration,
    'conditions': [{
      'bucket': aws.bucket
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
  var signature = crypto.createHmac('sha1', aws.keys.aws.s3Secret)
    .update(new Buffer(base64Policy, 'utf-8')).digest('base64');



  console.log('s3Policy:\n', s3Policy);
  console.log('stringPolicy:\n', stringPolicy);
  console.log('base64Policy:\n', base64Policy);


  var credentials = {
    url: s3Url,
    fields: {
      key: path,
      AWSAccessKeyId: aws.keys.aws.s3Id,
      acl: readType,
      policy: base64Policy,
      signature: signature,
      'Content-Type': request.type,
      success_action_status: 201
    }
  };

  if (user) {
    //now save url to mongoDb

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();

    user.profileImageURL = 'https://s3-' + aws.region + '.amazonaws.com/' + aws.bucket + '/' + aws.directory.user + '/' + user._id + '/' + fileName;

      user.save(function (saveError) {
      if (saveError) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(saveError)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          }
          //else {
          //  //console.log('user response thingggggggg:\n', user);
          //  res.json(user);
          //}
        });
      }
    });
  } else {
    console.log('error: user data not saved on image upload');
  }

  console.log('credentials:\n', credentials);
  res.jsonp(credentials);



};




//todo refactor
/**
 * upload project files to Amazon S3
 */

exports.uploadProject = function(req, res) {
  var request = req.body;
  var fileName = request.filename;
  var project = req.body.project;
  var path = aws.directory.project + '/' + project._id + '/' + fileName;

  var readType = 'private';

  var expiration = moment().add(5, 'm').toDate(); //15 minutes

  var s3Policy = {
    'expiration': expiration,
    'conditions': [{
      'bucket': aws.bucket
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
  var signature = crypto.createHmac('sha1', aws.keys.aws.s3Secret)
    .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

  var credentials = {
    url: s3Url,
    fields: {
      key: path,
      AWSAccessKeyId: aws.keys.aws.s3Id,
      acl: readType,
      policy: base64Policy,
      signature: signature,
      'Content-Type': request.type,
      success_action_status: 201
    }
  };
  console.log('credentials:\n', credentials);
  res.jsonp(credentials);
  //todo call on above `update()` object to update mongo
  //see above for working thingy
  //User.profileImageURL = 'https://s3-' + aws.region + '.amazonaws.com/' + aws.bucket + '/' + aws.directory.user + '/' + fileName;
};
