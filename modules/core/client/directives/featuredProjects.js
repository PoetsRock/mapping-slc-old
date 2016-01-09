'use strict';

angular.module('core').directive('featuredProjects', function () {
  return {
    restrict: 'EA',
    templateUrl: '/modules/core/client/directives/views/featured-projects.html',
    controller: function ($scope, $http) {
      //provides logic for displaying featured project's title on mouseover
      $scope.showTitle = false;
      //$scope.showTitle = true;
    }
  };
});
