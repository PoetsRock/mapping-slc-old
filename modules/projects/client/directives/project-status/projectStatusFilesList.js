(function () {
  'use strict';

  angular.module('projects')
  .directive('projectStatusFilesList', projectStatusFilesList);

  projectStatusFilesList.$inject = [];

  function projectStatusFilesList() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'modules/projects/client/directives/project-status/views/project-status-files-list.html',
      controller: controller
    };
    return directive;

    function controller($scope, $http) {
      var vm = this;

      vm.$onInit = function () {};

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
  }
}());
