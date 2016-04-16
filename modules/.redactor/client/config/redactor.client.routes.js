'use strict';

// Angular Redactor config
angular.module('angular-redactor').config(['$stateProvider',
  function ($stateProvider) {

    $stateProvider.state('redactorEditor', {
      url: '/redactor-editor',
      templateUrl: 'modules/redactor/client/views/editor.html'
    });
  }
]);
