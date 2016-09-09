'use strict';

//Setting up route
// angular.module('core').config(['$compileProvider', 'localStorageServiceProvider',
//   function ($compileProvider, localStorageServiceProvider) {

angular.module('core').config(['$compileProvider',
  function ($compileProvider) {

    // when `false`, turns off debugging for prod
    // https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(true);

     String.prototype.toCapitalCase = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };
    
  }
]);
