'use strict';

// Controller that serves a random static map for secondary views
angular.module('core').controller('RandomMapController', ['$scope', 'RandomMapService',
  function ($scope, RandomMapService) {

    $scope.staticMap = RandomMapService.getRandomMap();
    $scope.myFunction = function () {
      console.log('error loading that map!');
    };

  }
]);

