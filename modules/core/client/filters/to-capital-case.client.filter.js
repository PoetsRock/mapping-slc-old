(function () {
  'use strict';

  angular
    .module('core')
    .filter('toCapitalCase', toCapitalCase);

  toCapitalCase.$inject = [/*Example: '$state', '$window' */];

  function toCapitalCase(/*Example: $state, $window */) {
    return function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
      // return 'toCapitalCase filter: ' + input;
    };
  }
})();
