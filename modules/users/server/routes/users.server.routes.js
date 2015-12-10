'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/users.server.controller');

  // Setting up the users profile api
  app.route('/api/v1/users/me').get(users.me)
  app.route('/api/v1/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/v1/users/password').post(users.changePassword);

  app.route('/api/v1/users/media/photo').post(users.changeProfilePicture);
  app.route('/api/v1/users/:userId/media/uploadedProfileImage/:photoId')
    .get(users.getS3File);

    app.route('/api/v1/users/accounts').delete(users.removeOAuthProvider);
      app.route('/api/v1/users/password').post(users.changePassword);
      app.route('/api/v1/users/media/photo').post(users.changeProfilePicture);

      app.route('/api/v1/s3/upload/media/photo').post(users.uploadUserProfileImage);
      app.route('/api/v1/s3/upload/project').post(users.uploadProject);
  app.route('/api/v1/s3/upload/media/photo').post(users.uploadUserProfileImage);
  app.route('/api/v1/s3/upload/project').post(users.uploadProject);

  /**
   * Express.js Response methods
   The methods on the response object (res) in the following table can send a response to the client, and terminate the request-response cycle. If none of these methods are called from a route handler, the client request will be left hanging.
   * res.sendFile	Send a file as an octet stream.
   * res.download()	Prompt a file to be downloaded.
   *
   **/


  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
