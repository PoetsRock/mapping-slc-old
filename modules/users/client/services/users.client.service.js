'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('/api/v1/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('users').factory('User', ['$resource', 'AdminAuthService',
  function ($resource, AdminAuthService) {
    if (AdminAuthService.user === 'admin') {
      return $resource('api/v1/user/:userId', { userId: '@_id' }, {
        update: {
          method: 'PUT'
        }
      }, {
        create: {
          method: 'POST'
        }
      }, {
        read: {
          method: 'GET'
        }
      });
    } else {
      return $resource('api/v1/users/:userId', { userId: '@_id' }, {
        update: {
          method: 'GET'
        }
      });
    }
  }
]);

angular.module('users').factory('AdminUpdateUser', ['$resource', 'AdminAuthService',
  function ($resource, AdminAuthService) {
    console.log('$resource::\n', $resource);
    if (AdminAuthService.user === 'admin') {
      return $resource('api/v1/users/:userId', { userId: '@_id' }, {
        update: {
          method: 'PUT'
        }
      });
    } else {
      return 'error - user is not admin'
    }
  }
]);

//TODO this should be Users service
angular.module('users').factory('Newsletter', ['$resource',
  function ($resource) {
    return $resource('api/v1/newsletter', { email: '@email' }, {
      update: {
        method: 'PUT'
      }
    }, {
      create: {
        method: 'POST'
      }
    }, {
      read: {
        method: 'GET'
      }
    });
  }
]);

/**
 angular.module('users.admin').factory('Admin', ['$resource',
 function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
 ]);

 **/
