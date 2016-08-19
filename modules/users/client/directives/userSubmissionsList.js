'use strict';

angular.module('users').directive('userSubmissionsList', function () {
  return {
    restrict: 'EA',
    templateUrl: 'modules/users/client/directives/views/user-submissions-list.html',
    controller: function ($scope, Projects) {

      $scope.subStatuses = ['received', 'pending', 'rejected', 'soft_rejection', 'revise', 'accepted', 'userPulled', 'staffPulled', 'published', 'edit'];

      // todo shift work to back end -- create a route that returns all projects by userId and returns an array of projects
        var userProjects = [];
        return function getProjects() {
          $scope.user.associatedProjects.map(function (associatedProject) {
            userProjects.push(Projects.get({
              projectId: associatedProject
            }));
          });
          console.log('userProjects:\n', userProjects);
          $scope.userProjects = userProjects;
        }();

    }
  };
});
