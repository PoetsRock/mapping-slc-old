'use strict';

/**
 * Module dependencies
 */
const adminPolicy = require('../policies/admin.server.policy');
const admin = require('../controllers/admin.server.controller');
const adminV2 = require('../controllers/admin.v2.server.controller');
const usersMiddleware = require('../controllers/users/users.middleware.server.controller');
const tempUsersMiddleware = require('../controllers/users/users.tempUser.middleware.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/v1/admin/users')
    .get(admin.list);

  //app.route('/api/v1/users/newsletter').put(admin.addNewsletter);
  app.route('/api/v1/newsletter')
    .get(admin.addNewsletter);

  // Single user routes
  app.route('/api/v1/users/:userId')
    .get(admin.getUser)
    .delete(adminPolicy.isAllowed, admin.deleteUser)
    .put(admin.updateUser)
    .patch(adminV2.patchUser);

  // Single user routes
  app.route('/api/v1/tempUser/:tempUserId')
  .get(admin.getTempUser)
  .delete();

  // Contributors collection routes
  app.route('/api/v1/contributors')
    .get(admin.getContributors);

  // Single contributor routes
  app.route('/api/v1/contributors/:userId')
    .get(admin.getContributorByUserId);

  // Contributor Projects Routes - returns only published projects
  app.route('/api/v1/contributors/:userId/projects')
  .get(adminV2.getContributorProjects);

  //var myFunction = function myFunction () {
  //  //this will show up in a stack trace
  //};

  // Finish by binding the user middleware
  app.param('userId', usersMiddleware.userById);
  app.param('tempUserId', tempUsersMiddleware.tempUserById);
  app.param('tempUserEmail', tempUsersMiddleware.tempUserByEmail);
};
