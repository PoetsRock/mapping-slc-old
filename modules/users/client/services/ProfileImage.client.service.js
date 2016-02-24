'use strict';

// retrieve user's profile image

angular.module('users').service('ProfileImageService', ['$http', 'Authentication',
  function ($http, Authentication) {

    this.getUploadedProfilePic = function (data, callback) {
      var user = data.user;
      var configObj = { cache: true };
      console.log('ProfileImageService\nuser.profileImageFileName: ', user.profileImageFileName, '\n\n');

      // $http.get('api/v1/users/' + user._id + '/images/' + user.profileImageFileName, configObj)
      $http.get('api/v1/users/' + user._id + '/images/uploaded-profile-image.jpg', configObj)
        .then(function successCallback(successCallback) {
          console.log('\nProfileImageService\successCallback:::::\n', successCallback, '\n\n');
          console.log('user:::::\n', user, '\n\n');
          // return user.profileImage = successCallback.data.url;
          return callback (successCallback.data.url);
        }, function errorCallback(errorCallback) {
          console.log('ProfileImageService\nprofile photo error', errorCallback, '\n\n');
          user.profileImage = 'modules/users/client/img/profile/default.png';
        });
    };
  }
]);
