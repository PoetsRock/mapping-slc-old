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




exports.uploadUserProfileImage = function (req, res) {


  /**
   *
   *
   * Express.js Response methods
   *
   * The methods on the response object (res) in the following table can send a response to the client, and terminate the request-response cycle. If none of these methods are called from a route handler, the client request will be left hanging.

   * `res.sendFile`  Send a file as an octet stream.
   * `res.download()`  Prompt a file to be downloaded.
   *
   **/



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
 * get file from AWS S3
 */

exports.getS3File = function (req, res) {

  var awsS3Config = {
    accessKeyId: config.aws.s3Id,
    secretAccessKey: config.aws.s3Secret,
    region: 'us-west-1'
  };

  var s3File = new AWS.S3(awsS3Config);
  var fileToGet = req.params.mediaId;
  var userIdBucket = req.params.userId;
  var params = {
    Bucket: s3.bucket + '/' + s3.directory.user + '/' + userIdBucket,
    Key: fileToGet
  };
  var imageData = {
    fileToGet: fileToGet,
    userIdBucket: userIdBucket,
    params: params
  };

  var pathToLocalDisk = 'modules/users/client/img/profile/uploads/';
  var userProfileImage = pathToLocalDisk + fileToGet;
  var fileType = '';

  //var returnedFile = require('fs').createWriteStream(userProfileImage);
console.log('userProfileImage:\n', userProfileImage);


  s3File.getObject(params, function(err, callback) {
    require('string_decoder');
      if(err) {
        console.log('err:\n', err);
        res.send({
          message: 'ERROR, yo: ' + err
        })
      } else {
        console.log('callback:\n', callback, '\n\n\n');
        console.log('callback.Body:\n', callback.Body);

        var imageAsBase64Array = callback.Body.toString('base64');
        var imageAsUtf8 = callback.Body.toString('Utf8');
        var imageToString = callback.Body.toString();

        //var StringDecoder = require('string_decoder').StringDecoder;
        //var decoder = new StringDecoder('utf8');

        //var image = new Buffer(callback.Body);
        //console.log(decoder.write(image));




        ////var buf = new Buffer('test');
        //var json = JSON.stringify(callback.Body);
        //
        ////console.log('json', json);
        //// '{"type":"Buffer","data":[116,101,115,116]}'
        //
        //var image = JSON.parse(json, function(key, value) {
        //  return value;
        //  //return value && value.type === 'Buffer'
        //  //  ? new Buffer(value.data)
        //  //  : value;
        //});
        //
        //console.log('image::::::::::::::::::::::::::::::::::::::::::::::::::\n', image);





        res.status(200).send({
          message: 'Success: Profile Image Delivered:\n',
          fullResponse: callback,
          imageAsBase64Array: imageAsBase64Array,
          imageAsUtf8: imageAsUtf8,
          imageObjectAsString: imageToString
        });
      }
    });
  //s3File.getObject(params).createReadStream().pipe(returnedFile);


};



  /**
   *
   * source: http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-examples.html#Amazon_S3__Streaming_Objects_to_Files_on_Disk__getObject_

   //register an 'httpData' event listener on the request object to access each chunk of data received across the wire (as Buffer objects)

  s3File.getObject(params).
   on('httpData', function(returnedFile) { file.write(returnedFile); }).
   on('httpDone', function() { returnedFile.end(); }).
   send();




   //if(!s3Object) {
  //  var sendFileOptions = {
  //    dotfiles: 'deny',
  //    headers: {
  //      'x-timestamp': Date.now(),
  //      'x-sent': true
  //    }
  //  };
  //  var callback = function callback(err, responseObject) {
  //    if(err) {
  //      console.log('err:\n', err);
  //      res.send({
  //        message: 'ERROR, yo: ' + err
  //      })
  //    } else {
  //      console.log('responseObject:\n', responseObject);
  //      res.status(200).send({
  //        message: 'Success: Profile Image Delivered:\n',
  //        object: responseObject,
  //        imageData: imageData
  //      });
  //    }
  //  };
  //
  //  res.sendFile(path, sendFileOptions, callback);
  //
  //}



   */
/**
 * upload user profile image to Amazon S3
 */

exports.uploadUserProfileImageWithOptimization = function(req, res) {



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

  source.store(tinyParams);
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

