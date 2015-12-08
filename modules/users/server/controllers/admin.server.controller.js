'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  admin = require('./admin.server.controller.js'),
  auth = require('./users/users.authentication.server.controller.js'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

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
  var user = req.model;

  //For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;
  user.associatedProjects.push(req.body.associatedProjects);

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

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
  User.find({}, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
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

exports.getContributors = function(req, res) {
  var query = User.find(req.query);
  query.or([{ roles: 'contributor' }, { roles: 'admin' }])
    .sort('-lastName')
    .exec( function (err,users) {
      if (err) {
        return res.send(400, {
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(users);
      }
    });
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

exports.addNewsletter = function (req, res) {

  var newUserObject = {  };
  var updateUserObject = {  };

  User.find({
    email: req.email
  })
    .select('newsletter firstName lastName email modifiedOn')
    .exec(function(err, response) {
    if(err) {
      //email does not exist. create a new user
      console.log('email does not exist. creating new user.\nError message:\n', err);
      auth.create(newUserObject, function(createResponse) {
        console.log('createResponse:\n', createResponse);
        res.jsonp(createResponse);
      });
    } else if (!response.newsletter) {
      //update user document to subscribe them to the newsletter
      admin.update(updateUserObject, function(updateResponse){
        console.log('updateResponse:\n', updateResponse);
        res.jsonp(updateResponse);
      });
    } else if (response.newsletter) {
      //email address is already receiving the newsletter
      //send back message to front end
      res.send('email is already subscribed to newsletter');
    } else {
      throw new Error('error subscribing user to newsletter. please try your request again.')
    }
  });

  // start here:
  //   http://mongoosejs.com/docs/queries.html
  //
  // and then:
  //   http://mongoosejs.com/docs/api.html#query-js


};
