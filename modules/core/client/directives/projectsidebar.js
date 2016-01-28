//"use strict";
//
//angular.module('core').directive('featureSideBar', function () {
//
//  return {
//    restrict: 'EA',
//    templateUrl: '/modules/core/client/directives/views/projects-sidebar.html',
//
//    controller: function ($scope, $element) {
//      $scope.toggleSidebar = false;
//      let currentMarkerId = '';
//      $scope.hideSidebar = function () {
//        $scope.toggleSidebar = false;
//        scope.$emit('closeMap');
//        //$element.css({'position': 'absolute', 'left': '0'});
//      };
//      $scope.showSidebar = function (markerId, projectData) {
//        if (currentMarkerId !== markerId || currentMarkerId === markerId && !$scope.toggleSidebar) {
//          console.log('$element.css  :::::: inside `if`:\n', $element.css);
//          $scope.project = projectData;
//          $scope.toggleSidebar = true;
//          //$element.css({'position': 'absolute', 'left': '-19%'});
//          currentMarkerId = markerId;
//        } else {
//          console.log('$element.css  :::::: inside `else`:\n', $element.css);
//          $scope.toggleSidebar = false;
//          $scope.$emit('closeMap');
//          //$element.css({'position': 'absolute', 'left': '0'});
//        }
//      };
//
//    }
//  }
//});


angular.module('core').directive('featureSideBar',function(){
  "use strict";
  return {
    restrict: 'EA',
    templateUrl: '/modules/core/client/directives/views/projects-sidebar.html',
    scope: true,
    link: function (scope) {
      scope.show = false;

      scope.hide = function () {
        scope.show = !scope.show;
        scope.$emit('closeMap')
      };

      function identical(array) {
        for(var i = 0; i < array.length - 1; i++) {
          if(array[i] != array[i+1]) {
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
          if (identical(scope.eyedees)){
            scope.hide();
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
