'use strict';

angular.module('admins').directive('projectImages', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/project-images.html',
    controller: function ($scope, $http, $element) {

      $scope.uploadImage = function() {

      };
      
      $scope.deleteImageById = function(imageData) {
        return $http.put('/api/v1/projects/' + $scope.project._id + '/images/' + imageData.imageId, imageData)
        .then(function(resolve, reject) {
          if(reject) {
            console.error('ERROR: Image was not deleted:\n', reject)
          }
          console.log('SUCCESS: Image deleted:\n', resolve);
          return resolve
        });
      }
      
    }
  };
});
