'use strict';

//Setting up route
angular.module('projects').config(['$compileProvider',
      function ($compileProvider) {

        //turn off debugging for  prod
        // https://docs.angularjs.org/guide/production
        $compileProvider.debugInfoEnabled(false);
  }
]);

//.run(function($rootScope) {
//    angular.element(document).on('click', function(e) {
//      $rootScope.$broadcast('documentClicked', angular.element(e.target));
//    });
//  });





