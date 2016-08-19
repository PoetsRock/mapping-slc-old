'use strict';

angular.module('users').filter('submissionStatusFilter', ['', function() {
  return function(userProjects, status) {
    userProjects.filter(function(userProject) {
      console.log('here !!  !!  !! ');
      return userProject.status[0] === status;
    });
  }
}]);
