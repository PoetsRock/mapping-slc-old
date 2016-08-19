(function () {
  'use strict';

  angular.module('users')
  .directive('completeUserSignup', completeUserSignup);

  completeUserSignup.$inject = [];

  function completeUserSignup() {
    var directive = {
      restrict: 'EA',
      templateUrl: '/modules/users/client/directives/views/complete-user-signup.html',
      controller: controller
    };

    return directive;

    function controller($scope, $http) {

      $scope.testUserSignupEmail = function () {
        var emailOptions = {};
        $http.get('/api/v1/emails/html-email.html', emailOptions)
        .then(function (response) {
          console.log('email response:\n', response);
          // do something with data
        })
        .catch(function (err) {
          console.log('email err:\n', err);
        });
      };
    }
  }
}());


