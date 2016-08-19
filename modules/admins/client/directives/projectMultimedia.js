'use strict';

angular.module('admins').directive('projectMultimedia', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/project-multimedia.html',
    controller: function ($scope) {

      $scope.slides = [
        {
          image: 'http://lorempixel.com/600/400/',
          text: 'I am some words, a story even.'
        },
        {
          image: 'http://lorempixel.com/600/400/',
          text: 'A story even.'
        },
        {
          image: 'http://lorempixel.com/600/400/',
          text: 'Story time!'
        },
        {
          image: 'http://lorempixel.com/600/400/',
          text: 'Talk to me!'
        }

      ];
    }
  };
});
