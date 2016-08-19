'use strict';

angular.module('core').directive('projectsSideBar', function () {
  return {
    restrict: 'EA',
    templateUrl: '/modules/core/client/directives/views/projects-sidebar.html',
    controller: function ($rootScope, $scope) {
      var currentMarkerId = '';
      var zoomElement;

      $scope.toggleSidebar = false;



      // work around, bc it appears that leaflet elements are not loaded in the DOM immediately
      setTimeout(function() {
      zoomElement = angular.element( document.querySelector('#map div.leaflet-control-container div.leaflet-top.leaflet-right div.leaflet-control-zoom.leaflet-bar.leaflet-control'));
      }, 3000);

      /**
       *
       * @param markerId
       * @param projectData
       * @param closeSidebar {boolean}
       */
      $scope.showSidebar = function (markerId, projectData, closeSidebar) {
        console.log('project data:\n', projectData);
        $scope.displaySummary = projectData.storySummary || projectData.story.substring(0, 75);
        //todo refactor bc this big of a conditional check seems ugly
        if (currentMarkerId === markerId && !$scope.toggleSidebar) {
          $scope.project = projectData;
          $scope.toggleSidebar = true;
          zoomElement.addClass('toggle-zoom-icons-right');
          // currentMarkerId = markerId; //shouldn't need since they should already be the same in this condition
        } else if(currentMarkerId !== markerId && !closeSidebar) {
          $scope.project = projectData;
          $scope.toggleSidebar = true;
          zoomElement.addClass('toggle-zoom-icons-right');
          currentMarkerId = markerId;
        } else {
          $scope.toggleSidebar = false;
          zoomElement.removeClass('toggle-zoom-icons-right');
        }
      };


      $scope.$on('MenuService.toggleSidebar', function(event, markerId, projectData, closeSidebar){
        if(closeSidebar) {
          return $scope.showSidebar(0, null, true);
        }
        return $scope.showSidebar(markerId, projectData, closeSidebar);
      });

    }
  };

});
