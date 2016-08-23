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
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  const tempUser = new TempUser(req.body);
  tempUser.provider = 'local';
  tempUser.username = req.body.email;

  // Then save the user
  tempUser.save((err, success) => {
    if (err) {
      console.error('\n\nerr #1::::::::::::::::::::\n', err);
      return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
    } else {
      if (req.login) {
        req.login(tempUser, err => {
          if (err) {
            console.error('\n\nerr #2::::::::::::::::::::\n', err);
            return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
          }

          /** transform req object for next middleware function, `exports.formatEmail()` **/
          req.email = {
            to: req.body.email,
            subjectLine: req.body.subjectLine || 'Mapping SLC | Please confirm your email address'
          };
          req.tempUser = success;
          next();
        });
      }
    }
  });
};

/**
 * Signup Test
 */
exports.signupTest = (req, res) => {
  console.log('hi you hit the test sign up!!');
  console.log('req.query:\n', req.query);
  console.log('req.query.tempUserId: ', req.query.tempUserId);
  console.log('req.query.tempToken: ', req.query.tempToken);

  const query = TempUser.findOne({ _id: req.query.tempUserId })
  .exec()
  .then(tempUser => {
    if(req.query.tempToken !== tempUser.tempToken) {
      tempUser.error = 'We are not able to confirm your email address';
      throw tempUser;
    }
    console.log('and you\'re confirmed');
    console.log('tempUser:\n', tempUser);
    // delete certain fields on tempUser before saving to User Db
    // delete tempUser.
    // save tempUser as a new user to User Db
    return User.save(tempUser);
  })
  .then(newUser => {
    console.log('newUser:\n', newUser);
    return res.jsonp(newUser);
  })
  .catch(err => {
    console.error('err:\n', err);
    console.error('tempUser:\n', tempUser);
    return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
  });



  if(req.query.tempToken === '456') {
    console.log('and you\'re confirmed');
    const newUser = TempUser.findOne({ _id: req.query.tempUserId });
    console.log('newUser:\n', newUser);
    res.jsonp(newUser);
  } else {
    console.log('nada!!!!!!!!!!!!!!!!!!!!!!!!!!!1');
  }
};

/**
 *
 * @param req
 * @param res
 */
exports.signup = (req, res) => {

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  var user = new User(req.body);
  user.provider = 'local';
  if (user.firstName && user.lastName) {
    user.displayName = user.firstName + ' ' + user.lastName;
  }
  // Then save the user
  user.save(function (err, success) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      if (req.login) {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
        //} else {
        console.log('success::::::::::::::::::::\n', success);
        //  res.json(user);
      }
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

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
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
