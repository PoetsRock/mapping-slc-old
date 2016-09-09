(function () {
  'use strict';

  angular.module('users')
  .directive('userFavorites', userFavorites);

  userFavorites.$inject = [];

  function userFavorites() {
    var directive = {
      restrict: 'EA',
      templateUrl: '/modules/users/client/directives/settings/views/user-favorites.html',
      controller: controller
    };

    return directive;

    function controller($scope, $http, Authentication) {

      this.$onInit = function () {
        /** Get User's favorite projects */
        $http.get('/api/v1/users/' + $scope.user._id + '/favorites', { cache: true })
        .then(function (resolved) {
          $scope.userFavorites = resolved.data;
          $scope.userFavorites.map(function (project) {
            project.favoriteData = {
              btn: 'favorite',
              isFavorited: true,
              tooltip: 'Remove from List of Favorite Projects'
            };
          }, function (rejected) {
            console.log('rejected:\n', rejected);
          });
        });

      };


      $scope.toggleFavProject = function (projectId) {

        // console.log('userFavorite._id:\n', userFavorite._id);
        // console.log('$scope.userFavorites:\n', $scope.userFavorites);

        var project = $scope.userFavorites.find(function (currentProject, index) {
          if(currentProject._id === projectId) {
            currentProject.index = index;
            // console.log(`currentProject:\n, ${currentProject} at index #${index}`);
            return currentProject;
          }
        });

        // console.log('$scope.userFavorites:\n', $scope.userFavorites);
        // console.log('project:\n', project);

        if (project.favoriteData.isFavorited) {
          project.favoriteData.btn = 'favorite_border';
          project.favoriteData.isFavorited = false;
          project.favoriteData.tooltip = 'Add to Favorites Projects';
          var projSpliceIndex = project.userIdFavoritesList.findIndex(function (userId) {
            return userId === Authentication.user._id;
          });
          var userSpliceIndex = Authentication.user.favorites.findIndex(function (currentProjId) {
            return currentProjId === projectId;
          });
          project.userIdFavoritesList.splice(projSpliceIndex, 1);
          Authentication.user.favorites.splice(userSpliceIndex, 1);
        } else if (!project.favoriteData.isFavorited) {
          project.favoriteData.btn = 'favorite';
          project.favoriteData.isFavorited = true;
          project.favoriteData.tooltip = 'Remove from List of Favorite Projects';
          Authentication.user.favorites.push(project._id);
          project.userIdFavoritesList.push(Authentication.user._id);
        }
        $scope.userFavorites.splice(project.index, 1, project);


        // $http.patch('/api/v1/users/' + Authentication.user._id, {favorites: Authentication.user.favorites});
        // $http.patch('/api/v1/projects/' + projectId, {userIdFavoritesList: project.userIdFavoritesList});
      };



    }
  }
}());
