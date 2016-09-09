(function () {
  'use strict';

  angular.module('admins')
  .directive('projectAdminFeatures', projectAdminFeatures);

  projectAdminFeatures.$inject = [];

  function projectAdminFeatures() {
    var directive = {
      restrict: 'EA',
      templateUrl: '/modules/admins/client/directives/views/project-admin-features.html',
      controller: controller
    };
    return directive;

    function controller($scope, $http, getLists) {
      var vm = this;

      $scope.statusSorts = getLists.listStatuses();
      $scope.featuredProjects = getLists.listFeaturedProjects();
      $scope.adminCategorySorts = getLists.listCategories();
      $scope.statusFiltered = $scope.project.status[0].toCapitalCase();

      (function getFeaturedProjs() {
        $http.get('/api/v1/featured', { cache: true })
        .then(function successCallback(resolved) {
          $scope.featuredProjects = resolved.data;
        }, function errorCallback(rejected) {
          return console.log('rejected:\n', rejected);
        });
      })();

      console.log('$scope.statusSorts[0]:\n', $scope.statusSorts[0]);
      console.log('$scope.statusSort[0].status.name:\n', $scope.statusSorts[0].status.name);
      console.log('$scope.statusSort[0].status.value:\n', $scope.statusSorts[0].status.value);
      // console.log('$scope.project.status:\n', $scope.project.status[0].toCapitalCase());


      /**
       *
       * Update Featured Projects
       *
       */
      $scope.updateFeatured = function () {
        $scope.toggleEditFn(0);
        $scope.featuredProjects.pop();
        $scope.featuredProjects.push($scope.project);
        $http.put('api/v1/projects/' + $scope.project._id + '/featured/' + $scope.project.featured, $scope.project)
        .then(function (resolved) {
          console.log('resolved:\n', resolved);
        }, function(rejected) {
          console.error('rejected:\n', rejected);
        });
      };


    }
  }

}());
