'use strict';

module.exports = function (app) {
  var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    users = require('../../../users/server/controllers/users.server.controller.js'),
    createMedia = require('../controllers/media.put.server.controller.js'),
    getMedia = require('../controllers/media.get.server.controller.js'),
    createCredentialsMedia = require('../controllers/media.credentials.server.controller.js'),
    // deleteMedia = require('../controllers/media.delete.server.controller.js'),
    projects = require('../controllers/projects.server.controller.js'),
    mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    request = require('request'),
    vimeo = require('../controllers/vimeo.server.controller');


  // Single project routes for different genres
  app.route('/api/v1/projects/:projectId/video/:videoId')
    .get(vimeo.getOneVideo);

  app.route('/api/v1/projects/:projectId/videos')
    .get(getMedia.findOneVideoId);
  

  app.route('/api/v1/projects/:projectId/images/:imageId')
    .get(getMedia.getImageByImageId);
  app.route('/api/v1/projects/:projectId/images')
    .get(getMedia.getImagesByProjectId);
  app.route('/api/v1/projects/:projectId/images/default')
    .get(getMedia.getDefaultImageByProjectId);


  app.route('/api/v1/projects/:projectId/upload/:imageId')
  // .get(media.getImageByImageId);
    .get(getMedia.getS3SignedUrl);
    // .delete(media.deleteImageByImageId);
  
  app.route('/api/v1/projects/:projectId/upload')
    .post(createMedia.parseFileUpload, createMedia.uploadProjectImages)
    .get(getMedia.getImagesByProjectId);

  app.route('/api/v1/projects/:projectId/:source/upload')
    .post(createMedia.parseFileUpload, createMedia.uploadProjectImages);
    // .put(media.parseFileUpload, media.configWysiwygObj, media.configMainObj, media.uploadProjectImages);

  app.route('/api/v1/projects/:projectId/s3/upload')
    .post(createMedia.parseFileUpload, createMedia.uploadProjectImages);

  
  app.route('/api/v1/projects/:projectId/s3/upload/documents')
    .post(createCredentialsMedia.createUploadCredentials);


  // Get S3 File
  app.route('/api/v1/projects/:projectId/files/:fileId')
    // .get(projects.getS3SignedUrl);
    .get(getMedia.getS3File);
  
  // Get Permissions for a Bucket or File
  app.route('/api/v1/projects/acl')
    .get(getMedia.getS3BucketAcl);
  
  app.route('/api/v1/projects/acl/object')
  // app.route('/api/v1/projects/:projectId/images/:imageId/acl')
    .get(getMedia.getS3ObjectAcl);


  //mount the router on the app
  app.use('/', router);

  // Finish by binding the Project middleware
  // app.param('projectId', projects.projectById);
  // app.param('imageId', projects.imageId);
  // app.param('source', projects.source);

};
