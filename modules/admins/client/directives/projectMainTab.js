'use strict';

angular.module('admins').directive('projectMainTab', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/project-main-tab.html',
    controller: function($scope, $http) {

      $scope.sendTestHtmlEmail = function() {
        console.log('email here here here:');
        // var emailOptions = {};
        var emailFileName = 'html.ejs';
        $http.get('/api/v1/emails/auth/signup/' + emailFileName + '?verify=true')
        .then(function(response) {
          console.log('new user email response:\n', response);
          // do something with data
        })
        .catch(function(err) {
          console.log('email err:\n', err);
        });
      };

      $scope.sendTestEmail = function() {
        console.log('email here here here:');
        var emailOptions = {};
        $http.put('/api/v1/emails/email/test', emailOptions)
        .then(function(response) {
          console.log('email response:\n', response);
          // do something with data
        })
        .catch(function(err) {
          console.log('email err:\n', err);
        });
      };

    }

  };
});
