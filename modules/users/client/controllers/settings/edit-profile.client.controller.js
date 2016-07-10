'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'UserData', '$stateParams', 'Authentication', 'AdminAuthService', 'UtilsService', '$state',
  function ($scope, $http, $location, Users, UserData, $stateParams, Authentication, AdminAuthService, UtilsService, $state) {
    $scope.user = Authentication.user;
    $scope.isAdmin = AdminAuthService;

    // console.log('\n\n$scope.user:\n', $scope.user, '\n\n');

    // Provides logic for the css in the forms
    UtilsService.cssLayout();




    // $scope.userToEditFn = function() {
    //   console.log('here here here');
    //   if($state.current.name === 'admin.adminEditProject') {
    //     $scope.userToEdit = UserData.get({
    //       userId: $scope.project.user._id
    //     });
    //     console.log('here here here   :::::::::  if');
    //     console.log('$scope.project: ', $scope.project);
    //     console.log('$scope.project.user._id: ', $scope.project.user._id);
    //   } else {
    //     $scope.userToEdit = UserData.get({
    //       userId: $state.params.userId
    //     });
    //     console.log('here here here   :::::::::  else');
    //     console.log('$scope.project: ', $scope.project);
    //     console.log('$scope.project.user._id: ', $scope.project.user._id);
    //   }
    // };






    // user fn to update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };


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

    // Find existing User
    $scope.findOne = function (userIdToEdit) {
      // if (userIdToEdit) {
        console.log('here, here  :::: var `userIdToEdit`: ', userIdToEdit);
      //   $scope.userToEdit = UserData.get({
      //     userId: userIdToEdit
      //   });
      // } else {
        $scope.userToEdit = UserData.get({
          userId: $stateParams.userId
        });
      // }
      console.log('$scope.userToEdit:\n', $scope.userToEdit);
    };


  }
]);
