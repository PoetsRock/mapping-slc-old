'use strict';

let mongoose = require('mongoose'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Project = mongoose.model('Project'),
  multiparty = require('multiparty'),
  config = require(path.resolve('./config/config')),
  Promise = require('bluebird'),
  moment = require('moment'),
  AWS = require('aws-sdk');

let s3Config = {
    bucket: 'mapping-slc-file-upload',
    region: 'us-west-1',
    directory: [
      { name: 'admin', path: 'admin-directory' },
      { name: 'project', path: 'project-directory' },
      { name: 'user', path: 'user-directory' }
    ]
};
let awsS3Config = {
  accessKeyId: config.S3_ID,
  secretAccessKey: config.S3_SECRET,
  region: 'us-west-1'
};
let s3 = new AWS.S3(awsS3Config);
Promise.promisifyAll(s3);



  /**
 *
 * @param req
   * @param req.body.bucket {string}
   * @param req.body.key {string}
 * @param res
 */
exports.deleteImageByImageId = (req, res) => {
  let imageData = req.body;
  let bucket = 'mapping-slc-file-upload';
  let key = imageData.key || 'project-directory/' + req.params.projectId + '/' + imageData.imageId + '.' + imageData.imageExt;

  console.log('req.params:\n', req.params);
  console.log('imageData:\n', imageData);

  let objectParams = { Bucket: bucket, Key: key };
  return s3.deleteObjectAsync(objectParams)
  .then(deleteImageResponse => {
    console.log('deleteImageResponse:\n', deleteImageResponse);
    return deleteImageResponse;
  })
  .then(deleteMainImgRes => {
    console.log('deleteMainImgRes:\n', deleteMainImgRes);
    /** on success, delete image thumbnail */
    objectParams.Key = 'project-directory/' + req.params.projectId + '/thumb_' + req.params.fileId;
    return s3.deleteObjectAsync(objectParams);
  })
  .then(deleteThumbImgRes => {
    console.log('deleteMainImgRes:\n', deleteThumbImgRes);
    // on successful deletion of thumbnail, remove image from imageGallery in Mongo
    let fieldsToUpdate = { $pull: {
      imageGallery: { imageId: req.params.imageId }
    }};

    // set new default image if any images are still associated with the project
    if(imageData.isDefaultImage && req.project.imageGallery[0]) {
      const newMainImg = _.extend({}, req.project.imageGallery[0]);
      delete newMainImg._id;
      delete newMainImg.isDefaultImage;
      delete newMainImg.imageS3Key;
      delete newMainImg.Location;
      fieldsToUpdate.mainImage = newMainImg;
    } else if (imageData.isDefaultImage) {  // otherwise, set main image to empty object
      fieldsToUpdate.mainImage = {};
    }

    return Project.findOneAndUpdate(
      { _id: req.params.projectId },
      fieldsToUpdate,
      { new: true },
      ((err, response) => {
        if (err) {
          console.error('\n\nERROR updating mongo:::::::::::::::::::::::::::::::::::\n', err, '\n\n');
          res.status(400).send({ message: errorHandler.getErrorMessage(err) });
        }
        console.log('response from mongo after successfully deleting an image `response`:\n', response);
        return res.jsonp(response);
      }));
  })
  .catch(err => {
    console.log('`deleteImageByImageId ERROR\n', err, '\n\n');
    res.status(400).send({ message: 'error deleting image', errorObj: errorHandler.getErrorMessage(err), imageId: req.params.fileId });
  });
};


/**
 *
 * @param req
 * @param req.body.bucket {string}
 * @param req.body.key {string}
 * @param res
 */
exports.deleteImagesByBucket = (req, res) => {
  let imageData = req.body;
  let bucket = 'mapping-slc-file-upload';

  //create function for getAllImagesByBucket for s3
  let images = [];

  // with that list of all images in a bucket, map them to create the array to be passed to the deleteObjects function
  let imagesArray = images.map(x => {

  });

  let imagesToDelete = () => {
    let formattedImagesArray = [];
    return formattedImagesArray;
  };


  let objectParams = {
    Bucket: bucket,
    Delete: {
      Objects: formattedImagesArray
    }
  };

  Promise.promisifyAll(s3);
  return s3.deleteObjectsAsync(objectParams)
  .then(deleteImageResponse => {
    return deleteImageResponse;
  })
  .then(() => {
    /** on success, delete image thumbnail */
    objectParams.Key = 'project-directory/' + req.params.projectId + '/thumb_' + req.params.fileId;
    return s3.deleteObjectAsync(objectParams);
  })
  .then(() => {
    // on successful deletion of thumbnail, remove image from imageGallery in Mongo
    let arrayItemToUpdate = { $pull: {
      imageGallery: { imageId: req.params.imageId }
    }};

    let query = Project.find({ _id: req.params.projectId }, { imageGallery: 1 });

    let imageGalleryArray = query.exec()
    .then(imageGallery => {
      return imageGallery;
    })
    .catch(err => {
      console.log('`deleteImagesByBucket ERROR\n', err, '\n\n');
      res.status(400).send({ message: 'error deleting image', errorObj: errorHandler.getErrorMessage(err), imageId: req.params.imageId });
    });

  imageGalleryArray.forEach(image => {
    // `MongooseArray.pull([args...])`: Remove an item from an array:
    //http://mongoosejs.com/docs/api.html#types_array_MongooseArray.pull
    Project.imageGallery.pull({ imageId: image.imageId });
  });

  });
};

