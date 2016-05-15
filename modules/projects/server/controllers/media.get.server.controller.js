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
  s3Url = 'https://' + s3Config.bucket + '.s3-' + s3Config.region + '.amazonaws.com',
  crypto = require('crypto'),
  moment = require('moment'),
  tinify = require('tinify');


exports.findOneVideoId = function (req, res) {
  Project.findById(req.body._id)
  .exec(function (err, project) {
    if (err) {
      return next(err);
    }
    if (!project) {
      return next(new Error('Failed to load project ' + id + 'associated with the requested video.')
      )
    }
    res.vimeoId = project.vimeoId;
  });
};


exports.getImageByImageId = (req, res) => {

};


exports.getImagesByProjectId = (req, res) => {

  console.log(':::::::::::::::   getImagesByProjectId   :::::::::::::::');
  console.log('req.params:::::::::::::::\n', req.params, '\n\n');

  var awsS3Config = {
    accessKeyId: config.S3_ID,
    secretAccessKey: config.S3_SECRET,
    region: 'us-west-1'
  };
  /** now upload document to S3 */
  let s3 = new AWS.S3(awsS3Config);

  // req.params
  //req.params.projectId


  // var sourceIdBucket = req.params.sourceId || req.params.userId || req.params.projectId;
  // let directory = s3Config.directory.find(x => { return x.name === dirDestination })
  // .then(response => {
  //   return response.path;
  // });
  // console.log('s3 upload directory:::::::::::::::', directory, '\n\n');

//
//  https://s3-us-west-1.amazonaws.com/mapping-slc-file-upload/project-directory/561978272356222b1ceb5a7c/thumbs/test.png

  let sourceBucket = 'project-directory';
//Bucket: s3Config.bucket + '/' + sourceBucket + '/' + req.params.projectId,

  var thumbParams = {
    Bucket: 'mapping-slc-file-upload',
    Prefix: sourceBucket + '/' + req.params.projectId + '/thumbs',
    EncodingType: 'url'
  };

  var imageParams = {
    Bucket: 'mapping-slc-file-upload',
    Prefix: sourceBucket + '/' + req.params.projectId,
    EncodingType: 'url'
  };

  console.log('params:::::::::::::::\n', params, '\n\n');

  let listObjects = Promise.promisifyAll(s3);


  listObjects.listObjectsV2Async(imageParams)
  .then(response => {
    console.log(':::::::::::::::response::::::::::::::::\n', response, '\n\n');


    let root = response.Contents.Name + response.Contents.Prefix;
    return response.Contents.map(x => {
      let projectImage = {};
      projectImage.image = {};
      projectImage.image.url = root + x.Key;
      projectImage.image.eTag = x.ETag;
    });
  })
  .then(projectImages => {
    listObjects.listObjectsV2Async(imageParams)
    .then(response => {
      console.log(':::::::::::::::response::::::::::::::::\n', response, '\n\n');

      let projectThumbs = response.Contents.map(x => {
        let projectImage = {};
        projectImage.thumb = {};
        projectImage.thumb.url = root + x.Key;
        projectImage.thumb.eTag = x.ETag;
      });
    })
    .catch(err => {
      console.log(':::::::::::::::err:::::::::::::::::\n', err);
      res.send(err);
    });


  });
};


/**
 * get pre-signed URL from AWS S3
 *
 * req.params.id {string} - the unique ID of the requesting source - either `projectId` or `userId`
 * req.params.imageId {string} - file name with extension
 */
exports.getS3SignedUrl = (req, res) => {

  console.log(':::::::::::::::   getS3SignedUrl   :::::::::::::::');
  console.log('req.params:::::::::::::::\n', req.params, '\n\n');

  var awsS3Config = {
    accessKeyId: config.S3_ID,
    secretAccessKey: config.S3_SECRET,
    region: 'us-west-1'
  };
  var s3 = new AWS.S3(awsS3Config);
  var fileToGet = req.params.fileId;
  var sourceIdBucket = req.params.sourceId || req.params.userId || req.params.projectId;
  let directory = s3Config.directory.find(x => {
    return x.name === dirDestination
  })
  .then(response => {
    return response.path;
  });
  console.log('s3 upload directory:::::::::::::::', directory, '\n\n');
  var fileData = {
    fileToGet: fileToGet,
    sourceIdBucket: sourceIdBucket,
    params: {
      Bucket: s3Config.bucket + '/' + directory + '/' + sourceIdBucket,
      Key: fileToGet
    }
  };

  let getSignedUrl = Promise.promisify(s3.getSignedUrl(method, params));

  console.log('getSignedUrl promisified:::::::::::::::\n', getSignedUrl, '\n\n');

  getSignedUrl('getObject', fileData.params)
  .then(response => {
    console.log('The URL is: ', response);
    res.status(200).send({
      message: 'Success: URL is available for 15 minutes',
      url: response
    });
  })
  .catch(err => {
    console.log('Error getting file: ', err);
    console.log('err.statusCode: ', err.statusCode);
    res.status(400).send({
      message: 'Error getting file',
      error: err
    });
  });

  // s3.getSignedUrl('getObject', fileData.params,
  // (err, url) => {
  //   if (err) {
  //     res.status(400).send({
  //       message: 'Error',
  //       error: err
  //     })
  //   }
  //   console.log('The URL is: ', url);
  //   res.status(200).send({
  //     message: 'Success: URL is availble for 15 minutes',
  //     url: url
  //   });
  // });
};

/**
 * get file from AWS S3
 *
 * req.params.id {string} - user._id
 * req.params.imageId {string} - file name with extension
 */

exports.getS3File = (req, res) => {
  var awsS3Config = {
    accessKeyId: config.S3_ID,
    secretAccessKey: config.S3_SECRET,
    region: 'us-west-1'
  };
  var s3 = new AWS.S3(awsS3Config);
  var fileToGet = req.params.fileId;
  var userIdBucket = req.params.userId;
  var fileData = {
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


  s3.getObject(fileData.params, function (err, callback) {
    //require('string_decoder');
    if (err) {
      console.log('err:\n', err);
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
            message: 'Success: File Delivered:\n'
            // fullResponse: callback,
            // imageAsBase64Array: imageAsBase64Array,
            // imageAsUtf8: imageAsUtf8
          });
        });
    }
  });
};
