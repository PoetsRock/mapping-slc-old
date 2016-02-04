'use strict';

angular.module('core').directive('featureSideBar', function () {
  return {
    restrict: 'EA',
    templateUrl: '/modules/core/client/directives/views/projects-sidebar.html',
    scope: true,
    link: function (scope) {
      scope.show = false;
        scope.hideSidebar = function () {
            console.log('hidefunction')
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


        scope.project = data;
        scope.eyedees.push(scope.project.projectId);


        if (scope.eyedees.length == 1) {
          scope.show = true;
        }
        if (scope.eyedees.length > 1) {
          if (identical(scope.eyedees)) {
            scope.hideSidebar();
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



