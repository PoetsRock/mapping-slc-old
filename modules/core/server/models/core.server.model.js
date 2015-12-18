'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 *
 * Core / Home Page Schema
 *
 **/

var CoreSchema = new Schema({
  createdOn: {
    type: Date,
    default: Date.now
  },
  publishedOn: {
    type: Date
  },
  ModifiedBy: {
    type: [{
      type: String
      }],
    default: []
  },

  featuredProjects: {
    type: [{
      type: String
    }]
  }
});



CoreSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

mongoose.model('Core', CoreSchema);
