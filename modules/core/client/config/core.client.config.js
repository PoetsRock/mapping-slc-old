'use strict';

//Setting up route
angular.module('core').config(['$compileProvider', 'localStorageServiceProvider',
  function ($compileProvider, localStorageServiceProvider) {

    // when `false`, turns off debugging for prod
    // https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(true);

    localStorageServiceProvider.setPrefix('mslc');

  }
]);
// .run(function($rootScope) {
//  angular.element(document).on('click', function(e) {
//    $rootScope.$broadcast('documentClicked', angular.element(e.target));
//  });
//
//  // Collapsing the menu after navigation
//  $scope.$on('$stateChangeSuccess', function () {
//    $scope.isCollapsed = false;
//  });
//
// });




