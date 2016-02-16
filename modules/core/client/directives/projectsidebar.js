'use strict';

angular.module('core').directive('featureSideBar', function () {
  return {
    restrict: 'EA',
    templateUrl: '/modules/core/client/directives/views/projects-sidebar.html',
    controller: function ($scope) {
      let currentMarkerId = '';
      $scope.toggleSidebar = false;

      $scope.hideSidebar = function () {
        $scope.toggleSidebar = false;
        $scope.shadeMap = true;
        jQuery('.leaflet-top.leaflet-right').css('right','0');
        jQuery('.menu-ui').css('right','1.5%');
      };
      $scope.$on('MenuService.update',function(){
        $scope.hideSidebar();
      });
      $scope.showSidebar = function (markerId, projectData) {
        if (currentMarkerId !== markerId || currentMarkerId === markerId && !$scope.toggleSidebar) {
          $scope.project = projectData;
          $scope.toggleSidebar = true;
          currentMarkerId = markerId;
          jQuery('.leaflet-top.leaflet-right').css('right','20%');
          jQuery('.menu-ui').css('right','22%');
        } else {
          $scope.toggleSidebar = false;
          jQuery('.leaflet-top.leaflet-right').css('right','0');
          jQuery('.menu-ui').css('right','1.5%');
        }
      };

    }
  };

});



