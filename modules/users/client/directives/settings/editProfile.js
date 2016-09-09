'use strict';

angular.module('users').directive('editProfile', function () {
  return {
    restrict: 'EA',
    templateUrl: 'modules/users/client/directives/settings/views/edit-profile.html'
  };
});
