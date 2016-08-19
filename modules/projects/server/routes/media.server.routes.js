'use strict';

module.exports = function (app) {
  let express = require('express'),
      router = express.Router(),
      createMedia = require('../controllers/media.post.server.controller.js'),
      updateMedia = require('../controllers/media.put.server.controller.js'),
      getMedia = require('../controllers/media.get.server.controller.js'),
      deleteMedia = require('../controllers/media.delete.server.controller.js'),
      projects = require('../controllers/projects.server.controller.js'),
      middleware = require('../controllers/projects.server.middleware.js'),
      wysiwyg = require('../controllers/wysiwygUploader.server.middleware.js'),
      vimeo = require('../controllers/vimeo.server.controller');

  let baseUrl = '/api/v1/projects';
  let baseUrlV2 = '/api/v2/projects';
  let imagesApi = baseUrl + '/:projectId/images';
  let imagesApiV2 = baseUrlV2 + '/:projectId/images';
  let videosApi = baseUrl + '/:projectId/videos';
  let filesApi = baseUrl + '/:projectId/files';


  // Single project routes for different genres

  app.route(videosApi)
    .get(getMedia.findOneVideoId);
  app.route(videosApi + '/:videoId')
    .get(vimeo.getOneVideo);
  

  app.route(imagesApi)
    .get(getMedia.getImagesByProjectId)
    .post(middleware.parseFileUpload, middleware.configFileData, middleware.configS3Obj, middleware.configMongoObj, createMedia.uploadProjectImages)
    .patch(updateMedia.setDefaultImage)
    .delete(deleteMedia.deleteImagesByBucket);

  app.route('/api/v1/users/:userId/images')
    .post(middleware.parseFileUpload, middleware.configFileData, middleware.configS3Obj, middleware.mongoObjUserImg, createMedia.uploadProjectImages);

  app.route('/api/v1/projects/:projectId/images/wysiwyg')
  // .post(middleware.transformHeaders, middleware.parseFileUpload, middleware.configFileData, wysiwyg.wysiwygS3Obj, middleware.configMongoObj, createMedia.uploadProjectImages);
    .post(middleware.parseFileUpload, middleware.configFileData, wysiwyg.wysiwygS3Obj, middleware.configMongoObj, createMedia.uploadProjectImages);

  app.route(imagesApi + '/:imageId')
    .get(getMedia.getImageByImageId)
    .delete(deleteMedia.deleteImageByImageId);

  app.route(imagesApi + '/default')
    .get(getMedia.getDefaultImageByProjectId);


  // app.route(imagesApiV2)
  //   .post(middleware.parseFileUpload, middleware.configFileData, middleware.configS3Obj, middleware.configMongoObj, createMedia.uploadProjectImages);

  //mount the router on the app
  app.use('/', router);



  //refactor these routes to standard of:
  // `/projects/:projectId/images[/:imageId]`
      // if i need anything else (e.g., "source"), add as a query param
      // `/projects/:projectId/images?source=sourceName`

  // app.route(baseUrl + '/:projectId/upload/:imageId')
  //   .get(getMedia.getS3SignedUrl);
  //
  // app.route(baseUrl + '/:projectId/upload')
  //   .get(getMedia.getImagesByProjectId);
  //
  //
  // app.route(baseUrl + '/:projectId/:source/upload')
  //   .post(createMedia.parseFileUpload, createMedia.uploadProjectImages);
  //
  // app.route(baseUrl + '/:projectId/s3/upload')
  //   .post(createMedia.parseFileUpload, createMedia.uploadProjectImages);
  //
  // app.route(baseUrl + '/:projectId/s3/upload/documents')
  //   .post(createCredentialsMedia.createUploadCredentials);
  //
  //
  //
  // // Get S3 File
  // app.route(baseUrl + '/:projectId/files/:fileId')
  //   .get(getMedia.getS3File);
  //
  // // Get Permissions for a Bucket or File
  // app.route(baseUrl + '/acl')
  //   .get(getMedia.getS3BucketAcl);
  //
  // app.route(baseUrl + '/acl/object')
  // // app.route(imagesApi + '/:imageId/acl')
  //   .get(getMedia.getS3ObjectAcl);




};
