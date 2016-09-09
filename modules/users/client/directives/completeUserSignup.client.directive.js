(function () {
  'use strict';

  angular.module('users')
  .directive('completeUserSignup', completeUserSignup);

  completeUserSignup.$inject = ['listStates'];

  function completeUserSignup() {
    var directive = {
      restrict: 'EA',
      templateUrl: '/modules/users/client/directives/views/complete-user-signup.html',
      controller: controller
    };

    return directive;

    function controller($scope, $http, $state, listStates) {
      $scope.states = listStates;

      this.$onInit = function() {
        $http.get('/api/v1/tempUser/' + $state.params.tempUserId)
        .then(function getTempUserCb(response) {
          $scope.credentials = response.data;
          $scope.credentials.newsletter = 'Yes';
        })
        .catch(function getTempUserError(err) {
          console.error('error getting temp user:\n', err);
        });
      };


      $scope.completeSignup = function(isValid) {
        $scope.error = null;
        if (!isValid) {
          console.error('NOPE NOT VAILD', isValid);
          $scope.$broadcast('show-errors-check-validity', 'userForm');
          return false;
        }
        $http.post('/api/v1/auth/signup/verify', $scope.credentials)
        .then(function createUserCb(createUserResponse) {
          // If successful, assign response to global user model
          $scope.user = $scope.authentication.user = createUserResponse.data;
          $state.go('settings.accounts');
        }, function createUserError(err) {
          console.error('error creating new user:\n', err);
          $scope.error = err.message;
        });
      };

    }
  }
}());
