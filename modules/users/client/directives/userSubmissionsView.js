'use strict';

angular.module('users').directive('userSubmissionsView', function () {
  return {
    restrict: 'EA',
    templateUrl: 'modules/users/client/directives/views/user-submissions-view.html',
    controller: function ($scope) {

      // $scope.initSubmissionStatus = function () {
      //   $scope.findOne();
      // };

    }
  };
});
