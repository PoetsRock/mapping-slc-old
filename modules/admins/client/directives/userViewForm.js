'use strict';

angular.module('admins').directive('userViewForm', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/user-view-form.html',
    controller: function($scope, $state) {
      
      $scope.isAdminPanel = $state.current.name.startsWith('admin');
      
      $scope.user.userState = 'UT';
      $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
      'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
      'WY').split(' ').map(function(state) { return { abbrev: state }; });
  
      $scope.roles = ['user', 'blocked', 'unregistered', 'registered', 'contributor', 'admin', 'superUser'].map(function(role) { return { role: role }; });
    
    }
  };
});
