'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'UserData', '$stateParams', 'Authentication', 'AdminAuthService', 'UtilsService', '$state',
  function ($scope, $http, $location, Users, UserData, $stateParams, Authentication, AdminAuthService, UtilsService) {
    $scope.user = Authentication.user;
    $scope.isAdmin = AdminAuthService;

    console.log('EditProfile Ctrl ::  $scope.user:\n', $scope.user);

    // Provides logic for the css in the forms
    UtilsService.cssLayout();


    // admin fn to update existing User
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userAdminForm');
        return false;
      }
      var userToEdit = $scope.userToEdit;
      userToEdit.$update(function () {
        $location.path('users/' + user._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };


    //runs a query to return user ID for admin panel editing
    $scope.find = function () {
      $scope.users = Users.query();
    };

    // Find a list of Users
    $scope.findAll = function () {
      $scope.users = Users.query($scope.query);
    };


  }
]);
