'use strict';

angular.module('users').directive('userSubmissionsView', function() {
        return {
          restrict: 'EA',
          templateUrl: 'modules/users/client/directives/views/user-submissions-list.html',
          controller: function($scope, Projects) {

           // Find existing project submissions by UserId
            $scope.findCurrentUserSubmissions = function () {

              var associatedProjects = $scope.user.associatedProjects;
              var userProjects = [];

              var getProjects = function (associatedProjects) {
                associatedProjects.forEach(function (associatedProject) {
                  userProjects.push(Projects.get({
                      projectId: associatedProject
                    })
                  );
                });
                return userProjects;
              };

              $scope.userProjects = $scope.user.projects = getProjects(associatedProjects);

            };
          }
        };
    });
