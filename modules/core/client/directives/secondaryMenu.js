'use strict';

angular.module('core').directive('secondaryMenuDirective', function () {

  return {

    restrict: 'E',
    templateUrl: '/modules/core/client/directives/views/secondary-menu-directive.html',

    controller: function (Authentication, $scope) {
      $scope.user = Authentication.user;
      $scope.toggleSecondMenu = false;
    }


  }
});
