"use strict";

angular.module('core').directive('featureSideBar', function () {

  return {
    restrict: 'EA',
    templateUrl: '/modules/core/client/directives/views/projects-sidebar.html',

    controller: function ($scope, $element) {
      $scope.toggleSidebar = false;
      let currentMarkerId = '';
      $scope.hideSidebar = function () {
        $scope.toggleSidebar = false;
        $element.css({'position': 'absolute', 'left': '0'});
      };
      $scope.showSidebar = function (markerId, projectData) {
        console.log('markerId:\n', markerId);
        console.log('projectData:\n', projectData);
        if (currentMarkerId !== markerId || currentMarkerId === markerId && !$scope.toggleSidebar) {
          console.log('currentMarkerId  :::::: inside `if`:\n', currentMarkerId);
          console.log('$element.css  :::::: inside `if`:\n', $element.css);
          $scope.project = projectData;
          $scope.toggleSidebar = true;
          $element.css({'position': 'absolute', 'left': '-19%'});
          currentMarkerId = markerId;
        } else {
          console.log('currentMarkerId  :::::: inside `else`:\n', $scope.toggleSidebar);
          console.log('$element.css  :::::: inside `else`:\n', $element.css);
          $scope.toggleSidebar = false;
          $element.css({'position': 'absolute', 'left': '0'});
        }
      };

    }
  }
});
