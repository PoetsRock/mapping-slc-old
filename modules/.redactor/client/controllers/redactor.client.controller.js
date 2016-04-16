'use strict';

//Angular Redactor controller
angular.module('angular-redactor').controller('RedactorController', ['$scope', '$stateParams', 'Authentication', '$http', 'AdminAuthService',
  function ($scope, $stateParams, Authentication, $http, AdminAuthService) {

    $scope.authentication = Authentication;
    $scope.isAdmin = AdminAuthService;
    
    $scope.redactorOptions = {

    };

    $scope.changeContent = function () {
      $scope.project = {
        story: '<h1>Some bogus content</h1>',
        file: {}
      };
    };

    $scope.project = {
      story: '<p>This is my awesome content</p>',
      file: {}
    };



  }
]);
