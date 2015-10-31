'use strict';

angular.module('core').directive('mainMenu', function(AdminAuthService) {
    return {
      restrict: 'EA',
      templateUrl: '/modules/core/client/directives/views/main-menu.html',

      controller: function($scope) {
        $scope.isAdmin = AdminAuthService.user;
      },

      link: function() {
        var sidebar = L.control.sidebar('sidebar', {
          closeButton: true,
          position: 'left'
        }).addTo(map);
      }

    };
});



//// add Admin link in menu if user is admin
//if ($scope.authentication.user.roles[0] === 'admin' || $scope.authentication.user.roles[0] === 'superAdmin')
