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

    function controller($scope, $http, $mdDialog, vcRecaptchaService, $state) {

      $scope.tempUser = {};
      $scope.tempUser.firstName = 'Chris';
      $scope.tempUser.lastName = 'Tanseer';
      $scope.tempUser.password = '1!CandleLove1!';
      $scope.tempUser.confirmPassword = '1!CandleLove1!';
      $scope.tempUser.lastName = 'Tanseer';
      $scope.tempUser.email = 'christanseer@gmail.com';

      $scope.hidePassword = true;
      $scope.inputType = 'password';
      $scope.passwordReminder = false;
      $scope.tempUserExists = false;


        // BEGIN functions for reCaptcha verification
      $scope.model = { key: '6Lc5LSgTAAAAALp5hz9shNBBLcryJlKS412XRsKk' };

      $scope.setResponse = function (response) {
        $scope.recaptchaResponse = response;
      };

      $scope.setWidgetId = function (widgetId) {
        $scope.widgetId = widgetId;
      };

      $scope.cbExpiration = function() {
        console.info('Captcha expired. Resetting response object');
        vcRecaptchaService.reload($scope.widgetId);
        $scope.response = null;
      };
      // END functions for reCaptcha verification

      console.log('$scope.tempUser OUTSIDE FN:\n', $scope.tempUser);
      $scope.resendVerificationEmail = function () {
        console.log('$scope.tempUser INSIDE FN:\n', $scope.tempUser);
        console.log('$scope.tempUser._id: ', $scope.tempUser.email);
        $http.post(`/api/v1/auth/signup/tempUsers/emails/${$scope.tempUser.email}/resend`, $scope.tempUser)
        .then(function resendSuccess(resolved) {
          callModal();
        })
        .catch(function resendError(rejected) {
          console.error('ERROR sending verification email:\n', rejected);
          $scope.error = rejected.data;
        });
      };

      $scope.togglePassword = function(newBoolValue) {
        $scope.hidePassword = newBoolValue;
        if(newBoolValue) {
          return $scope.inputType = 'password';
        }
        return $scope.inputType = 'text';
      };

      var emailProvider;
      var emailLink = function(email) {
        emailProvider = {
          name: email.substring(email.indexOf('@') + 1, email.length - 4).toCapitalCase(),
          url: 'http://www.' + email.substring(email.indexOf('@') + 1)
        };
        return emailProvider;
      };

      var callModal = function() {
        emailLink($scope.tempUser.email);
        var modalText = `<h3>Almost done!</h3>` +
          `<p>Please check your email to complete the registration.</p>` +
          `<br />` +
          '<p>Go to <a href="' + emailProvider.url + '" target="_blank">' + emailProvider.name + '</a></p>';
        $mdDialog.show(
          $mdDialog.confirm()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(false)
          .escapeToClose(false)
          .htmlContent(modalText)
          .ariaLabel('Check email to complete registration')
          .ok('Ok')
        )
        .then(function () {
          $state.go('home')
        });
      };


      /** admin fn to update existing User **/
      $scope.createTempUser = function (isValid) {
        $scope.error = null;
        if (!isValid) {
          $scope.$broadcast('show-errors-check-validity', 'tempUserSignup');
          $scope.reCaptchaError = 'Please check the reCAPTCHA box to confirm you\'re one of us';
          return false;
        }
        $http.post('/api/v1/admins/recaptcha', { recaptchaResponse: $scope.response })
        .then(function recaptchaSuccess(resolved) {
          return $http.post('/api/v1/auth/signup', $scope.tempUser);
        })
        .then(function createTempUserSuccess(resolved) {
          callModal();
          // emailLink($scope.tempUser.email);
          // var modalText = `<h3>Almost done!</h3>` +
          //  `<p>Please check your email to complete the registration.</p>` +
          //  `<br />` +
          //  '<p>Go to <a href="' + emailProvider.url + '" target="_blank">' + emailProvider.name + '</a></p>';
          // $mdDialog.show(
          //   $mdDialog.confirm()
          //   .parent(angular.element(document.querySelector('#popupContainer')))
          //   .clickOutsideToClose(false)
          //   .escapeToClose(false)
          //   .htmlContent(modalText)
          //   .ariaLabel('Check email to complete registration')
          //   .ok('Ok')
          // )
          // .then(function () {
          //   $state.go('home')
          // });

          }, function errorCallback(rejected) {
          console.error('error `rejected`\n', rejected);
            $scope.serverError = rejected.data.message;
            if(rejected.data.currentUserExists) {
              $scope.passwordReminder = true;
            } else {
              $scope.tempUserExists = true;
            }
          // In case of a failed validation you need to reload the captcha because each response can be checked just once
            vcRecaptchaService.reload($scope.widgetId);
        });
      };



    }
  }
}());


