'use strict';

var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    Core = mongoose.model('Core');

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

/**
 *
 * Basic CRUD operations by a sourceId
 *
 */


//myObject.findAndModify({
//  query: {
//    sourceId: data.sourceId
//  },
//  update: {
//    $set: {
//      name: data.name,
//      active: data.active
//    },
//    $setOnInsert: {
//      createdAt: now,
//      sourceId: shortid.generate()
//    }
//  },
//  fields: excludeFields,
//  upsert: true,
//  new: true
//}, callback);
