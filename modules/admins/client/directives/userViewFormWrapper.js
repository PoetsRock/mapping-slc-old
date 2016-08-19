'use strict';

angular.module('admins').directive('userViewFormWrapper', function () {
  return {
    restrict: 'E',
    require: '^projectTabs',
    templateUrl: '/modules/admins/client/directives/views/user-view-form-wrapper.html',
    controller: function($scope) {

    },
    link: function(scope, element, attrs, projectTabsCtrl) {

      scope.project = projectTabsCtrl.getProject();

      // projectTabsCtrl.getProject2()
      // .then(function successCallback(resolved) {
      //     scope.project2 = resolved.data;
      //     console.log('scope.project2: ', scope.project2);
      //   },
      //   function errorCallback(rejected) {
      //     console.log('rejected:\n', rejected);
      //   });
    }
  }
});
