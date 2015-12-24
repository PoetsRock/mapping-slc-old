'use strict';

//Setting up route
angular.module('admins').config(['$compileProvider',
  function ($compileProvider) {

    // when `false`, turns off debugging for prod
    // https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(false);
  }
])

.run(function($rootScope, $state, Authentication) {
  var $currentUser = Authentication.user;
  $rootScope.$on('$stateChangeStart', function(e, to) {
    if (!angular.isFunction(to.data)) return;
    var result = to.data($currentUser);

    if (result && result.to) {
      e.preventDefault();
      // Optionally set option.notify to false if you don't want
      // to retrigger another $stateChangeStart event
      $state.go(result.to, result.params, {notify: false});
    }
  });
});
