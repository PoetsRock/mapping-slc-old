'use strict';

//Setting up route
angular.module('core').config(['$compileProvider',
  function ($compileProvider) {

    // when `false`, turns off debugging for prod
    // https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(true);
    
  }
]);
// .run(function ($rootScope) {
//   angular.element(document).on('click', function (e) {
//     console.log('event in config `e`:\n', e);
//     $rootScope.menuToggle(e, true);
//     $rootScope.$broadcast('documentClicked', angular.element(e.target));
//   });
//
//   // Collapsing the menu after navigation
//   $rootScope.$on('$stateChangeSuccess', function () {
//     $rootScope.isCollapsed = false;
//   });
//
// });




