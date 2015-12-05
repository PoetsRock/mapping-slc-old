//'use strict';
//
////Setting up route
//angular.module('projects').run(['$rootScope', '$location', 'Authentication', 'AdminAuthService',
//  function ($rootScope, $location, Authentication, AdminAuthService) {
//    var user = Authentication.user;
//    var isAdmin = AdminAuthService;
//        $rootScope.$on('$routeChangeStart', function (event, next, current) {
//          console.log('event:\n', event, '\n\n');
//          console.log('\n\nnext:\n', next, '\n\n');
//          console.log('\n\ncurrent:\n', current, '\n\n');
//          console.log('\n\nuser:\n', user, '\n\n');
//          console.log('\n\nisAdmin:\n', isAdmin, '\n\n');
//          //Look at the next parameter value to determine if a redirect is needed
//        });
//
//
//  }
//]);
