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
  awsS3Config = {
    accessKeyId: config.S3_ID,
    secretAccessKey: config.S3_SECRET,
    region: 'us-west-1'
  },
  s3 = new AWS.S3(awsS3Config),
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
  console.log(':::::::::::::::   getImagesByProjectId  :::::::::::::::');
  Project.findOne({
    query: { _id: req.params.projectId },
    fields: {
      mainImageData: 1,
      imageGalleryData: 1
    }
  }, (err, response) => {
    if(err) {
      console.log(':::::::::::::::   getImagesByImageId  ERROR!!!! :::::::::::::::\n', err);
      return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
    }
    console.log(':::::::::::::::   getImagesByImageId  RESPONSE :::::::::::::::\n', response);

    let image = response.imageGalleryData.find(x => {
      return x.response === req.params.imageId;
    });

    console.log(':::::::::::::::   getImagesByImageId  image :::::::::::::::\n', image);

    return res.body = image;
  });
};

/**
 *
 * Queries Mongo for Image URLs for full images and thumbs
 *
 * @param req
 * @param res
 */
exports.getImagesByProjectId = (req, res) => {
  Project.find({ _id: req.params.projectId }, { mainImageData: 1, imageGallery: 1 },
    (err, response) => {
    if(err) {
      console.error('error :: getImagesByProjectId :: error\n', err);
      return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
    }
    console.log(':::::::::::::::   getImagesByProjectId  RESPONSE :::::::::::::::\n', response);
    return res.json(response);
  });
};


/**
 *
 * Queries Mongo and returns the s3 URLs for all documents associated with a project
 *
 * @param req
 * @param res
 */
exports.getDocumentsByProjectId = (req, res) => {
  Project.find({ _id: req.params.projectId }, { fileGallery: 1 },
    (err, response) => {
      if(err) {
        console.error('error :: getImagesByProjectId :: error\n', err);
        return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
      }
      console.log(':::::::::::::::   getImagesByProjectId  RESPONSE :::::::::::::::\n', response);
      return res.json(response);
    });
};



/**
 *

 {
	"Version": "2012-10-17",
	"Id": "Policy1458446607575",
	"Statement": [
		{
			"Sid": "AllowPublicRead",
			"Effect": "Allow",
			"Principal": {
				"AWS": "*"
			},
			"Action": [
				"s3:PutObject",
				"s3:PutObjectAcl",
				"s3:GetObject"
			],
			"Resource": "arn:aws:s3:::mapping-slc-file-upload/*"
		}
	]
}

 */

exports.getDefaultImageByProjectId = (req, res) => {
  console.log(':::::::::::::::   getDefaultImageByProjectId   :::::::::::::::');
  Project.find({
    query: { _id: req.params.projectId },
    fields: {
      mainImageData: 1
    }
  }, (err, response) => {
    if(err) {
      console.log(':::::::::::::::   getDefaultImageByProjectId  ERROR!!!! :::::::::::::::\n', err);
      return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
    }
    console.log(':::::::::::::::   getDefaultImageByProjectId  RESPONSE :::::::::::::::\n', response);
    return res.body = response;
  });
};


exports.getS3ImageData = (req, res) => {
  console.log(':::::::::::::::   getImagesByProjectId   get media route:::::::::::::::');

  let sourceBucket = 'project-directory';

  // let thumbParams = {
  //   Bucket: 'mapping-slc-file-upload',
  //   Prefix: sourceBucket + '/' + req.params.projectId + '/thumbs',
  //   EncodingType: 'url'
  // };

  let imageParams = {
    Bucket: 'mapping-slc-file-upload',
    Prefix: sourceBucket + '/' + req.params.projectId,
    EncodingType: 'url'
  };

  s3.listObjectsV2(imageParams, (err, images) => {
    if(err) {
      console.log(':::::::::::::::`ERR RRRRRRR`::::::::::::::::\n', err, '\n\n');
      res.json({ message: 'success', errorMessage: err });
    }
    console.log(':::::::::::::::`images`::::::::::::::::\n', images, '\n\n');
    res.json({ message: 'success', imageData: images });
  });

};


exports.getS3BucketAcl = (req, res) => {
  let sourceBucket = 'project-directory';
  let bucketParams = {
    Bucket: 'mapping-slc-file-upload'
  };

  s3.getBucketAcl(bucketParams, (err, bucketAclLevel) => {
    if(err) {
      console.log(':::::::::::::::`ERR RRRRRRR`::::::::::::::::\n', err, '\n\n');
      res.json({ message: 'success', errorMessage: err });
    }
    console.log(':::::::::::::::`bucketAclLevel`::::::::::::::::\n', bucketAclLevel, '\n\n');
    res.json({ message: 'success', bucketAclLevel: bucketAclLevel });
  });

};

exports.getS3ObjectAcl = (req, res) => {

  let objectParams = {
    Bucket: 'mapping-slc-file-upload',
    Key: 'project-directory/561978272356222b1ceb5a7c/Cathedral_of_the_Madeleine.png'
  };

  s3.getObjectAcl(objectParams, (err, objectAclLevel) => {
    if(err) {
      console.log(':::::::::::::::`ERR RRRRRRR`::::::::::::::::\n', err, '\n\n');
      res.json({ message: 'success', errorMessage: err });
    }
    console.log(':::::::::::::::`objectAclLevel`::::::::::::::::\n', objectAclLevel, '\n\n');
    res.json({ message: 'success', objectAclLevel: objectAclLevel });
  });

};




/**
 * get pre-signed URL from AWS S3
 *
 * req.params.id {string} - the unique ID of the requesting source - either `projectId` or `userId`
 * req.params.imageId {string} - file name with extension
 */
exports.getS3SignedUrl = (req, res) => {

  var fileToGet = req.params.fileId;
  var sourceIdBucket = req.params.sourceId || req.params.userId || req.params.projectId;
  let directory = s3Config.directory.find(x => {
    return x.name === dirDestination
  })
  .then(response => {
    return response.path;
  });
  var fileData = {
    fileToGet: fileToGet,
    sourceIdBucket: sourceIdBucket,
    params: {
      Bucket: s3Config.bucket + '/' + directory + '/' + sourceIdBucket,
      Key: fileToGet
    }
  };

  let getSignedUrl = Promise.promisify(s3.getSignedUrl(method, params));

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
};

/**
 * download file from AWS S3
 *
 * req.params.id {string} - user._id
 * req.params.imageId {string} - file name with extension
 */

exports.getS3File = (req, res) => {
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

  s3.getObject(fileData.params, function (err, callback) {
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
