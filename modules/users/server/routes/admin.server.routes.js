'use strict';

/**
 * Module dependencies
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller'),
  adminV2 = require('../controllers/admin.v2.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/v1/admin/users')
    .get(admin.list);

  //app.route('/api/v1/users/newsletter').put(admin.addNewsletter);
  app.route('/api/v1/newsletter')
    .get(admin.addNewsletter);
  //
  // Single user routes
  app.route('/api/v1/users/:userId')
    .get(admin.getUser)
    .delete(adminPolicy.isAllowed, admin.deleteUser)
    .put(admin.updateUser)
    .patch(adminV2.patchUser);

  // Contributors collection routes
  app.route('/api/v1/contributors')
    .get(admin.getContributors);

  // Single contributor routes
  app.route('/api/v1/contributors/:userId')
    .get(admin.getContributorByUserId);

  //var myFunction = function myFunction () {
  //  //this will show up in a stack trace
  //};

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
