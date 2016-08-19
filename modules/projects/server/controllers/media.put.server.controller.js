'use strict';

const Promise = require('bluebird'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  path = require('path'),
  _ = require('lodash'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  projectUtilities = require('./projects.server.utilities.js');


const s3Config = {
  bucket: 'mapping-slc-file-upload',
  region: 'us-west-1',
  directory: [
    {name: 'admin', path: 'admin-directory'},
    {name: 'project', path: 'project-directory'},
    {name: 'user', path: 'user-directory'}
  ]
};

/** config aws s3 config settings, file object, and create a new instance of the s3 service */
const awsS3Config = {
  accessKeyId: config.S3_ID,
  secretAccessKey: config.S3_SECRET,
  region: 'us-west-1'
};

mongoose.Promise = Promise;
const Project = mongoose.model('Project');
const User = mongoose.model('User');


/**
 *
 * @param req
 * @param res
 */
exports.setDefaultImage = (req, res) => {
  const imagesArray = req.body;

  delete imagesArray.mainImage._id;
  delete imagesArray.mainImage.isDefaultImage;
  delete imagesArray.mainImage.imageS3Key;
  delete imagesArray.mainImage.Location;

  const query = Project.findOneAndUpdate(
    { _id: req.params.projectId },
    imagesArray,
    { new: true }
  ).exec();

  query.then(response => {
    res.jsonp(response);
  })
  .catch(err => {
    console.error('error updating project.imageGallery to set default image:\n', err);
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};


// Mongo = require('mongodb'),
// const projectsDb = new Mongo().getDB('projects');
// const myProject = projectsDb.find({ title: 'Little Star, Why Can\'t You Be What You Are?' });

// console.log('mongoose.connections.db:\n', mongoose.connections[0].db);
// const db = mongoose.connections[0].db;
// const projects = db.getDB('projects');
// console.log('projects:\n', projects);
