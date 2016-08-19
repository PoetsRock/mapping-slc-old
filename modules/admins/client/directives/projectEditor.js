'use strict';

angular.module('admins').directive('projectEditor', function () {
  return {
    restrict: 'EA',
    require: '^projectTabs',
    templateUrl: '/modules/admins/client/directives/views/project-editor.html',
    controller: function ($scope) {
      console.log('$scope.project:\n', $scope.project);
      // console.log('$scope.project.story: ', $scope.project.story);
    },
    link: function(scope, element, attrs, projectTabsCtrl) {

      scope.project = projectTabsCtrl.getProject();
      console.log('scope.project.story: ', scope.project.story);
      console.log('scope.project.city: ', scope.project.city);
    }
  };
});
