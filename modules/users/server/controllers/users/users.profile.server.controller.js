'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User'),
  Project = mongoose.model('Project');

/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  //console.log('req.body::::::::::::::::::::::::::\n', req.body);
  console.log('req.user::::::::::::::::::::::::::\n', req.user);
  var user = req.user;
  //console.log('user::::::::::::::::::::::::::\n', user);

  // For security measurement we remove the roles from the req.body object
  if (req.body && req.body.roles !== undefined) {
    delete req.body.roles;
  }
  //else if (req.user.body.roles) {
  //  delete req.user.body.roles;
  //}



  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {

          //console.log('req:\n', req);
          console.log('req.login:\n', req.login);
          console.log('res:\n', res);
          console.log('user:\n', user);

          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};


/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};

