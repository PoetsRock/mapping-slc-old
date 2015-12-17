'use strict';

angular.module('core').directive('signInDirective', function() {
        return {
          restrict: 'EA',
          templateUrl: '/modules/core/client/directives/views/sign-in-directive.html',
          controller: function($scope, $http, Authentication) {
            var userProfileImage = '';
            $scope.user = Authentication.user;

            if ($scope.user === '') {
              console.log('directive profilePic Service - calling nothing, just `return`');
              return
            } else if(Authentication.user.profileImageFileName === 'default.png' || Authentication.user.profileImageFileName === '') {
              $scope.user.profileImage = 'modules/users/client/img/profile/default.png';
            } else if (Authentication.user.profileImageFileName !== '' ) {
              $scope.user.profileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.jpg';
            }


            /**
             *
             * turning the s3 get image function off for now ...
             * it returns data... just don't know how to parse what i'm getting back
             * uncomment and load home page and look in console log to see a few options for how i'm
             *    trying to parse.
             */
            /**
            else {

              $scope.getUploadedProfilePic = function() {
                var user = Authentication.user;
                //var configObj = {cache: true, responseType: 'arraybuffer'};
                var configObj = {cache: true};


                $http.get('api/v1/users/' + user._id + '/media/' + user.profileImageFileName, configObj)
                  .then(function successCallback(successCallback) {
                    console.log('profilePic - successCallback\n', successCallback);
                    console.log('successCallback.data.imageAsBase64Array\n', successCallback.data.imageAsBase64Array);
                    console.log('successCallback.data.imageAsUtf8\n', successCallback.data.imageAsUtf8);
                    console.log('successCallback.data.imageObjectAsString\n', successCallback.data.imageObjectAsString);
                    return userProfileImage = successCallback.data.imageAsBase64Array;
                  }, function errorCallback(errorCallback) {
                    console.log('profile photo error', errorCallback);
                    return userProfileImage = 'modules/users/client/img/profile/default.png';
                  });

              };
              $scope.getUploadedProfilePic();
              $scope.user.profileImage = userProfileImage;


            }
             **/

          }
        };

    });
