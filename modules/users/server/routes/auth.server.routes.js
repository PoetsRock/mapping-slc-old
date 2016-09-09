'use strict';

/**
 * Module dependencies
 */
const passport = require('passport');

module.exports = function (app) {
  // User Routes
  const users = require('../controllers/users.server.controller');
  const admin = require('../controllers/admin.server.controller');
  const tempUsersMiddleware = require('../controllers/users/users.tempUser.middleware.server.controller');
  const emailCtrl = require('../../../contacts/server/controllers/contacts.email.server.controller');
  const contactsMiddleware = require('../../../contacts/server/controllers/contacts.middleware.server.controller');

  // Setting up the users password api
  app.route('/api/v1/auth/forgot').post(users.forgot);
  app.route('/api/v1/auth/reset/:token').get(users.validateResetToken);
  app.route('/api/v1/auth/reset/:token').post(users.reset);

  // Setting up the users authentication api

  app.route('/api/v1/auth/signin').post(users.signin);
  app.route('/api/v1/auth/signout').get(users.signout);

  // route that creates a new tempUser
  app.route('/api/v1/auth/signup')
    .post(users.tempUserSignup, contactsMiddleware.formatEmail, emailCtrl.sendTempUserSignupEmail);

  app.route('/api/v1/auth/signup/tempUsers/emails/:tempUserEmail/resend')
    .post(contactsMiddleware.formatEmail, emailCtrl.sendTempUserSignupEmail);

  // route that creates a new user and deletes tempUser
  app.route('/api/v1/auth/signup/verify')
    .post(tempUsersMiddleware.tempUserByEmail, users.signupNewUser);



  // Setting the facebook oauth routes
  app.route('/api/v1/auth/facebook').get(users.oauthCall('facebook', {
    scope: ['email']
  }));
  app.route('/api/v1/auth/facebook/callback').get(users.oauthCallback('facebook'));

  // Setting the twitter oauth routes
  app.route('/api/v1/auth/twitter').get(users.oauthCall('twitter'));
  app.route('/api/v1/auth/twitter/callback').get(users.oauthCallback('twitter'));

  // Setting the google oauth routes
  app.route('/api/v1/auth/google').get(users.oauthCall('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));
  app.route('/api/v1/auth/google/callback').get(users.oauthCallback('google'));

  // Setting the linkedin oauth routes
  app.route('/api/v1/auth/linkedin').get(users.oauthCall('linkedin', {
    scope: [
      'r_basicprofile',
      'r_emailaddress'
    ]
  }));
  app.route('/api/v1/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

  // Setting the github oauth routes
  app.route('/api/v1/auth/github').get(users.oauthCall('github'));
  app.route('/api/v1/auth/github/callback').get(users.oauthCallback('github'));

  // Setting the paypal oauth routes
  app.route('/api/v1/auth/paypal').get(users.oauthCall('paypal'));
  app.route('/api/v1/auth/paypal/callback').get(users.oauthCallback('paypal'));

  // Setting the vimeo oauth routes
  app.route('/api/v1/auth/vimeo').get(users.oauthCall('vimeo'));
  app.route('/api/v1/auth/vimeo/callback').get(users.oauthCallback('vimeo'));
};
