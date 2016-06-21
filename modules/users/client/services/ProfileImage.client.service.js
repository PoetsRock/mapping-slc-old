'use strict';

// retrieve user's profile image

angular.module('users').service('ProfileImageService', ['$http',
  function ($http) {

    this.getUploadedProfilePic = function (data, callback) {
      var user = data.user;
      var configObj = { cache: true };
      $http.get('api/v1/users/' + user._id + '/images/uploaded-profile-image.jpg', configObj)
      .then(function (successCallback) {
        return callback(successCallback.data.url);
      })
      .catch(function (errorCallback) {
        user.profileImage = 'modules/users/client/img/profile/default.png';
      });
    };
  }
]);
