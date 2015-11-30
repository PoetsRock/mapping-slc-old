'use strict';

//Setting up route
angular.module('projects').config(['$stateProvider',
  function ($stateProvider) {
    // Projects state routing
    $stateProvider.
    state('listProjects', {
      url: '/projects',
      templateUrl: 'modules/projects/client/views/list-projects.client.view.html'
    }).
    state('createProject', {
      url: '/projects/create',
      templateUrl: 'modules/projects/client/views/create-project.client.view.html'
    }).
    state('viewProject', {
      url: '/projects/:projectId',
      templateUrl: 'modules/projects/client/views/view-project.client.view.html'
    }).
    state('editProject', {
      url: '/projects/:projectId/edit',
      templateUrl: 'modules/projects/client/views/edit-project.client.view.html',
      data: {
        authenticate: true,
        roles: ['contributor', 'admin', 'superUser']
      }
    }).
    state('confirmCreateProject', {
      url: '/projects/:projectId/status',
      //data: {
      //  authenticate: true,
      //  roles: ['contributor', 'admin', 'superUser']
      //}
      templateUrl: 'modules/projects/client/views/project-for-submission.client.view.html'
    });
  }
]);
