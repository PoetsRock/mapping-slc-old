'use strict';

angular.module('admins').directive('userViewFormWrapper', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/user-view-form-wrapper.html',
    // $scope: false,
    // controller: function($scope, UserData, $state) {
      // $scope.userToEditFn = function() {
      //   if($state.current.name === 'admin.adminEditProject') {
      //     console.log('$scope.project: ', $scope.project);
      //     console.log('$scope.project.user._id: ', $scope.project.user._id);
      //     $scope.userToEdit = UserData.get({
      //       userId: $scope.project.user._id
      //     });
      //   } else {
      //     $scope.userToEdit = UserData.get({
      //       userId: $state.params.userId
      //     });
      //   }
      // };
    // }
  }
});
