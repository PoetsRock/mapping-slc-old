'use strict';

angular.module('core').directive('projectSideBar', function () {
  return {
    restrict: 'EA',
    templateUrl: '/modules/core/client/directives/views/projects-sidebar.html',
    controller: function ($scope) {
      var currentMarkerId = '';
      $scope.toggleSidebar = false;

      $scope.hideSidebar = function () {
        $scope.toggleSidebar = false;
        $scope.shadeMap = true;
      };
      $scope.$on('MenuService.update',function(){
        $scope.hideSidebar();
      });
      $scope.showSidebar = function (markerId, projectData) {
        if (currentMarkerId !== markerId || currentMarkerId === markerId && !$scope.toggleSidebar) {
          $scope.project = projectData;
          $scope.toggleSidebar = true;
          currentMarkerId = markerId;
        } else {
          $scope.toggleSidebar = false;
        }
      };

    }
  };

});
