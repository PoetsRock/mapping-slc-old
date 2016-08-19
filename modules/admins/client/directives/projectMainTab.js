'use strict';

angular.module('admins').directive('projectMainTab', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/project-main-tab.html',
    controller: function($scope, $http) {



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
        })
      };

    }

  };
});
