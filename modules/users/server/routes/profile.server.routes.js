'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller'),
    profile = require('../controllers/users/users.profile.server.controller.js');


  // User's Favorite Projects Route
  app.route('/api/v1/users/:userId/favorites')
    .get(profile.getFavorites)
    .put(profile.updateFavorites);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
