'use strict';

angular.module('core').directive('mapViewControls', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/core/client/directives/views/map-view-controls.html',
    controller: function($rootScope, $scope) {

      $scope.attributionFull = false;
      $scope.attributionToggle = function() {
        $scope.attributionFull = !$scope.attributionFull;
      };

      $scope.tooltip = {
        delayTooltip: 500
      };

    }
  };
});
