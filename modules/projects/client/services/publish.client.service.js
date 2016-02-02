'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('publishedProjectsService', ['$resource',
  function ($resource) {
    return $resource('api/v1/projects/published', {
      read: {
        method: 'GET'
      }
    });
  }
]);
