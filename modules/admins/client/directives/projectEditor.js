'use strict';

angular.module('admins').directive('projectEditor', function () {
  return {
    restrict: 'EA',
    templateUrl: '/modules/admins/client/directives/views/project-editor.html',
    controller: function ($scope, $http, $location) {

      /**
       *
       *  Update an existing Project
       *
       */
      $scope.updateProjStory = function () {
        if ($scope.user.roles[0] !== 'admin' && $scope.user._id !== $scope.project.user._id) {
          //message
          return;
        }

        $http.put(`/api/v1/projects/${$scope.project._id}`, $scope.project)
        .then(function projectUpdateSuccess(updatedProject) {
          if ($location.path() === '/admin/edit-project/' + $scope.project) {
            $location.path('/admin/edit-project/' + $scope.project);
            $scope.toggleEditFn(0);
          } else if ($location.path() === `/projects/${$scope.project._id}/status`) {
            $location.path(`settings/submissions`);
          } else {
            $location.path('projects/' + $scope.project);
            $scope.toggleEditFn(0);
          }
          // todo refactor to use ng-message
          //   notify({
          //     message: 'Project updated successfully',
          //     classes: 'ng-notify-contact-success'
          //   })
          // } else {
          //   notify({
          //     message: 'Something went wrong, and we didn\'t receive your message. We apologize.',
          //     classes: 'ng-notify-contact-failure'
          //   })

        }, function projectUpdateError(err) {
          $scope.error = err.data.message;
        });

      }
    }
  }
});
