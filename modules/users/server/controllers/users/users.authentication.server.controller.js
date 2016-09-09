'use strict';

/**
 import path from 'path';
 import errorHandler from (path.resolve('./modules/core/server/controllers/errors.server.controller'));
 import Promise from 'bluebird';
 import mongoose from 'mongoose';
 import passport from 'passport';

 export { tempUserSignup };

 */

const path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Promise = require('bluebird'),
  mongoose = require('mongoose'),
  passport = require('passport');
const _ = require('lodash');

mongoose.Promise = Promise;
const User = mongoose.model('User');
const TempUser = mongoose.model('TempUser');

// URLs for which user can't be redirected on signin
const noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];


/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.tempUserSignup = (req, res, next) => {
  User.findOne({ email: req.body.email })
  .then(currentUser => {
    if (currentUser) {
      console.error('currentUser.errorMsg: ' + currentUser.errorMsg);
      throw new Error(currentUser);
    }
  })
  .then(() => {

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    // Init user and add missing fields
    const tempUser = new TempUser(req.body);
    tempUser.provider = 'local';
    tempUser.username = req.body.email;

    // Then save the user
    tempUser.save((err, success) => {
      if (err) {
        console.error('\n\nERROR tempUserSignup  Error#1::::::::::::::::::::\n', err);
        return res.status(400).send({message: errorHandler.getErrorMessage(err)});
      } else {
        if (req.login) {
          req.login(tempUser, err => {
            if (err) {
              console.error('\n\nERROR tempUserSignup  Error#2::::::::::::::::::::\n', err);
              return res.status(400).send({message: errorHandler.getErrorMessage(err)});
            }
            req.tempUser = success;
            next();
          });
        }
      }
    });
  })
  .catch(() => {
    return res.status(409).send({
      currentUserExists: true,
      message: 'Email already exists. You may have already registered.'
    });
  });
};


/**
 * Signup Test
 */
exports.signupNewUser = (req, res) => {
  let tempIdToDelete = '';

  TempUser.findOne({ _id: req.body._id })
  .exec()
  .then(tempUser => {
    const rawNewUser = _.extend({}, tempUser, req.body);
    const newUser = _.pick(rawNewUser, ['salt', 'username', 'provider', 'email', 'password', 'lastName', 'firstName', 'displayName', 'userAddress1', 'userAddress2', 'userCity', 'userState', 'userZip']);

    // store tempUserId in order to delete tempUser document upon success creating user doc
    tempIdToDelete = req.body._id;

    // create new user in db and return promise
    return User.create(newUser);
  })

  // login new user
  .then(newUser => {
    // Remove sensitive data before login
    newUser.password = undefined;
    newUser.salt = undefined;
    if (req.login) {
      req.login(newUser, err => {
        if (err) {
          console.error('ERROR logging in after creating new user:\n', err);
          throw new Error(err);
        }
      });
    }
    res.jsonp(newUser);
  })

  // after successfully creating new user, delete tempUser account
  .then(() => {
    return TempUser.findOneAndRemove({ _id: tempIdToDelete });
  })
  .catch(err => {
    console.error('ERROR new user signup / tempUser delete:\n', err);
    return res.status(400).send({message: errorHandler.getErrorMessage(err)});
  });


};

/**
 *
 * @param req
 * @param res
 */
exports.signupOld = (req, res) => {

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  var user = new User(req.body);
  user.provider = 'local';
  if (user.firstName && user.lastName) {
    user.displayName = user.firstName + ' ' + user.lastName;
  }
  // Then save the user
  user.save((err, success) => {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    // Remove sensitive data before login
    user.password = undefined;
    user.salt = undefined;

    console.log('req.login::::::::::::::::::::\n', req.login);

    if (req.login) {
      Promise.promisify(req.login);
      console.log('req.loginAsync::::::::::::::::::::\n', req.loginAsync);
      req.login(user, err => {
        if (err) {
          console.error('ERROR new user signup / tempUser delete:\n', err);
          return res.status(400).send({message: errorHandler.getErrorMessage(err)});
        }
        console.log('success::::::::::::::::::::\n', success);
        console.log('user::::::::::::::::::::\n', user);
        res.json(user);
      });
    }
  });
};


/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      req.session.redirect_to = req.query.redirect_to;
    }
    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    // Pop redirect URL from session
    var sessionRedirectURL = req.session.redirect_to;
    delete req.session.redirect_to;
    console.log('oAuthCb req obj:\n', req);
    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err) {
        console.log('error signing in:\n', err);
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(redirectURL || sessionRedirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already
    // configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};


// const Mongo = require('mongodb');
//
// console.log('Mongo:\n', Mongo);
//
// const db = mongoose.connections[0].db;
//
// console.log('\n\n\nmongoose.connection.db:\n', mongoose.connection.db);
// const Collections = mongoose.connection.db.collections;
// console.log('\n\n\ncollectionssssssssssssssssssssssss:\n', collections);
//
// const UsersCollection = db.collection('Users');
// console.log('\n\n\nUsersCollection:\n', UsersCollection);


// const usersDb = new Mongo().getDB('Users');
// const myUser = usersDb.find({ email: 'christanseer@hotmail.com' });
// console.log('myUser:\n', myUser);


// console.log('\n\n\nTempUser.collection::\n', TempUser.collection);
// console.log('\n\n\nTempUser.collection.conn::\n', TempUser.collection.conn);
// console.log('\n\n\nTempUser.collection.conn::\n', TempUser.collection.conn.collections.imagegalleries);
// console.log('\n\n\nTempUser.collection.conn::\n', TempUser.collection.conn.collections.tempusers);


// const tempsTry = mongoose.connection.db;
// const tempsTry = mongoose.connection.db.serverConfig;
// console.log('\n\n\ntemps::\n', tempsTry);


// const temps = mongoose.connections.getCollection('tempusers').find({});
// const temps = mongoose.connections.collections;
// const collections = mongoose.connections[0].collections;
// console.log('\n\n\ncollections::\n', collections);

