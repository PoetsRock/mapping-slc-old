'use strict';

const Promise = require('bluebird'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multiparty = require('multiparty'),
  config = require(path.resolve('./config/config')),
  AWS = require('aws-sdk'),
  Kraken = require('kraken'),
  projectUtilities = require('./projects.server.utilities.js');

// console.log('mongoose.connections.db:\n', mongoose.connections[0].db);

let s3Config = {
  bucket: 'mapping-slc-file-upload',
  region: 'us-west-1',
  directory: [
    {name: 'admin', path: 'admin-directory'},
    {name: 'project', path: 'project-directory'},
    {name: 'user', path: 'user-directory'}
  ]
};

/** config aws s3 config settings, file object, and create a new instance of the s3 service */
let awsS3Config = {
  accessKeyId: config.S3_ID,
  secretAccessKey: config.S3_SECRET,
  region: 'us-west-1'
};

let s3 = new AWS.S3(awsS3Config);
Promise.promisifyAll(s3);
mongoose.Promise = Promise;
let Project = mongoose.model('Project');
let User = mongoose.model('User');


/**
 * saves project image data in Mongo
 *
 * @param req
 * @param res
 */
const updateMongoProjectImages = (req, res) => {
  let fileData = req.body.fileData;
  let fieldsToUpdate = req.body.fieldsToUpdate;
  const baseUrl = 'https://s3-us-west-1.amazonaws.com/mapping-slc-file-upload/';

  fieldsToUpdate.$addToSet.imageGallery.imageS3Key = fileData.s3Obj.Key;
  fieldsToUpdate.$addToSet.imageGallery.Location = baseUrl + fileData.s3Obj.Key;


  if(req.body.fileData.isDefaultImage) {
    fieldsToUpdate.mainImage = {
      imageUrl: fileData.fullImageUrl ,
      imageId: fileData.fileId,
      thumbImageUrl: fileData.thumbImageUrl,
      thumbImageId: 'thumb_' + fileData.fileId,
      imageSize: fileData.size,
      imageType: fileData.type,
      imageExt: fileData.fileExt,
      imageName: fileData.name,
      imageTags: fileData.imageTags,
      isDefaultImage: fileData.isDefaultImage,
      imageS3Key: fileData.s3Obj.Key,
      Location: baseUrl + fileData.s3Obj.Key
    };
  }

  /** now save the image URLs to mongoDb */
  let query = Project.findOneAndUpdate(
    { _id: req.params.projectId },
    fieldsToUpdate,
    { new: true }
  ).exec();

  /** now send response to front end */
  query.then(response => {
    console.log('MONGOOOOOOOOOOOOOOOOOOOOOOO  `response`:\n', response);
    return res.jsonp({
      link: fileData.fullImageUrl,
      response: response
    });
  })
  .catch(err => {
    console.error('\n\nERROR updating Mongo:\n', err);
    return res.status(400).send({message: errorHandler.getErrorMessage(err)});
  });

};


/**
 * saves user profile image data in Mongo
 *
 * @param req
 * @param res
 */
const updateMongoUserImages  = (req, res) => {
  let fileData = req.body.fileData;
  let fieldsToUpdate = req.body.fieldsToUpdate;

  /** now save the image URLs to mongoDb */
  let query = User.findOneAndUpdate(
    { _id: req.body.fields.bucketId[0] },
    fieldsToUpdate,
    { new: true }
  ).exec();

  /** now send response to front end */
  query.then(response => {
    console.log('MONGOOOOOOOOOOOOOOOOOOOOOOO  `response`:\n', response);
    return res.jsonp({
      link: fileData.fullImageUrl,
      response: response
    });
  })
  .catch(err => {
    console.error('\n\nERROR updating Mongo:\n', err);
    return res.status(400).send({message: errorHandler.getErrorMessage(err)});
  });

};


/**
 *
 * Uploads images to s3 - stores files in `mapping-slc-file-upload/project-directory/<project-id>/`
 *
 * @param req
 * @param res
 */
exports.uploadProjectImages = (req, res) => {
  let fileData = req.body.fileData;

  /* for direct uploads, file stream is on `fileData.s3Obj.Body.file`; for multipart form data, stream is on `fileData.s3Obj.Body`  */

  // if (fileData.s3Obj.Body.file) {
  //   console.log('IF :: "fileData.s3Obj.Body.file"');
  //   fileData.body.stream = fileData.s3Obj.Body.file;
  // } else if (fileData.body) {
  //   console.log('ELSE IF :: "fileData.body"');
  //   fileData.body.stream = fileData.s3Obj.Body
  // }

// todo -- current issue is that `fieldsToUpdate` is undefined, so i'm getting an error: "'$addToSet' of undefined"
  //todo - workaround; need to refactor
  fileData.s3Obj.Metadata.imageName = req.headers['file-name'] || req.body.fileData.file.originalFilename;

  const kraken = new Kraken({
    api_key: config.KRAKEN_KEY,
    api_secret: config.KRAKEN_SECRET
  });

  const opts = {
    file: fileData.path || fileData.body.stream,  // added this #3 & final
    lossy: true,
    wait: true,
    s3_store: {
      secret: awsS3Config.secretAccessKey,
      key: awsS3Config.accessKeyId,
      bucket: fileData.s3Obj.Bucket,
      path: fileData.s3Obj.Key,
      region: s3Config.region,
      metadata: fileData.s3Obj.Metadata
    }
  };

  kraken.upload(opts, data => {
    if (data.success) {
      console.log('MAIN  success :: `data.kraked_url` :: optimized image URL: %s', data.kraked_url);

      const thumbOpts = _.extend(opts, {
        resize: {
          width: 300,
          height: 300,
          strategy: 'auto',
          webp: true,
          lossy: true
        },
      });
      thumbOpts.s3_store.path = fileData.s3Obj.ThumbKey;

      console.log('`thumbOpts`:\n', thumbOpts);

      kraken.upload(thumbOpts, data => {
        if (data.success) {
          console.log('THUMB success :: `data`:\n', data);
          console.log('THUMB success :: `data.kraked_url` :: optimized image URL: %s', data.kraked_url);



          /** save to database **/
          if(req.body.fields.bucket[0]==='projects') {
            updateMongoProjectImages(req, res);
          } else if(req.body.fields.bucket[0]==='users') {
            updateMongoUserImages(req, res);
          }

        } else {
          console.error('Failed. Error message: %s', data.message);
        }
      });
    }
  });
};


exports.streamProjectFiles = (req, res) => {

  let fileData = req.body.fileData;
  let fieldsToUpdate = req.body.fieldsToUpdate;

  /** upload image to S3 */
  let s3Params = {
    Bucket: fileData.s3Obj.Bucket,
    Key: fileData.s3Obj.Key,
    Metadata: fileData.s3Obj.Metadata,
    Body: fileData.s3Obj.Body
  };

  return s3.uploadAsync(s3Params)
  .then(uploadedImage => {
    fieldsToUpdate.$addToSet.imageGallery.imageS3Key = uploadedImage.Key;

    /** update mongoDb */
    let mongoData = {
      collection: 'Project',
      queryId: req.params.projectId,
      fieldsToUpdate: fieldsToUpdate,
      options: {new: true}
    };
    let mongoResponse = projectUtilities.updateDb(mongoData);  // <-- do/can I to promisify this call????

    /** send response (success or error) to front end */
    let statusCode = mongoResponse.statusCode || 205;
    let response = {
      message: 's3 file upload was successful',
      s3Obj: s3Obj,
      response: mongoResponse
    };
    res.statusCode(statusCode).jsonp(response);
  });
};
