'use strict';

angular.module('users').controller('ProfilePictureController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    
    $scope.user = Authentication.user;

  }
]);
