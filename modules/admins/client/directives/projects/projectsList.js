(function () {
  'use strict';

  angular.module('admins')
  .directive('projectsList', projectsList);

  projectsList.$inject = [];

  function projectsList() {
    var directive = {
      restrict: 'EA',
      templateUrl: '/modules/admins/client/directives/projects/views/projects-list.html',
      controller: controller
    };
    return directive;

    function controller($scope, Projects) {
      var vm = this;

      vm.$onInit = function () {
        $scope.projects = Projects.query();
      }


    }
  }
}());
