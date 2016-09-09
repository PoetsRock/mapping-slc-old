'use strict';

angular.module('users').controller('UserController', ['$scope', '$state', '$stateParams', 'Authentication', 'UserData', 'Users', 'ProfileImageService', 'Projects', '$http', '$resource', 'Newsletter',
  function ($scope, $state, $stateParams, Authentication, UserData, Users, ProfileImageService, Projects, $http, $resource, Newsletter) {
    $scope.user = Authentication.user;
    $scope.favoriteProjects = $scope.user.favorites;
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
      console.log('user:  ', user);
      if (confirm('Are you sure you want to delete this user?')) {
        if(user) {
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
      console.log('here here!');
      $scope.users = Users.query($scope.query);
    };
    
    // Find existing User
    $scope.findOne = function () {
      $scope.user = UserData.get({
        userId: $stateParams.userId || $scope.user.userId
      });
      //console.log('$scope.users: ', $scope.users);
    };

    
    /**
     * Remove a User's Favorite projects
     */
    $scope.removeFavProject = function (projectId) {
      $scope.$on('$stateChangeStart',
        function (event) {
          event.preventDefault();
          
          var removeItemFromArray = function (item) {
            var updatedFavProjects = $scope.user.favorites.indexOf(item);
            if (updatedFavProjects !== -1) {
              $scope.user.favorites.splice(updatedFavProjects, 1);
            }
          };
          
          $scope.isFavorite = false;
          removeItemFromArray(projectId);
          var updateFavoriteObj = { favorite: projectId, isFavorite: false };
          $http.put('/api/v1/users/' + $scope.user._id + '/favorites', updateFavoriteObj)
          .then(function (resolved, rejected) {
            //console.log('removeFavProject var `resolved.data`::::::\n', resolved.data, '\n\n');
            if (rejected) {
              //console.log('error removing project: var `rejected`\n:', rejected);
            }
          });
        });
    };

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
      $scope.users = Newsletter.query({ email: $scope.subscribe.newsletter });
      
    };
    
    
  }
]);
