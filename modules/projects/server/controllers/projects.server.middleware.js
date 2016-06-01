'use strict';

let mongoose = require('mongoose'),
  path = require('path'),
  Project = mongoose.model('Project'),
  config = require(path.resolve('./config/config')),
  projects = require('./projects.server.controller'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Project middleware for getProjectById
 **/
exports.projectById = function (req, res, next, id) {
  console.log('here !!!!!  `id`: ', id);
  Project.findById(id)
  .populate('user')
  .exec(function (err, project) {
    if (err) return next(err);
    if (!project) return next(new Error('Failed to load Project ' + id));
    req.project = project;
    next();
  });
};


/**
 * Middleware that return sourceId from url params
 */
exports.source = (req, res, next, id) => {
  req.source = id;
  next();
};

/**
 * Middleware that return an imageId from the url params
 */
exports.imageId = (req, res, next, id) => {
  req.imageId = id;
  next();
};


/**
 * Project authorization middleware
 */
exports.hasAuthorization = (req, res, next) => {
  if (req.project.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
