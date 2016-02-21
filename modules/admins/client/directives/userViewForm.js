'use strict';

angular.module('admins').directive('adminEditUser', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/user-view-form.html'
  };
});
