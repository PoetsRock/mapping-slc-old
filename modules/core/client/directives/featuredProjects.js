'use strict';

angular.module('core').directive('featuredProjects', function () {
  return {
    restrict: 'EA',
    templateUrl: 'modules/core/client/directives/views/featured-projects.html',
    controller: function ($scope, $http) {

      (function getFeaturedProjs() {
        $http.get('/api/v1/featured', { cache: true })
          .then(function successCallback(resolved) {
            $scope.featuredProjects = resolved.data;
          }, function errorCallback(rejected) {
            return console.log('rejected:\n', rejected);
          });
      })();

    }
  };
});
