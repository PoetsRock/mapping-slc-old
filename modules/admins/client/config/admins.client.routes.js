'use strict';

//Setting up route
angular.module('admins').config(['$stateProvider',
  function ($stateProvider) {
    // Projects state routing
    $stateProvider.
      state('admin', {
        abstract: true,
        url: '/admin',
        templateUrl: 'modules/admins/client/views/admins.client.view.html',
        //data property is inherited by child states, so you can place something like this authenticate flag in the parent.
        data: {
          authenticate: true,
          templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
          data: {
            roles: ['admin', 'superUser']
          }
        }
      })


    //admin projects routes
      .state('admin.adminProjectsQueue', {
        url: '/projects-queue',
        templateUrl: 'modules/admins/client/views/projects/admin-projects-list.client.view.html'
      })
      .state('admin.adminEditProject', {
        url: '/edit-project/:projectId',
        templateUrl: 'modules/admins/client/views/projects/admin-view-project.client.view.html'
      })


    //admin contact form routes
      .state('admin.adminListMessages', {
        url: '/messages',
        templateUrl: 'modules/admins/client/views/messages/admin-list-messages.client.view.html'
      })
      .state('admin.adminViewMessage', {
        url: '/messages/:contactId',
        templateUrl: 'modules/admins/client/views/messages/admin-view-message.client.view.html'
      })


    //admin user routes
      .state('admin.adminListUsers', {
        url: '/list-users',
        templateUrl: 'modules/admins/client/views/users/admin-list-users.client.view.html'
      })
      .state('admin.adminViewUser', {
        url: '/users/:userId',
        templateUrl: 'modules/admins/client/views/users/admin-view-user.client.view.html'
      }).
      state('adminEditUser', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/admins/client/views/users/admin-edit-user.client.view.html'
      })
      .state('admin.createUser', {
        url: '/create-user',
        templateUrl: 'modules/users/client/views/create-user.client.view.html'
      })
      .state('admin.adminDashboard', {
        url: '/dashboard',
        templateUrl: 'modules/admins/client/views/dashboard/admin-dashboard.client.view.html'
      });
  }

]);
