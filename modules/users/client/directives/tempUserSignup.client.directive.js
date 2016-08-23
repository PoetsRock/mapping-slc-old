(function () {
  'use strict';

  angular.module('users')
  .directive('tempUserSignup', tempUserSignup);

  tempUserSignup.$inject = [];

  function tempUserSignup() {
    var directive = {
      restrict: 'EA',
      templateUrl: '/modules/users/client/directives/views/temp-user-signup.html',
      controller: controller
    };

    return directive;

    function controller($scope, $location, $http, $mdDialog, vcRecaptchaService) {

      $scope.hidePassword = true;
      $scope.inputType = 'password';
      $scope.togglePassword = function(newBoolValue) {
        $scope.hidePassword = newBoolValue;
        if(newBoolValue) {
          return $scope.inputType = 'password';
        }
        return $scope.inputType = 'text';
      };





      // $scope.response = null;
      // $scope.widgetId = null;
      $scope.model = { key: '6Lc5LSgTAAAAALp5hz9shNBBLcryJlKS412XRsKk' };

      $scope.setResponse = function (response) {
        $scope.response = response;
      };

      $scope.setWidgetId = function (widgetId) {
        $scope.widgetId = widgetId;
      };

      $scope.cbExpiration = function() {
        console.info('Captcha expired. Resetting response object');
        vcRecaptchaService.reload($scope.widgetId);
        $scope.response = null;
      };

      /** admin fn to update existing User **/
      $scope.createTempUser = function (isValid) {
        // $scope.error = null;
        // if (!isValid) {
        //   $scope.$broadcast('show-errors-check-validity', 'tempUserSignup');
        //   return false;
        // }
        $http.post('/api/v1/admins/recaptcha', { recaptchaResponse: $scope.response })
        .then(function recaptchaSuccess(resolved) {
          console.log('recaptchaSuccess :: `resolved`:\n', resolved);

          return $http.post('/api/v1/auth/signup', $scope.tempUser);

        })
        .then(function createTempUserSuccess(resolved) {
          console.log('resolved:\n', resolved);
          console.log('$location:\n', $location);

          $mdDialog.show(
            $mdDialog.confirm()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .escapeToClose(false)
            .title('Thanks!')
            .htmlContent('<p>Almost done!</p><p>Please check your email to complete the registration.</p>')
            .ariaLabel('Check email to complete registration')
            .ok('Ok')
          )
          .then(function () {
            $location.path('/');
          });

          }, function errorCallback(rejected) {
          console.error('error `rejected`\n', rejected);
            // In case of a failed validation you need to reload the captcha
            // because each response can be checked just once
            vcRecaptchaService.reload($scope.widgetId);

        // })

        // .then(function createTempUser() {
        //   $http.post('/api/v1/auth/signup', $scope.tempUser)
        //   .then(function createTempUserSuccess(resolved) {
        //     console.log('resolved:\n', resolved);
        //     console.log('$location:\n', $location);
        //
        //     $mdDialog.show(
        //       $mdDialog.confirm()
        //       .parent(angular.element(document.querySelector('#popupContainer')))
        //       .clickOutsideToClose(false)
        //       .escapeToClose(false)
        //       .title('Thanks!')
        //       .htmlContent('<p>Almost done!</p><p>Please check your email to complete the registration.</p>')
        //       .ariaLabel('Check email to complete registration')
        //       .ok('Ok')
        //     )
        //     .then(function () {
        //       $location.path('/');
        //     });
        //
        //   }, function createTempUserError(rejected) {
        //
        //   });

        });
      };



    }
  }
}());


