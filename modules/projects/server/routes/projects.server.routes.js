'use strict';

module.exports = function (app) {
  var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    users = require('../../../users/server/controllers/users.server.controller.js'),
    projectsPolicy = require('../policies/projects.server.policy'),
    projects = require('../controllers/projects.server.controller.js'),
    middleware = require('../controllers/projects.server.middleware.js'),
    mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    markerData = require('../models/project.server.model.js');


// Projects collection routes
  app.route('/api/v1/projects')
    .get(projects.list);

  // Projects collection routes
  app.route('/api/v1/projects/all')
    .get(projects.list);

  // Projects collection routes
  app.route('/api/v1/projects/published')
    .get(projects.listPublished);


  app.route('/api/v1/projects')
    .post(projects.create);

// Single project routes
  app.route('/api/v1/projects/:projectId')
    .get(projects.read)
    .put(projects.update)
    .delete(projects.delete);

// Project Markers Routes
  app.route('/api/v1/markerData')
    .get(projects.markerList);

  // This is the search route, make a GET request on this endpoint to return search results
  app.route('/api/v1/search').all(projectsPolicy.isAllowed)
    .post(function (req, res) {
      Project.search({ query: req.body.q }, function (err, results) {
        res.send(results);
      });
    });


  // Update Project Keywords Using Natural Language Processing Engine
  app.route('/api/v1/nlp')
    .put(projects.nlpProjects, projects.update);

  //Google Places API Call
  app.route('/api/v1/places')
    .get(projects.googlePlacesData);


// Utah Census Tract Routes
  app.route('/api/v1/tractData')
    .get((req, res) => {
      res.jsonp(tractData);
    });


// API Keys Routes
  app.route('/api/v1/keys')
    .get(projects.getApiKeys);

  //route for getting the Featured Projects Array
  app.route('/api/v1/featured')
    .get(projects.getFeaturedProjects);

  app.route('/api/v1/projects/:projectId/featured/false')
    .put(projects.update);

  app.route('/api/v1/projects/:projectId/featured/true')
    .put(projects.updateFeaturedProjects);
  
  
  //mount the router on the app
  app.use('/', router);

  // Finish by binding the Project middleware
  app.param('projectId', middleware.projectById);
  app.param('imageId', middleware.imageId);
  app.param('source', middleware.source);

};
