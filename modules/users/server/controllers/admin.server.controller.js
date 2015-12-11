'use strict';

/**
 * Module dependencies.
 */
//import { admin } from './admin.server.controller.js';
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  admin = require('./admin.server.controller.js'),
  auth = require('./users/users.authentication.server.controller.js');

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = null;
  if(req.model) {
    user = req.model;
    user = _.extend(user, req.body);
    ////For security purposes only merge these parameters
    //user.firstName = req.body.firstName;
    //user.lastName = req.body.lastName;
    //user.displayName = user.firstName + ' ' + user.lastName;
    //user.roles = req.body.roles;
    user.associatedProjects.push(req.body.associatedProjects);
    // if true, then user has just added project as a favorite
    // so, projectId needs to be pushed into favorites array.
    // if false, projectId should be popped from favorites array.
    if(req.body.isFavorite) {
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
    res.jsonp(user);
  });
};

/**
 * subscribe user to newsletter
 * and add new user to database if email does not exist
 */
exports.addNewsletter = function (req, res) {

  User.findOne({ email: req.query.email})
    //.select('newsletter firstName lastName email ModifiedOn')
    .exec(function(err, userData) {

      if(err === null && userData === null) {
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
          function(createResponse) {
            console.log('createResponse:\n', createResponse);
            createResponse.subscribed = true;
            createResponse.message = 'Ok, we penciled you in. Please check your email to confirm your subscription.';
            res.jsonp([createResponse]);
          });

      } else if(!userData.newsletter) {
        console.log('userData: (response from email query):\n', userData);

        var updateUserObject = {
          body: userData
        };
        updateUserObject.body.newsletter = true;
        updateUserObject.body.ModifiedOn = Date.now();
        updateUserObject.body.ModifiedBy = userData.id;


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
        res.jsonp([{subscribed:true, message: 'email is already subscribed to newsletter'}]);
      }
    });


/**
 * Delete a user
 */
exports.delete = function (req, res) {
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


/**
 * Get list of Contributors
 */

exports.getContributors = function(req, res) {
  var query = User.find(req.query);
  query.or([{ roles: 'contributor' }, { roles: 'admin' }])
    .sort('-lastName')
    .exec( function (err,users) {
      if (err) {
        return res.send(400, {
          message: errorHandler.getErrorMessage(err)
        });
      }
        res.jsonp(users);
    });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};



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

  exports.getContributorByID = function(req, res) {

  };


  /**
   *
   */

  exports.deleteContributor = function(req, res) {

  };


};
