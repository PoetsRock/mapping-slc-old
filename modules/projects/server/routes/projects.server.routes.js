'use strict';

module.exports = function (app) {
  var fs = require('fs'),
    users = require('../../../users/server/controllers/users.server.controller.js'),
    projectsPolicy = require('../policies/projects.server.policy'),
    projects = require('../controllers/projects.server.controller'),
    mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    //tractData = require('../models/data/utahTract.json'),
    markerData = require('../models/project.server.model.js'),
    request = require('request'),
    s3 = require('../controllers/s3.server.controller'),
    vimeo = require('../controllers/vimeo.server.controller');


// Projects collection routes
  app.route('/api/v1/projects')
    .get(projects.list);

  // Projects collection routes
  app.route('/api/v1/projects/all')
    .get(projects.list);

  // Projects collection routes
  app.route('/api/v1/projects/published')
    .get(projects.listPublished);


  //app.route('/api/v1/projects').all(projectsPolicy.isAllowed)
  app.route('/api/v1/projects')
    //.post(projects.markerData, projects.create);
    .post(projects.create);


// Single project routes
  //app.route('/api/v1/projects/:projectId').all(projectsPolicy.isAllowed)
  app.route('/api/v1/projects/:projectId')
    .get(projects.read)
    //.put(projects.markerData, projects.update)
    .put(projects.update)
    .delete(projects.delete);

  // Single project routes for different genres
  app.route('/api/v1/projects/:projectId/video/:videoId')
    .get(vimeo.getOneVideo);

  app.route('/api/v1/projects/:projectId/videos')
    .get(projects.findOneVideoId);


// Project Markers Routes
  app.route('/api/v1/markerData')
    .get(projects.markerList);


///**
//** Admin Routes
//**/
//    app.route('/admins')
//        .get(admins.hasAuthorization, admins.list)
//        .post(users.requiresLogin, admins.hasAuthorization, admins.create);
//
//    app.route('/admins/:adminId')
//        .get(admins.hasAuthorization, admins.read)
//        .put(users.requiresLogin, admins.hasAuthorization, admins.update)
//        .delete(users.requiresLogin, admins.hasAuthorization, admins.delete);


  /**
   * routes for Natural Language Processing Engine
   */
  app.route('/api/v1/nlp')
    .get(projects.nlpProjects);


  // This is the search route, make a GET request on this endpoitn to return search results
  app.route('/api/v1/search').all(projectsPolicy.isAllowed)
    .post(function (req, res) {
      Project.search({query: req.body.q}, function (err, results) {
        res.send(results);
      });
    });


  //Google Places API Call
  app.route('/api/v1/places')
    .get(function (req, res) {
      var results = {};
      var tempResults = [];
      var query = 'https://maps.googleapis.com/maps/api/v1/place/nearbysearch/json?key=AIzaSyBZ63pS3QFjYlXuaNwPUTvcYdM-SGRmeJ0&location=40.773,-111.902&radius=1000';
      request(query, function (error, response, body) {
        body = JSON.parse(body);
        res.jsonp(body);
        var pageToken = body['next_page_token'];
        console.log('pageToken: ', pageToken);
        console.log('body2: ', body);
        results = body;

        var secondQuery = 'https://maps.googleapis.com/maps/api/v1/place/nearbysearch/json?pagetoken=' + pageToken + '&key=AIzaSyBZ63pS3QFjYlXuaNwPUTvcYdM-SGRmeJ0';
        console.log('secondQuery: ', secondQuery);
        request(secondQuery, function (error, response, body) {
          console.log('body2: ', body);
          tempResults = results.push(body);
          console.log('final results: ', results);
        });
      });
    });


// Utah Census Tract Routes
  app.route('/api/v1/tractData')
    .get(function (req, res) {
      res.jsonp(tractData);
    });


// API Keys Routes
  app.route('/api/v1/keys')
    .get(function (req, res) {
      console.log('LOG CURRENT NODE ENVIRONMENT:');
      console.log('process.env.NODE_ENV:\n', process.env.NODE_ENV);

      var environment = null;
      if(process.env.NODE_ENV === 'production') {
        environment = process.env;
      } else {
        environment = require('../../../../config/env/local-development.js').FRONT_END;
      }
      console.log('LOG VARIABLE FOR CURRENT NODE ENVIRONMENT:');
      console.log('var `environment` =\n', environment);
      var publicKeys = {
        MAPBOX_KEY: environment.MAPBOX_KEY,
        MAPBOX_SECRET: environment.MAPBOX_SECRET,

        HERE_KEY: environment.HERE_KEY,
        HERE_SECRET: environment.HERE_SECRET,

        CENSUS_KEY: environment.CENSUS_KEY
      };

      console.log('LOG API KEYS OBJECT RETURNED FOR CURRENT NODE ENVIRONMENT:');
      console.log(publicKeys);

      res.jsonp(publicKeys);

    });


  ////route for getting the Featured Projects Array
  app.route('/api/v1/featured')
    .get(projects.getFeaturedProjects);

  ////route for updating the Featured Projects Array
  //app.route('api/v1/featured/:projectId')
  //  .patch(projects.updateFeaturedProject);


// Cloudinary File Storage and Opt
  app.route('/api/v1/projects/upload')
    .post(s3.uploadStream)
    .get(s3.read)
    .put(s3.update)
    .delete(s3.delete);

  app.route('/api/v1/users/upload')
    .post(s3.uploadStream)
    .get(s3.read)
    .put(s3.update)
    .delete(s3.delete);




  // Finish by binding the Project middleware
  app.param('projectId', projects.projectByID);

};
