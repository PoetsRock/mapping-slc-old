'use strict';

angular.module('projects').service('getUserFavorites', ['$scope', '$http',
  function ($scope, $http) {
      this.getUserFavoriteStories = function (userFavoriteProjects, projectId) {
        userFavoriteProjects.forEach(function (userFavoriteProject) {
          if (userFavoriteProject === projectId) {
            $scope.isFavorite = true;
          }
        });
      };
      this.toggleFavProject = function () {
        $scope.isFavorite = !$scope.isFavorite;

        var updateFavoriteObj = {favorite: $scope.project.id, isFavorite: true};
        if (!$scope.isFavorite) {
          updateFavoriteObj.isFavorite = false;
        }
        $http.put('/api/v1/users/' + $scope.user._id, updateFavoriteObj)
      };
  }
]);
