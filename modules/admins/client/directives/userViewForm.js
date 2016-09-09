'use strict';

angular.module('admins').directive('userViewForm', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/user-view-form.html',
    controller: function($scope, $http, $state, getLists, Authentication) {
      if(!$scope.userToEdit && $scope.user) {
        $scope.userToEdit = $scope.user;
      }

      // user fn to update a user profile
      $scope.updateUserProfile = function () {
        console.log('here!!');
        console.log('$state:\n', $state);
        console.log('$state.params:\n', $state.params);

        $http.put('/api/v1/users/' + $scope.userToEdit._id, $scope.userToEdit)
        .then(function (response) {
          console.log('user update success `response`:\n', response);
          Authentication.user = response;
        }, function errorCb(err) {
          console.error('user update error `err`:\n', err);
          $scope.error = err.data.message;
        });
      };

      $scope.isAdminPanel = $state.current.name.startsWith('admin');
      $scope.states = getLists.listStates();
      $scope.roles = getLists.listRoles();

    }
  };
});
