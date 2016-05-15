'use strict';

angular.module('admins').directive('wysiwygContentPreview', function () {
  return {
    restrict: 'EA',
    require: '?ngModel',
    scope: false,
    templateUrl: '/modules/admins/client/directives/views/wysiwyg-content-preview.html',
    controller: function ($scope) {

      console.log('$scope.showWysiwyg', $scope.showWysiwyg);

    }
  };
});
