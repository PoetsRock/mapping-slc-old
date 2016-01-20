'use strict';

angular.module('core').directive('googleMenu', function(AdminAuthService) {
  return {
    restrict: 'EA',
    templateUrl: 'modules/core/client/directives/views/google-menu.client.view.html',

    controller: function($scope) {
      $scope.isAdmin = AdminAuthService.user;
    },

    link: function($scope) {

    }

  };
});
