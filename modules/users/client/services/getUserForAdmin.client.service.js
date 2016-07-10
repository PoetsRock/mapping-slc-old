'use strict';

angular.module('users').factory('getUserForAdmin', ['$state', 'UserData',
  function ($state, UserData) {
    return function (project) {
      console.log('$state:\n', $state);
      console.log('project:\n', project);
      if ($state.current.name === 'admin.adminEditProject') {
        console.log('project.user._id:\n', project.user._id);
        console.log('$state.current.name: ', $state.current.name);
        return UserData.get({
          userId: project.user._id
        });
      } else {
        console.log('$state.params.userId: ', $state.params.userId);
        return UserData.get({
          userId: $state.params.userId
        });
      }
    };
  }
]);