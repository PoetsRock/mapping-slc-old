'use strict';

angular.module('core').controller('ModalController', ['$scope', '$uibModalInstance', 'items',
  function($scope, $uibModalInstance, items) {
    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0],
      toStateUrl: items.toStateUrl
    };
    //console.log('$scope.selected', $scope.selected);


    if ($scope.selected.item) {
      //console.log('$scope.selected.item', $scope.selected.item);
      $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
      };
    } else {
      //console.log('$scope.selected.toStateName', $scope.selected.toStateUrl);
      $scope.ok = function () {
        $uibModalInstance.close($scope.selected.toStateUrl);
      };
    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('user cancelled modal');
    };
  }
]);
