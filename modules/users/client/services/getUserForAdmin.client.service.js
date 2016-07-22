'use strict';

angular.module('users').factory('getUserForAdmin', ['$state', 'UserData',
  function ($state, UserData) {
    return function (userId) {

      if ($state.current.name === 'admin.adminEditProject') {
        return UserData.get({
          userId: userId
        });
      }

      return UserData.get({
        userId: $state.params.userId
      });
    };
  }
]);