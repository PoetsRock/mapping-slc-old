(function () {
  'use strict';

  angular.module('users')
  .directive('userSubmissionsList', userSubmissionsList);

  userSubmissionsList.$inject = [];

  function userSubmissionsList() {
    var directive = {
      restrict: 'EA',
      templateUrl: '/modules/users/client/directives/views/user-submissions-list.html',
      controller: controller
    };
    return directive;

    function controller($scope, $http, getLists) {
      var vm = this;

      var getAssociatedProjects = function (userId) {
        $http.get(`/api/v1/contributors/${userId}/projects?publishedOnly=false`)
        .then(function successCb(projects) {
          $scope.userProjects = projects.data;
        }, function errorCb(errorData) {
          console.error('errorData: ', errorData);
        });
      };
      $scope.subStatuses = getLists.listStatuses();
      vm.$onInit = function () {
        getAssociatedProjects($scope.user._id);
      };
      console.log('$scope.subStatuses:\n', $scope.subStatuses);
      console.log('$scope.subStatuses:\n', $scope.subStatuses[0].status);
    }
  }
}());


