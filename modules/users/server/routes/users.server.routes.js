'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users profile api
  app.route('/api/v1/users/me').get(users.me)
      .put(users.update);

  app.route('/api/v1/users')
      .put(users.update);

    app.route('/api/v1/users/accounts').delete(users.removeOAuthProvider);
      app.route('/api/v1/users/password').post(users.changePassword);
      app.route('/api/v1/users/media/photo').post(users.changeProfilePicture);
      app.route('/api/v1/users/:userId/media/uploadedProfileImage/:photoId').get(users.getS3File);
      //app.route('/api/v1/s3/upload/:directory').post(users.changeProfilePicture);
      app.route('/api/v1/s3/upload/media/photo').post(users.uploadUserProfileImage);
      app.route('/api/v1/s3/upload/project').post(users.uploadProject);


  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
