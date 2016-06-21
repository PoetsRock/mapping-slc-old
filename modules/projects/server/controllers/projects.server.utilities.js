'use strict';
let Promise = require('bluebird');
let mongoose = require('mongoose');
mongoose.Promise = Promise;
let Project = mongoose.model('Project');

let fileExt = [
  { type: 'image/jpeg', extension: 'jpg' },
  { type: 'image/png', extension: 'png' },
  { type: 'image/gif', extension: 'gif' }
];

/**
 * returns file extension
 *
 * @param fileType
 * @param fileName
 * @returns {*}
 */
exports.getFileExt = (fileType, fileName) => {
  let extension = fileExt.find(x => {
    return x.type === fileType;
  });
  if(!extension && fileName) { return fileName.slice(-3); }
  return extension;
};

/**
 * updates document in mongo collection
 *
 * @param mongoData {Object}
 * @param mongoData.collection {string} - Mongo collection to save to
 * @param mongoData.queryId {string}
 * @param mongoData.fieldsToUpdate {object}
 * @param mongoData.options {object}
 *
 */
exports.updateDb = mongoData => {
  if(!mongoData.options) {
    mongoData.options = { new: true };
  }
  let query = mongoData.collection.findOneAndUpdate(
    { _id: mongoData.queryId },
    mongoData.fieldsToUpdate,
    mongoData.options
  ).exec();

  query.then(response => {
    /** now send response to front end */
    console.error('\n\nSUCCESS updating Mongo:\n', response);
    return response;
  })
  .catch(err => {
    console.error('\n\nERROR updating Mongo:\n', err);
    return err;
  });
};

exports.setSourceId = () => {
  let source = {};
  if(req.headers['bucket'] === 'projects') {
    source.s3Directory = s3Config.directory[1].path;
    source.sourceId = req.params.projectId;
  } else if(req.headers['bucket'] === 'users') {
    source.s3Directory = s3Config.directory[2].path;
    source.sourceId = req.params.userId;
  } else if(req.headers['bucket'] === 'admins') {
    source.s3Directory = s3Config.directory[0].path;
    source.sourceId = req.params.adminId;
  }
  return source;
};
