'use strict';

angular.module('core').directive('signInDirective', function() {
        return {
          restrict: 'EA',
          templateUrl: '/modules/core/client/directives/views/sign-in-directive.html',
          controller: function($scope, Authentication) {
            $scope.user = Authentication.user;
            if ($scope.user === '') {
              return
            } else if(Authentication.user.profileImageFileName === 'default.png' || Authentication.user.profileImageFileName === '') {
              $scope.user.profileImage = 'modules/users/client/img/profile/default.png';
            } else if (Authentication.user.profileImageFileName !== '' ) {
              $scope.user.profileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.jpg';
            }
            else {
              ProfileImageService.getUploadedProfilePic();
            }

          }
        };

    });
