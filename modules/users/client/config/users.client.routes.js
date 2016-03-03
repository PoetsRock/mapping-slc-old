'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          authenticate: true,
          roles: ['user', 'registered', 'contributor', 'admin', 'superUser']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html',
        data: {
          pageTitle: 'Settings'
        }
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html',
        data: {
          pageTitle: 'Settings password'
        }
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html',
        data: {
          pageTitle: 'Settings accounts'
        }
      })
      .state('settings.favorites', {
        url: '/favorites',
        templateUrl: 'modules/users/client/views/settings/favorites.client.view.html'
      })
      .state('settings.submissions', {
        url: '/submissions',
        //abstract: true,
        templateUrl: 'modules/users/client/views/settings/submissions-list.client.view.html'
        //templateUrl: 'modules/users/client/directives/views/user-submissions-list.html'
      })
      .state('settings.submissionsView', {
        url: '/:projectId/status/',
        templateUrl: 'modules/users/client/views/settings/submissions-view.client.view.html'
        //templateUrl: 'modules/users/client/directives/views/user-submissions-view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html',
        data: {
          pageTitle: 'Settings picture'
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html',
        data: {
          pageTitle: 'Signup'
        }
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html',
        data: {
          pageTitle: 'Signin'
        }
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html',
        data: {
          pageTitle: 'Password forgot'
        }
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html',
        data: {
          pageTitle: 'Password reset invalid'
        }
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html',
        data: {
          pageTitle: 'Password reset success'
        }
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html',
        data: {
          pageTitle: 'Password reset form'
        }
})
      .state('contributors', {
        url: '/contributors',
        templateUrl: 'modules/users/client/views/contributors/contributors.client.list.html'
      })
      .state('contributor', {
        url: '/contributors/:userId',
        templateUrl: 'modules/users/client/views/contributors/contributors.client.view.html'
      });
  }
]);
