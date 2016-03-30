'use strict';

angular.module('admins').directive('projectFiles', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/project-files.html',
    controller: function($scope) {
    // link: function($scope) {
        
      
      
    //   $scope.previewFiles = $scope.project.fileUrls;
    //   console.log('$scope.previewFiles:\n', $scope.previewFiles);
    //
    //   var fileReader = new FileReader();
    //
    //   // A callback, onloadend, is executed when the file has been read into memory, the data is then available via the result field.
    //   fileReader.loadend = function (event) {
    //
    //     console.log('event:\n', event);
    //     console.log('event.target.result:\n', event.target.result);
    //   }();
    //
    //   var newFile = fileReader.result;
    //   var printEventType = function (event) {
    //     console.log('got event: ' + event);
    //     console.log('event.type: ' + event.type);
    //   }();
    //
    //   fileReader.onload = function (event) {
    //     var arrayBuffer = fileReader.result;
    //     console.log('fileReader.result:\n', fileReader.result);
    //     console.log('arrayBuffer:\n', arrayBuffer);
    //   }();
    }

  };
});
