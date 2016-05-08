'use strict';

//Setting up route
angular.module('editor').config(['$stateProvider',
  function ($stateProvider) {
    // Froala Editor state routing

    $stateProvider.state('textEditor', {
      url: '/editor',
      templateUrl: 'modules/editor/client/views/text-editor.html'
    });

  }

]);
