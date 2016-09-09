(function () {
  'use strict';

  angular.module('projects')
  .config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    var localStorage = 'localStorage';
    var sessionStorage = 'sessionStorage';

    localStorageServiceProvider
    .setPrefix('mslc')
    .setStorageType(localStorage)
    .setNotify(true, true);
  }])
  .directive('listProjects', listProjects);

  listProjects.$inject = [];

  function listProjects() {
    var directive = {
      restrict: 'EA',
      templateUrl: '/modules/projects/client/directives/views/list-projects.html',
      controller: controller
    };

    return directive;

    function controller($scope, $http, Authentication, localStorageService) {
      var ts0 = window.performance.now();

      this.$onInit = function () {

        $http.get('/api/v1/projects/published', {cache: true}) // get list of published projects
        .then(function (publishedProjects) {
          $scope.publishedProjects = publishedProjects.data;
          $scope.publishedProjects.map(function (project, index) {
            project.favoriteData = {
              btn: 'favorite_border',
              isFavorited: false,
              tooltip: 'Add to Favorite Projects'
            };
            project.bookmarkData = {
              btn: 'bookmark_outline',
              isBookmarked: false,
              tooltip: 'Add to bookmarks to view later'
            };
            project.userIdFavoritesList.forEach(function (userId) {
              if (userId === Authentication.user._id) {
                project.favoriteData = {
                  btn: 'favorite',
                  isFavorited: true,
                  tooltip: 'Remove from List of Favorite Projects'
                };
              }
            });
            project.userIdBookmarkedList.forEach(function (userId) {
              if (userId === Authentication.user._id) {
                project.bookmarkData = {
                  btn: 'bookmark',
                  isBookmarked: true,
                  tooltip: 'Remove bookmark'
                };
              }
            });
            $scope.publishedProjects.splice(index, 1, project);
          });
        }, function (err) {
          console.error('list-projects error:\n', err);
        });
      };

      // $scope.toggleBookmarkProject = function () {
      //
      // };

      $scope.toggleFavProject = function (projectId) {
        var project = $scope.publishedProjects.find(function (currentProject, index) {
          if(currentProject._id === projectId) {
            currentProject.index = index;
            return currentProject;
          }
        });
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
        $scope.publishedProjects.splice(project.index, 1, project);
        $http.patch('/api/v1/users/' + Authentication.user._id, {favorites: Authentication.user.favorites});
        $http.patch('/api/v1/projects/' + projectId, {userIdFavoritesList: project.userIdFavoritesList});
      };


      var ts1 = window.performance.now();
      var count = function () {
        if (!localStorageService.get('count')) {
          return 0;
        }
        else {
          return localStorageService.get('count');
        }
      }();

      function setTime() {
        localStorageService.set(`testDur[${localStorageService.get('count')}]`, ts1 - ts0);
        count += localStorageService.get('count');
        localStorageService.set(`count`, count);
      }

      setTime();

    }
  }
}());
