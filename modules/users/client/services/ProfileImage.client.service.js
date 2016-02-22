'use strict';

// retrieve user's profile image

angular.module('users').service('ProfileImageService', ['$http', 'Authentication',
  function ($http, Authentication) {

    this.getUploadedProfilePic = function () {
      var user = Authentication.user;
      var configObj = { cache: true };
      console.log('ProfileImageService\nuser.profileImageFileName: ', user.profileImageFileName, '\n\n');

      $http.get('api/v1/users/' + user._id + '/images/' + user.profileImageFileName, configObj)
        .then(function successCallback(successCallback) {
          console.log('\nProfileImageService\successCallback:::::\n', successCallback, '\n\n');
          user.profileImage0 = successCallback.data.image;
          //user.profileImage1 = successCallback.data.fullResponse.Body.data;
          //user.profileImage2 = successCallback.data.imageAsBase64Array;
          //user.profileImage3 = successCallback.data.imageAsUtf8;
          //user.profileImage4 = successCallback.data.imageObjectAsString;
          console.log('\nProfileImageService\nprofileImage0', user.profileImage0, '\n\n');
          //console.log('\nProfileImageService\nprofileImage1', user.profileImage1, '\n\n');
          //console.log('\nProfileImageService\nprofileImage2', user.profileImage2, '\n\n');
          //console.log('\nProfileImageService\nprofileImage3', user.profileImage3, '\n\n');
          //console.log('\nProfileImageService\nprofileImage4', user.profileImage4, '\n\n');

        }, function errorCallback(errorCallback) {
          console.log('ProfileImageService\nprofile photo error', errorCallback, '\n\n');
          user.profileImage = 'modules/users/client/img/profile/default.png';
          //user.profileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.jpg';
        });
    };
  }
]);
