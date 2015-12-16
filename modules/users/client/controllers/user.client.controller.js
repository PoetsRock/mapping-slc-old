'use strict';

angular.module('users').controller('UserController', ['$scope', '$state', '$stateParams', 'Authentication', 'UserData', 'Users', 'ProfileImageService', '$http', '$resource', 'Newsletter',
  function ($scope, $state, $stateParams, Authentication, UserData, Users, ProfileImageService, $http, $resource, Newsletter) {
    $scope.user = Authentication.user;
    var favoriteProjects = $scope.user.favorites;
    var associatedProjects = $scope.user.associatedProjects;
    var userProjects = [];
    var userFavorites = [];


    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }
      //probably need to create new User instance before being able to use `user.$update()`
      //also need to better understand `$state.go()`
      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    //delete user
    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    // Find a list of Users
    $scope.find = function () {
      $scope.users = Users.query($scope.query);
      ProfileImageService.getUploadedProfilePic();
    };

    // Find existing User
    $scope.findOne = function () {
      $scope.user = UserData.get({
        userId: $stateParams.userId || $scope.user.userId
      });
      console.log('$scope.users: ', $scope.users);
    };

    ////Find existing project submissions by UserId
    //$scope.findUserFavorites = function () {
    //  $scope.getFavorites = function (favoriteProjects) {
    //    favoriteProjects.forEach(function (favoriteProject) {
    //      userFavorites.push(Projects.get({
    //          projectId: favoriteProject
    //        })
    //      );
    //    });
    //    $scope.userFavorites = userFavorites;
    //    return userFavorites;
    //  };
    //  $scope.getFavorites(favoriteProjects);
    //};

    ////Find existing project submissions by UserId
    //$scope.findCurrentUserSubmissions = function () {
    //  $scope.getProjects = function (associatedProjects) {
    //    associatedProjects.forEach(function (associatedProject) {
    //      userProjects.push(Projects.get({
    //          projectId: associatedProject
    //        })
    //      );
    //    });
    //    $scope.userProjects = userProjects;
    //    return userProjects;
    //  };
    //  $scope.getProjects(associatedProjects);
    //
    //};

    /**
     * newsletter subscription form
     */
    $scope.newsletterSubscription = function (isValid) {
      $scope.error = null;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return;
      }
      // Send email enter from input field to back end
      $scope.users = Newsletter.query({email: $scope.subscribe.newsletter});

    };



    /**
     * Remove User Favorites function
     */

    $scope.removeFavProject = function (projectId) {
      $scope.$on('$stateChangeStart',
        function (event) {
            event.preventDefault();

          console.log('kill that fav!', projectId);
          console.log('kill that fav!', $scope.user);

          $scope.isFavorite = false;
          var updateFavoriteObj = {favorite: projectId, isFavorite: false};
          $http.put('/api/v1/users/' + $scope.user._id, updateFavoriteObj);

          return;

          });

    };


  }
]);
