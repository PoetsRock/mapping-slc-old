'use strict';

angular.module('core').controller('ModalController', ['$scope', '$uibModalInstance', 'items',
    function($scope, $uibModalInstance, items) {
        $scope.items = items;
        $scope.selected = {
          item: $scope.items[0],
          toStateName: items.toStateName
        };
      if ($scope.selected.item) {
        $scope.ok = function () {
          $uibModalInstance.close($scope.selected.item);
        };
      } else {
        $scope.ok = function () {
          $uibModalInstance.close($scope.selected.toStateName);
        };
      }

      $scope.cancel = function () {
          $uibModalInstance.dismiss('user cancelled modal');
      };
    }
]);
