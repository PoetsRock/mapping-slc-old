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
  //Project = mongoose.model('Project'),
  User = mongoose.model('User'),
  AWS = require('aws-sdk'),
  s3 = {
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
  s3Url = 'https://' + s3.bucket + '.s3-' + s3.region + '.amazonaws.com';

//old code
/**
 * upload user profile image to Amazon S3
 */

exports.uploadUserProfileImage = function(req, res) {
  var user = req.body.user;
  //console.log('req.ServerResponse.req.locals:\n', req.ServerResponse.req.locals);
  //console.log('req  v2:\n', req.ServerResponse.req);
  console.log('req  v2:\n', req);
  //console.log('req.body  v2:\n', req.body);
  //console.log('req.origFileName:\n', req.bufferImage);
  var bufferImage = new Buffer(req.body.toString('base64'),'base64');
  //console.log('bufferImage  v2:\n', bufferImage);

  //var fileName = req.body.fileName;
  var fileName = req.body.fileName;
  var path = s3.directory.user + '/' + user._id + '/' + fileName;
  var readType = 'private';
  var expiration = moment().add(5, 'm').toDate(); //15 minutes

  tinify.key = config.tinyPngKey;

  var tinyParams = {
    service: 's3',
    aws_access_key_id: config.aws.s3Id,
    aws_secret_access_key: config.aws.s3Secret,
    region: s3.region,
    path: s3.bucket + '/' + path
  };

  //console.log('req.origFileName:\n', req.body.fileName);

  //console.log('tinyParams  v2:\n', tinyParams);

  var source = tinify.fromFile(req.body.fileName);

  //console.log('source  v1:\n', source);

  source.store(tinyParams);

  //console.log('source  v2:\n', source);

  //var s3Policy = {
  //  'expiration': expiration,
  //  'conditions': [{
  //    'bucket': s3.bucket
  //  },
  //    ['starts-with', '$key', path],
  //    {
  //      'acl': readType
  //    },
  //    {
  //      'success_action_status': '201'
  //    },
  //    ['starts-with', '$Content-Type', req.body.type],
  //    ['content-length-range', 2048, 10485760], //min and max
  //  ]
  //};
  //
  //var stringPolicy = JSON.stringify(s3Policy);
  //var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');
  //
  //// sign policy
  //var signature = crypto.createHmac('sha1', config.aws.s3Secret)
  //  .update(new Buffer(base64Policy, 'utf-8')).digest('base64');
  //
  //var credentials = {
  //  url: s3Url,
  //  fields: {
  //    key: path,
  //    AWSAccessKeyId: config.aws.s3Id,
  //    acl: readType,
  //    policy: base64Policy,
  //    signature: signature,
  //    'Content-Type': req.body.type,
  //    success_action_status: 201
  //  }
  //};

  //now save url to mongoDb
  var query = {
    _id: user._id
  };

  var propertiesToUpdate = {
    profileImageURL: 'https://s3-' + s3.region + '.amazonaws.com/' + s3.bucket + '/' + s3.directory.user + '/' + user._id + '/' + fileName,
    profileImageFileName: fileName,
    updated: Date.now()
  };
  var options = {

  };
  //call on mongoose Model.update function to update db
  User.update(query, propertiesToUpdate).exec();


  res.jsonp(source);
  //res.jsonp(credentials);
  //res.send(credentials);


};

// old code end

/**
 * upload user profile image to Amazon S3
 */

/**
 *
 * new code
 *
 *
 *

exports.uploadUserProfileImage = function (req, res) {
  //console.log('req:::::::::::::::::::::::::::::::\n', req);
  var user = req.body.user;



  var unOptImage = req.body.filename.replace(/\s/g, '_'); //substitute all whitespace with underscores
  var optImage = null;
  var filePath = s3.directory.user + '/' + user._id + '/' + unOptImage;


  //perform image optimization with tinypng.com
  tinify.key = config.tinyPngKey;


  console.log('unOptImage:\n', unOptImage);
  console.log('filePath:\n', filePath);




  var imageBuffer = new Buffer(unOptImage, 'utf-8').toString('base64');

  // sign policy
  var signature = crypto.createHmac('sha1', s3.keys.aws.s3Secret)
    .update(new Buffer(imageBuffer, 'utf-8')).digest('base64');

  console.log('imageBuffer:\n', imageBuffer, '\n\n');
  console.log('signature:\n', signature, '\n\n');

  var fs = require('fs');
  fs.readFile(imageBuffer, function(err, sourceData) {
    if (err) {throw err;}
    tinify.fromBuffer(sourceData).toBuffer(function(err, resultData) {
      if (err) {
        console.log('err:\n', err);
        throw err;
      // ...
    } else {
        console.log('resultData:\n', resultData);
      }
    });
  });




  ////now save url to mongoDb
  user.profileImageURL = 'https://s3-' + s3.region + '.amazonaws.com/' + s3.bucket + '/' + s3.directory.user + '/' + user._id + '/' + optImage;





  //var tinyParams = {
  //  service: 's3',
  //  aws_access_key_id: config.s3Id,
  //  aws_secret_access_key: config.s3Secret,
  //  region: s3.region,
  //  path: filePath
  //};





  //
  //var readType = 'private';
  //var expiration = moment().add(5, 'm').toDate(); //15 minutes
  //var s3Policy = {
  //  'expiration': expiration,
  //  'conditions': [{
  //    'bucket': s3.bucket
  //  },
  //    ['starts-with', '$key', filePath],
  //    {
  //      'acl': readType
  //    },
  //    {
  //      'success_action_status': '201'
  //    },
  //    ['starts-with', '$Content-Type', req.body.type],
  //    ['content-length-range', 2048, 10485760], //min and max
  //  ]
  //};
  //var stringPolicy = JSON.stringify(s3Policy);
  //var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');
  //
  //// sign policy
  //var signature = crypto.createHmac('sha1', s3.keys.aws.s3Secret)
  //  .update(new Buffer(base64Policy, 'utf-8')).digest('base64');
  //
  //var credentials = {
  //  url: s3Url,
  //  fields: {
  //    key: filePath,
  //    AWSAccessKeyId: s3.keys.aws.s3Id,
  //    acl: readType,
  //    policy: base64Policy,
  //    signature: signature,
  //    'Content-Type': req.body.type,
  //    success_action_status: 201
  //  }
  //};



  //
  //tinify.fromFile(credentials)
  //  .toFile(function(err, optImage) {
  //    if (err instanceof tinify.AccountError) {
  //      console.log('ACCOUNT ERROR!!\n');
  //      console.log('The error message is:\n' + err.message);
  //      // Verify your API key and account limit.
  //    } else if (err instanceof tinify.ClientError) {
  //      console.log('ClientError ERROR!!\n');
  //      console.log('The error message is:\n' + err.message);
  //      // Check your source image and request options.
  //    } else if (err instanceof tinify.ServerError) {
  //      console.log('ServerError ERROR!!\n');
  //      console.log('The error message is:\n' + err.message);
  //      // Temporary issue with the Tinify API.
  //    } else if (err instanceof tinify.ConnectionError) {
  //      console.log('ConnectionError ERROR!!\n');
  //      console.log('The error message is:\n' + err.message);
  //      // A network connection error occurred.
  //    } else if (err) {
  //      // Something else went wrong, unrelated to the Tinify API.
  //      console.log('SOMETHING WEIRDS HAPPENED?!?!\n');
  //      console.log('The error message is:\n' + err.message);
  //    } else {
  //
  //      console.log('unOptImage\n', unOptImage);
  //      console.log('optImage\n', optImage);
  //
  //      //upload to aws s3 with compressed image
  //      //source.store(tinyParams);
  //
  //      res.send(optImage);
  //
  //    }
  //  });


  //var updateUser = {
  //  user: {
  //    body: user
  //    }
  //  };
  //Users.update(updateUser);


  //res.jsonp(credentials);

};


/**
 *
 * new code end
 *
 *
 */



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

  var awsS3Config = {
    accessKeyId: config.aws.s3Id,
    secretAccessKey: config.aws.s3Secret,
    region: 'us-west-1'
  };

  var s3File = new AWS.S3(awsS3Config);
  var fileToGet = req.params.photoId;
  var userIdBucket = req.params.userId;
  var params = {
    Bucket: s3.bucket + '/' + s3.directory.user + '/' + userIdBucket,
    Key: fileToGet
  };
  var stuff = {
    fileToGet: fileToGet,
    userIdBucket: userIdBucket,
    params: params
  };

  var pathToLocalDisk = 'modules/users/client/img/profile/uploads/';
  var userProfileImage = pathToLocalDisk + fileToGet;
  var fileType = '';

  var returnedFile = require('fs').createWriteStream(userProfileImage);
  s3File.getObject(params).createReadStream().pipe(returnedFile);

  res.status(200).send({
    message: 'Success: Profile Image Delivered'
  });

  console.log('stuff:\n', stuff);

};




//todo refactor
/**
 * upload project files to Amazon S3
 */

exports.uploadProject = function (req, res) {
  console.log('req:::::::::::req:::::::::::::::::::::req::::::::::::\n', req);
  console.log('req.body:::::::::::req.body::::::::::::::::req.body::::::::::::\n', req.body);
  //var user = req.body.user;
  var project = req.body.project;
  var fileName = req.body.filename.replace(/\s/g, '_'); //substitute all whitespace with underscores
  var filePath = s3.directory.project + '/' + user._id + '/' +  + '/' + fileName;
  var readType = 'private';
  var expiration = moment().add(5, 'm').toDate(); //15 minutes
  var s3Policy = {
    'expiration': expiration,
    'conditions': [{
      'bucket': s3.bucket
    },
      ['starts-with', '$key', filePath],
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


};

