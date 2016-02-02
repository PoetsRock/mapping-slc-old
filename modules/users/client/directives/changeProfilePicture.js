'use strict';

angular.module('users').directive('changeProfilePicture', function () {
  return {
    restrict: 'EA',
    templateUrl: 'modules/users/client/directives/views/change-profile-picture.html'
  };
});
