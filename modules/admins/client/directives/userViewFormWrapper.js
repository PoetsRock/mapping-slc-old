'use strict';

angular.module('admins').directive('userViewFormWrapper', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/user-view-form-wrapper.html',
    controller: function($scope, UserData, $state) {

      $scope.userToEdit = {};

      $scope.userToEditFn = function() {
        if($state.current.name === 'admin.adminEditProject') {
          $scope.userToEdit = UserData.get({
            userId: $scope.project.user._id
          });
        } else {
          $scope.userToEdit = UserData.get({
            userId: $state.params.userId
          });
        }
      }();

    }
  }
});
