'use strict';

angular.module('projects').directive('projectStatusOverview', function () {
  return {
    restrict: 'EA',
    templateUrl: 'modules/projects/client/directives/project-status/views/project-status-overview.html',
    controller: function($scope) {
      // console.log('authenticatedUser::::::::::::::', $scope.authenticatedUser);
    }
  };
});
