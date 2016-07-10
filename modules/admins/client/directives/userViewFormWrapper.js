'use strict';

angular.module('admins').directive('userViewFormWrapper', function (getUserForAdmin) {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/user-view-form-wrapper.html',
    controller: function($scope) {
  
      $scope.userToEdit = getUserForAdmin();
      console.log('$scope.userToEdit:\n', $scope.userToEdit);
    }
  }
});
