'use strict';

angular.module('admins').directive('projectTabs', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/project-tabs.html',
    controller: function($scope, $stateParams, Projects, $http) {

      this.getProject = function() {
        return Projects.get({ projectId: $stateParams.projectId });
      };

      // this.getProject2 = function() {
      //   return $http.get('/api/v1/projects/' + $stateParams.projectId, { cache: true });
      // };
    }
  };
});
