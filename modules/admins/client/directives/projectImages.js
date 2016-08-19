'use strict';

angular.module('admins').directive('projectImages', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/project-images.html',
    controller: function ($scope, $http, notify) {

      $scope.editImages = false;

      $scope.setDefaultImage = function (imageNull, index) {
        $scope.project.imageGallery.find(function(image, currentIndex) {
          if(image.isDefaultImage) {
            $scope.project.imageGallery[currentIndex].isDefaultImage = false;
          }
        });
        $scope.project.imageGallery[index].isDefaultImage = true;
        var updatedFields = {
          imageGallery: $scope.project.imageGallery,
          mainImage: $scope.project.imageGallery[index]
        };
        return $http.patch('/api/v1/projects/' + $scope.project._id + '/images?setDefaultImage=true', updatedFields)
        .then(function successCallback() {
          notify({
            message: 'Default image has been updated',
            classes: 'ng-notify-contact-success'
          })
        }, function errorCallback(reject) {
          console.error('ERROR: Image was not deleted `reject`:\n', reject);
          notify({
            message: 'Error updating default image',
            classes: 'ng-notify-contact-failure'
          });
        });
      };


      $scope.deleteImageById = function (image, index) {
        return $http.delete('/api/v1/projects/' + $scope.project._id + '/images/' + image.imageId, image)
        .then(function successCallback() {
        //   function find(element, index) {
        //     if(element.imageId === imageData.imageId) return index;
        //   }
        //   var index = $scope.project.imageGallery.findIndex(find);
          // $scope.$watch('project.imageGallery', function (newValue, oldValue, scope) {
          $scope.project.imageGallery.splice(index, 1);
          // }, true); // sets objectEquality parameter in order to perform a deep watch on the array

        }, function errorCallback(reject) {
          console.error('ERROR: Image was not deleted `reject`:\n', reject);
        });
      }

    }
  };
});
