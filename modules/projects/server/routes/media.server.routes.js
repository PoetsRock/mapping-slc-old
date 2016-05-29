'use strict';

module.exports = function (app) {
  let express = require('express'),
      router = express.Router(),
      createMedia = require('../controllers/media.put.server.controller.js'),
      getMedia = require('../controllers/media.get.server.controller.js'),
      createCredentialsMedia = require('../controllers/media.credentials.server.controller.js'),
      deleteMedia = require('../controllers/media.delete.server.controller.js'),
      mongoose = require('mongoose'),
      Project = mongoose.model('Project'),
      vimeo = require('../controllers/vimeo.server.controller');


  let baseUrl = '/api/v1/projects';
  let imagesApi = baseUrl + '/:projectId/images';
  let videosApi = baseUrl + '/:projectId/videos';


  // Single project routes for different genres

  app.route(videosApi)
    .get(getMedia.findOneVideoId);
  app.route(videosApi + '/:videoId')
    .get(vimeo.getOneVideo);



  app.route(imagesApi)
    .get(getMedia.getImagesByProjectId)
    .post(createMedia.parseFileUpload, createMedia.configFileData, createMedia.configS3Obj, createMedia.configMongoObj, createMedia.uploadProjectImages)
    .put(deleteMedia.deleteImagesByBucket);

  app.route(imagesApi + '/:imageId')
    .get(getMedia.getImageByImageId)
    .put(deleteMedia.deleteImageByImageId);

  app.route(imagesApi + '/default')
    .get(getMedia.getDefaultImageByProjectId);






  //refactor these routes to standard of:
  // `/projects/:projectId/images[/:imageId]`
      // if i need anything else (e.g., "source"), add as a query param
      // `/projects/:projectId/images?source=sourceName`
  app.route(baseUrl + '/:projectId/upload/:imageId')
    .get(getMedia.getS3SignedUrl);

  app.route(baseUrl + '/:projectId/upload')
    .get(getMedia.getImagesByProjectId);


  app.route(baseUrl + '/:projectId/:source/upload')
    .post(createMedia.parseFileUpload, createMedia.uploadProjectImages);

  app.route(baseUrl + '/:projectId/s3/upload')
    .post(createMedia.parseFileUpload, createMedia.uploadProjectImages);

  app.route(baseUrl + '/:projectId/s3/upload/documents')
    .post(createCredentialsMedia.createUploadCredentials);



  // Get S3 File
  app.route(baseUrl + '/:projectId/files/:fileId')
    .get(getMedia.getS3File);
  
  // Get Permissions for a Bucket or File
  app.route(baseUrl + '/acl')
    .get(getMedia.getS3BucketAcl);
  
  app.route(baseUrl + '/acl/object')
  // app.route(imagesApi + '/:imageId/acl')
    .get(getMedia.getS3ObjectAcl);



  //mount the router on the app
  app.use('/', router);

};
