'use strict';

/**
 * Module dependencies.
 */


var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var path = require('path');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.model('Project', ProjectSchema);
var Project = mongoose.model('Project');
var projects = require('../../server/controllers/projects.server.controller.js');


/**
 * Globals
 */
var project;


/**
 *
 * test data
 */
beforeEach(function () {
  var projectArray = [
    {
      "title": "Coffee Because This Feels Like Love, and I Just Want to Go Home Again",
      "zip": 84103,
      "state": "UT",
      "city": "Salt Lake City",
      "street": "39 I St.",
      "featured": true
    },
    {
      "zip": 84106,
      "state": "UT",
      "city": "Salt Lake City",
      "street": "2745 S. Filmore Ste",
      "storySummary": "",
      "shortTitle": "",
      "title": "The life and times of a hard life",
      "featured": true
    },
    {
      "state": "UT",
      "city": "Salt Lake City",
      "street": "200 7th Ave N",
      "storySummary": "",
      "shortTitle": "",
      "title": "When the crickets had gone, we never knew what to do. But, I still dream of you and I.",
      "featured": true
    }
  ];
});

var featuredProjects = projects.getFeaturedProjects();

describe('#get featured projects', () => {

  let feauturedProjects = projects.getFeaturedProjects();

  it('should `update` an existing unit', done => {

    expect(feauturedProjects).to.have.length(3);

    done();

  });

  var chai = require('chai'),
    mongoose = require('mongoose'),
    projects = require('../../server/controllers/projects.server.controller'),
    expect = chai.expect,
    should = chai.should(),
    Project = mongoose.model('Project');


  beforeEach(function () {

    var projectArray = [
      {
        "title": "Coffee Because This Feels Like Love, and I Just Want to Go Home Again",
        "zip": 84103,
        "state": "UT",
        "city": "Salt Lake City",
        "street": "39 I St.",
        "featured": true
      },
      {
        "zip": 84106,
        "state": "UT",
        "city": "Salt Lake City",
        "street": "2745 S. Filmore Ste",
        "storySummary": "",
        "shortTitle": "",
        "title": "The life and times of a hard life",
        "featured": true
      },
      {
        "state": "UT",
        "city": "Salt Lake City",
        "street": "200 7th Ave N",
        "storySummary": "",
        "shortTitle": "",
        "title": "When the crickets had gone, we never knew what to do. But, I still dream of you and I.",
        "featured": true
      }
    ];

  });

  describe('#get featured projects', () => {

    let feauturedProjects = projects.getFeaturedProjects();

    it('should `update` an existing unit', done => {

      expect(feauturedProjects).to.have.length(3);

      done();

    });
  });
});
