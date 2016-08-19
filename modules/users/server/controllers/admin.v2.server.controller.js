'use strict';

/**
 * Module dependencies
 */

var path = require('path'),
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

mongoose.Promise = Promise;

/**
 * Patch Update a User Fields
 */
exports.patchUser = (req, res) => {
  console.log('req.body:\n', req.body);
  const user = _.extend(req.model, req.body);

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    console.log('updateUser, `user`:\n', user, '\n\n');
    res.jsonp(user);
  });
};
