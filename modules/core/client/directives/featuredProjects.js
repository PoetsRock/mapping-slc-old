'use strict';

angular.module('core').directive('featuredProjects', function () {
  return {
    restrict: 'EA',
    templateUrl: 'modules/core/client/directives/views/featured-projects.html',
    controller: function ($scope, $http) {

      //get featured projects as array
      $scope.featuredProjects = [];
      var getFeatured = function () {
        console.log('`getFeatured()`:\n');
        $http.get('/api/v1/featured', { cache: true })
          .then(function (resolved, rejected) {
            if(rejected) {
              console.log('rejected:\n', rejected);
              return;
            }
            console.log('resolved.data:\n', resolved.data);
            $scope.featuredProjects = resolved.data;
          });
      };
      getFeatured();

    }
  };
});
