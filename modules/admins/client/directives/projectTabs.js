'use strict';

angular.module('admins').directive('projectTabs', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/project-tabs.html',
    controller: function($scope, $stateParams, Projects) {

      this.getProject = function() {
        return Projects.get({ projectId: $stateParams.projectId });
      };
    }
  };
});
