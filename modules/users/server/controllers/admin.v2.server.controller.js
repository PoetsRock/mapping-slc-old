'use strict';


const path = require('path'),
    mongoose = require('mongoose'),
    Promise = require('bluebird'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

mongoose.Promise = Promise;
const User = mongoose.model('User');
const Project = mongoose.model('Project');

/**
 * Patch Update a User Fields
 */
exports.patchUser = (req, res) => {
  const user = _.extend({}, req.model, req.body);

  user.save()
  .then(user => {
    res.jsonp(user);
  })
  .catch(err => {
    console.error('ERROR on patch update for user `err`:\n', err);
    res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Return list of projects by contributor - query param `publishedOnly`, if true, returns only published projects
 *
 * @param req
 * @param req.query.publishedOnly
 * @param res
 */
exports.getContributorProjects = (req, res) => {
  const projectIdsArray = [];
  const projectsArray = [];
  req.model.associatedProjects.map(assocProjId => { projectIdsArray.push(assocProjId); });
  Project.find({
    '_id': { $in: projectIdsArray }
  })
  .then(projects => {
    if (req.query.publishedOnly===true) {
      projects.map(project => {
        if(project.status[0]==='published') {
          projectsArray.push(project);
        }
      });
      projects = projectsArray;
    }
    res.jsonp(projects);
  })
  .catch(err => {
    console.error('error:\n', err);
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

