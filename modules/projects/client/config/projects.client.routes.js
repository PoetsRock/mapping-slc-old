'use strict';

//Setting up route
angular.module('projects').config(['$stateProvider',
  function ($stateProvider) {

    // Projects state routing
    $stateProvider.state('listProjects', {
      url: '/projects',
      templateUrl: 'modules/projects/client/views/list-projects.client.view.html'
    })
    .state('createProject', {
      url: '/projects/create',
      templateUrl: 'modules/projects/client/views/create-project.client.view.html',
      loginRequired: true
    })
    .state('viewProject', {
      url: '/projects/:projectId',
      templateUrl: 'modules/projects/client/views/view-project.client.view.html'
    })
    .state('viewProjectPreview', {
      url: '/projects/:projectId/preview',
      templateUrl: 'modules/projects/client/views/view-project.client.view.html'
      //templateUrl: 'modules/projects/client/views/view-project-preview.client.view.html'
    })
    .state('editProject', {
      url: '/projects/:projectId/edit',
      templateUrl: 'modules/projects/client/views/edit-project.client.view.html',
      data: {
        authenticate: true,
        roles: ['contributor', 'admin', 'superUser']
      }
    })
    .state('projectStatus', {
      url: '/projects/:projectId/status',
      data: {
        pageTitle: 'Submission Status',
        authenticate: true,
        //  roles: ['contributor', 'admin', 'superUser'],
      },
      resolve: {
        authenticatedUser: function checkAuthentication($stateParams, $http, Authentication, $state) {
          return $http.get(`api/v1/projects/${$stateParams.projectId}`)
          .then(function(project) {
            if (project.data.user._id === Authentication.user._id) {
              return Authentication.user;
            } else {
              $state.go('home');
            }
          }, function (err) {
            return console.error('err: ', err);
          });
        }
      },
      templateUrl: 'modules/projects/client/views/project-for-submission.client.view.html'
    })
    .state('blank', {
      url: '/blank',
      templateUrl: 'modules/projects/client/views/blank.html'
    });
  }
]);
