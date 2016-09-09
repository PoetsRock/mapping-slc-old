/**
 *
 *  Update an existing Project
 *
 */

(function() {
  'use strict';

angular
  .module('projects')
  .factory('updateProjectService', updateProjectService);

updateProjectService.$inject = ['$resource'];

  function updateProjectService(toggleId, project) {
    return project.$update(function (response) {
      console.log('return from $scope.updateProject() `response`', response);
      if (response.$resolved) {
        if ($location.path() === '/admin/edit-project/' + project._id) {
          $location.path('/admin/edit-project/' + project._id);
          $scope.toggleEditFn(0);
        } else {
          $location.path('projects/' + project._id);
          $scope.toggleEditFn(0);
        }
        // todo refactor to use ng-message
        notify({
          message: 'Project updated successfully',
          classes: 'ng-notify-contact-success'
        })
      } else {
        notify({
          message: 'Something went wrong, and we didn\'t receive your message. We apologize.',
          classes: 'ng-notify-contact-failure'
        })
      }
    }, function (errorResponse) {
      $scope.error = errorResponse.data.message;
    });
  }

}());

