'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  mongoose = require('mongoose'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  admin = require('./admin.server.controller.js'),
  auth = require('./users/users.authentication.server.controller.js');

mongoose.Promise = Promise;
const User = mongoose.model('User'),
  TempUser = mongoose.model('TempUser');


  /**
 * Show the current user
 */
exports.getUser = function (req, res) {
  res.json(req.model);
};

/**
 * Get tempUser from middleware call
 *
 * @param req
 * @param res
 */
exports.getTempUser = (req, res) => {
  res.json(req.tempUser);
};


/**
 * Update a User
 */
exports.updateUser = function (req, res) {
  console.log('UPDATE USER var `req.model`:\n', req.model, '\n\n');
  console.log('UPDATE USER var `req.body`:\n', req.body, '\n\n');
  var user = null;
  if (req.model) {
    user = req.model;
    user = _.extend(user, req.body);

    // todo create a patch user function to handle this type of functionality
    // if true, then user has just added project as a favorite
    // so, projectId needs to be pushed into favorites array.
    // if false, projectId should be popped from favorites array.
    if (req.body.isFavorite) {
      user.favorites.push(req.body.favorite);
    } else if (req.body.isFavorite === false && req.body.favorite) {
      user.favorites.pop(req.body.favorite);
    }

  } else if (req.body._id) {
    user = req.body;
  }

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


/**
 * Patch Update a User Fields - see admin.v2.server.controller.js
 */


/**
 * middleware
 *
 * subscribe user to newsletter
 * and add new user to database if email does not exist
 */
exports.addNewsletter = function (req, res, next) {

  User.findOne({ email: req.query.email })
    //.select('newsletter firstName lastName email ModifiedOn')
    .exec(function (err, userData) {

      if (err === null && userData === null) {
        //email does not exist. create a new user
        var newUserObject = {
          body: {
            email: req.query.email,
            username: req.query.email,
            firstName: '',
            lastName: '',
            newsletter: true,
            role: 'registered'
          }
        };
        auth.signup(newUserObject,
          function (createResponse) {
            console.log('createResponse:\n', createResponse);
            createResponse.subscribed = true;
            createResponse.message = 'Ok, we penciled you in. Please check your email to confirm your subscription.';
            res.jsonp([createResponse]);
          });

      } else if (!userData.newsletter) {
        console.log('userData: (response from email query):\n', userData);

        var updateUserObject = {
          body: userData
        };
        updateUserObject.body.newsletter = true;
        updateUserObject.body.modified = {
          modifiedBy: userData.id,
          modifiedAt: Date.now()
        };


        admin.update(updateUserObject,
          function (updateResponse) {
            console.log('updateResponse:\n', updateResponse);
            updateResponse.subscribed = true;
            updateResponse.message = 'You\'ve been subscribed to the newsletter.';
            res.jsonp([updateResponse]);
          });

      } else {
        //email address is already receiving the newsletter
        //send back message to front end
        res.jsonp([{ subscribed: true, message: 'email is already subscribed to newsletter' }]);
      }
    });
};


/**
 * Delete a user
 */
exports.deleteUser = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password').sort('-created').populate('user', 'displayName')
    .exec(function (err, users) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(users);
    });
};


/**
 * Get list of Contributors
 */

exports.getContributors = function (req, res) {
  var query = User.find(req.query);
  query.or([{ roles: 'contributor' }, { roles: 'admin' }])
    .sort('-lastName')
    .exec(function (err, users) {
      if (err) {
        return res.send(400, {
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.jsonp(users);
    });
};


/**
 * Get a Contributor
 */
exports.getContributorByUserId = (req, res) => {
  res.jsonp(req.model);
};
//
// /**
//  * User middleware
//  */
// exports.userById = function (req, res, next, id) {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).send({
//       message: 'User is invalid'
//     });
//   }
//
//   User.findById(id, '-salt -password').exec(function (err, user) {
//     if (err) {
//       return next(err);
//     } else if (!user) {
//       return next(new Error('Failed to load user ' + id));
//     }
//
//     req.model = user;
//     next();
//   });
// };
//
// /**
//  *
//  * TempUser middleware
//  *
//  * @param req
//  * @param res
//  * @param next
//  * @param id
//  * @returns {*}
//  */
// exports.tempUserById = (req, res, next, id) => {
//   console.log('tempUserById `id`::::::\n', id);
//   if(!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).send({
//       message: 'TempUser is invalid'
//     });
//   }
//
//   TempUser.findById(id, '-salt -password')
//   .exec()
//   .then(tempUser => {
//     console.log('tempUser::::::\n', tempUser);
//     if(!tempUser) { return next(new Error('Failed to load tempUser with id: ' + id)); }
//     req.tempUser = tempUser;
//     next();
//   })
//   .catch(err => {
//     console.log('tempUser ERRORRRR::::::\n', err);
//     return next(new Error({
//       message: errorHandler.getErrorMessage(err)
//     }));
//   });
//
//   // TempUser.findById(id, '-salt -password').exec(function (err, user) {
//   //   if (err) {
//   //     return next(err);
//   //   } else if (!user) {
//   //     return next(new Error('Failed to load user ' + id));
//   //   }
//   //
//   //   req.model = user;
//   //   next();
//   // });
//
// };
//
// exports.tempUserByEmail = (req, res, next, id) => {
//   console.log('tempUserByEmail HERE HERE HERE!!!!!!::::::::::\n');
//   if(!id) {
//     req.id = req.body.email;
//   } else {
//     req.id = id;
//   }
//
//   console.log('tempUserByEmail `req.id`::::::\n', req.id);
//   if(!mongoose.Types.ObjectId.isValid(req.id)) {
//     return res.status(400).send({
//       message: 'Email is invalid'
//     });
//   }
//   TempUser.findOne(
//     { email: req.id },
//     { salt: 0, password: 0 }
//   ).exec()
//   .then(tempUser => {
//     console.log('tempUser::::::\n', tempUser);
//     if(!tempUser) {
//       console.log('Failed to load tempUser with id: ' + req.id);
//       throw new Error('Failed to load tempUser with id: ' + req.id);
//     }
//     req.model = tempUser;
//     next();
//   })
//   .catch(err => {
//     console.log('email doest not exist for any tempUsers :::: ERRORRRR::::::\n', err);
//     return next(new Error({
//       message: errorHandler.getErrorMessage(err)
//     }));
//   });
// };

/**
 * Find User(s) By Source (where source can be any property in Users model)
 *
 * @id {Object) key-value pair, where `key` is a property in the Users model
 *
 */

exports.findUsersBySource = function (req, res) {

  var sourceKey1 = req.source1.key,
    sourceValue1 = req.source1.value;

  var queryObject = {
    sourceKey1: sourceValue1
  };

  User.find(queryObject)
    .exec();

};



/**
 *
 */

exports.deleteContributor = function (req, res) {

};
