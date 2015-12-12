'use strict';

/**
 * Module dependencies.
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/v1/users').get(admin.list);

  //app.route('/api/v1/users/newsletter').put(admin.addNewsletter);
  app.route('/api/v1/newsletter')
      .get(admin.addNewsletter);
  //
  // Single user routes
  app.route('/api/v1/users/:userId')
      .get(admin.read)
      .delete(adminPolicy.isAllowed, admin.delete)
      .put(admin.update);

  // Contributors collection routes
  app.route('/api/v1/contributors')
    .get(admin.getContributors);

  // Single contributor routes
  app.route('/api/v1/contributors/:userId')
    .get(admin.getContributorByID);


  var myFunction = function myFunction () {
    //this will show up in a stack trace
  };

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
