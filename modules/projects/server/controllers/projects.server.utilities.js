'use strict';
const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Project = mongoose.model('Project');

const fileExt = [
  { type: 'image/jpeg', extension: 'jpg' },
  { type: 'image/png', extension: 'png' },
  { type: 'image/gif', extension: 'gif' }
];

const s3Config = {
  bucket: 'mapping-slc-file-upload',
  region: 'us-west-1',
  directory: [
    { name: 'admin', path: 'admin-directory' },
    { name: 'project', path: 'project-directory' },
    { name: 'user', path: 'user-directory' }
  ]
};


/**
 * returns file extension
 *
 * @param fileType
 * @param fileName
 * @returns {*}
 */
exports.getFileExt = (fileType, fileName) => {
  const extension = fileExt.find(x => {
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
  const query = mongoData.collection.findOneAndUpdate(
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

/**
 *
 * @param bucket - optional passes in data from `req.body.fields.bucket`
 * @param bucketId - optional passes in data from `req.body.fields.bucket`
 * @returns {{}}
 */
exports.setSourceId = (bucket, bucketId) => {
  console.log('bucketId: ', bucketId);
  const source = {};
  if(bucket === 'projects' || bucket === '[ projects ]') {
    console.log('here here in projects BUCKETTTTT');
    source.s3Directory = s3Config.directory[1].path;
    source.sourceId = bucketId || req.params.projectId;
  } else if(bucket === 'users' || req.headers['bucket'] === 'users') {
    source.s3Directory = s3Config.directory[2].path;
    source.sourceId = bucketId || req.params.userId;
  } else if(bucket === 'admins' || req.headers['bucket'] === 'admins') {
    source.s3Directory = s3Config.directory[0].path;
    source.sourceId = bucketId || req.params.adminId;
  }
  return source;
};
