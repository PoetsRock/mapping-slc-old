'use strict';

angular.module('core').directive('featureSideBar', function () {
  return {
    restrict: 'EA',
    templateUrl: '/modules/core/client/directives/views/projects-sidebar.html',
    scope: {

    },
    link: function (scope) {
      scope.show = false;
        scope.hideSidebar = function () {
            jQuery('.leaflet-top.leaflet-right').css('right','0');
            jQuery('.menu-ui').css('right','1.5%');
            scope.show = !scope.show;
            scope.$emit('closeMap')
        };

      function identical(array) {
        for (var i = 0; i < array.length - 1; i++) {
          if (array[i] != array[i + 1]) {
            return false;
          }
        }
        return true;
      }

      scope.eyedees = [];

      scope.$on('CurrentStory', function (event, data) {
          jQuery('.leaflet-top.leaflet-right').css('right','20%');
          jQuery('.menu-ui').css('right','22%');
        scope.project = data;
        scope.eyedees.push(scope.project.projectId);


        if (scope.eyedees.length == 1) {
          scope.show = true;
        }
        if (scope.eyedees.length > 1) {
          if (identical(scope.eyedees)) {
            scope.hideSidebar();
              jQuery('.leaflet-top.leaflet-right').css('right','0');
              jQuery('.menu-ui').css('right','1.5%');
            scope.eyedees = [];
          }
          else {
            scope.show = true;
            scope.eyedees = [];
          }

        }

      });

    }
  };

});



