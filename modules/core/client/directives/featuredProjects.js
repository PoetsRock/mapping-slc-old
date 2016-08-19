'use strict';

angular.module('core').directive('featuredProjects', function () {
  return {
    restrict: 'EA',
    templateUrl: 'modules/core/client/directives/views/featured-projects.html',
    controller: function ($scope, $http) {

      (function getFeaturedProjs() {
        console.log('`getFeatured()`:\n');
        $http.get('/api/v1/featured', { cache: true })
          .then(function successCallback(resolved) {
            console.log('resolved.data:\n', resolved.data);
            console.log('resolved.data[0]:\n', resolved.data[0]);
            $scope.featuredProjects = resolved.data;
            // $scope.featuredProjects.map(function(project) {
            //   project.imageGallery.forEach(function(image) {
            //     if(image.isDefaultImage) {
            //       $scope.featuredProjects.defaultImage = image;
            //     }
            //   });
            // });
          }, function errorCallback(rejected) {
            return console.log('rejected:\n', rejected);
          });
      })();

    }
  };
});
