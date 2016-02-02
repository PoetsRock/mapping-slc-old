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
  }
});

CoreSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

mongoose.model('Core', CoreSchema);
