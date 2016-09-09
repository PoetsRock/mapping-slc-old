'use strict';

/**
 * Module dependencies
 */
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
  // _ = require('lodash'),
  // admin = require('./admin.server.controller.js'),
  // auth = require('./users/users.authentication.server.controller.js');

mongoose.Promise = Promise;
const User = mongoose.model('User');
const TempUser = mongoose.model('TempUser');


/**
 *
 * TempUser middleware
 *
 * @param req
 * @param res
 * @param next
 * @param id
 * @returns {*}
 */
exports.tempUserById = (req, res, next, id) => {
  console.log('tempUserById `id`::::::\n', id);
  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'TempUser is invalid'
    });
  }

  TempUser.findOne({ _id: id }, '-salt -password')
  .exec()
  .then(tempUser => {
    console.log('tempUser::::::\n', tempUser);
    if(!tempUser) { return next(new Error('Failed to load tempUser with id: ' + id)); }
    req.tempUser = tempUser;
    next();
  })
  .catch(err => {
    console.log('tempUser ERRORRRR::::::\n', err);
    return next(new Error({
      message: errorHandler.getErrorMessage(err)
    }));
  });

  // TempUser.findById(id, '-salt -password').exec(function (err, user) {
  //   if (err) {
  //     return next(err);
  //   } else if (!user) {
  //     return next(new Error('Failed to load user ' + id));
  //   }
  //
  //   req.model = user;
  //   next();
  // });

};

exports.tempUserByEmail = (req, res, next, id) => {
  if(!id) {
    req.id = req.body.email;
  } else {
    req.id = id;
  }

  console.log('tempUserByEmail ##1111`req.body`::::::\n', req.body);
  console.log('tempUserByEmail ##1111`req.id`::::::\n', req.id);
  // if(!mongoose.Types.String.isValid(req.id)) {
  //   console.error('ERROR : INVALID MONGO TYPE :: tempUserByEmail `req.id` ::\n', req.id);
  //   return res.status(400).send({
  //     message: 'Email field needs to be a string'
  //   });
  // }
  TempUser.findOne(
    { email: req.id }
  ).exec()
  .then(tempUser => {
    console.log('tempUser::::::\n', tempUser);
    if(!tempUser) {
      console.log('Failed to load tempUser with id: ' + req.id);
      throw new Error('Failed to load tempUser with id: ' + req.id);
    }
    req.tempUser = tempUser;
    next();
  })
  .catch(err => {
    console.log('email doest not exist for any tempUsers :::: ERRORRRR::::::\n', err);
    return next(new Error({
      message: errorHandler.getErrorMessage(err)
    }));
  });
};
