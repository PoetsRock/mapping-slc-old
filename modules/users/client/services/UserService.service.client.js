'use strict';

angular.module('users').factory('UserService', ['$http',
  function ($http) {

    return {
      getUser: function getUser(userId) {
        $http.get('/api/v1/users/' + userId, {cache: true})
        .then(function (user) {
          console.log('getUser `user`:\n', user);
          return user;
        });
      },
      updateUser: function(userObject) {
        $http.put('/api/v1/users/' + userObject.userId, userObject)
        .then(function (updatedUser) {
          console.log('getUser.put `updatedUser`:\n', updatedUser);
          return updatedUser;
        });
      },
      patchUser: function(fieldsToUpdate, userId) {
        $http.patch('/api/v1/users/' + userId, fieldsToUpdate)
        .then(function (updatedUser) {
          console.log('getUser.put `updatedUser`:\n', updatedUser);
          return updatedUser;
        });
      },
      deleteUser: function(userId) {
        $http.delete('/api/v1/users/' + userId)
        .then(function (deletedUser) {
          console.log('getUser.put `deletedUser`:\n', deletedUser);
          return deletedUser;
        });
      }


    }
  }
]);
