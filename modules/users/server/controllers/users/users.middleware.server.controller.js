'use strict';

const path = require('path');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const moment = require('moment');
const mongoose = require('mongoose');

mongoose.Promise = Promise;
const User = mongoose.model('User');
const TempUser = mongoose.model('TempUser');

/**
 * User middleware
 */
exports.userById = (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }
  User.findById(id, '-salt -password').exec()
  .then(user => {
    if (!user) { return next(new Error('Failed to load user ' + id)); }
    req.model = user;
    next();
  })
  .catch(err => {
    return next(err);
  });
};

/**
 *  Creates and configures an object to update the associated database document
 * @param req
 * @param res
 * @param next
 */
exports.configMongoObj = (req, res, next) => {
  let fileData = req.body.fileData;

  // todo make dynamic !!
  let currentUserId = '5611ca9493e8d4af5022bc17';

  let fieldsToUpdate = {
    profileImageUrl: fileData.fullImageUrl ,
    profileImageThumbUrl: fileData.thumbImageUrl,
    $addToSet: {
      modified: {
        modifiedBy: currentUserId,
        modifiedAt: moment.utc(Date.now())
      }
    }
  };
  req.body.fileData = fileData;
  req.body.fieldsToUpdate = fieldsToUpdate;
  next();
};
