'use strict';

module.exports = function (app) {
  var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    users = require('../../../users/server/controllers/users.server.controller.js'),
    media = require('../controllers/media.server.controller.js'),
    projects = require('../controllers/projects.server.controller.js'),
    mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    request = require('request'),
    vimeo = require('../controllers/vimeo.server.controller');


  // Single project routes for different genres
  app.route('/api/v1/projects/:projectId/video/:videoId')
    .get(vimeo.getOneVideo);

  app.route('/api/v1/projects/:projectId/videos')
    .get(media.findOneVideoId);
  
  
  app.route('/api/v1/projects/:projectId/upload')
    .post(media.parseFileUpload, media.uploadProjectImages);

  app.route('/api/v1/projects/:projectId/:source/upload')
    .post(media.parseFileUpload, media.uploadProjectImages);
  
  app.route('/api/v1/projects/:projectId/s3/upload')
    .post(media.parseFileUpload, media.uploadProjectImages);

  app.route('/api/v1/projects/:projectId/s3/upload/documents')
    .post(media.uploadProjectDocuments);


  // Get S3 File
  app.route('/api/v1/projects/:projectId/files/:fileId')
    // .get(projects.getS3SignedUrl);
    .get(media.getS3File);


  //mount the router on the app
  app.use('/', router);

  // Finish by binding the Project middleware
  app.param('projectId', projects.projectByID);
  app.param('source', projects.source);

};
