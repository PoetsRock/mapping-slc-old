'use strict';

//Setting up route
angular.module('projects').config(['$compileProvider',
  function ($compileProvider, $state) {


    // function checkAuthentication(projectId) {
    //   console.log('here here here here here here here here here here :\n');
    //   $http.get(`/api/v1/projects/${projectId}`)
    //   .then(function (project) {
    //     console.log('project project project project project project:\n', project);
    //     if (project.data.user._id === Authentication.user._id) {
    //       console.log('user::::::::::::::::::::::\n', project.data.user._id);
    //       return Authentication.user;
    //     } else {
    //       console.log('go HOMEEEEEEEEEEEEEEEEEEEEE');
    //       $state.go('home');
    //     }
    //   }, function (err) {
    //     return console.error('err: ', err);
    //   });
    // }

    //turn off debugging for  prod
    // https://docs.angularjs.org/guide/production
    $compileProvider.debugInfoEnabled(false);
  }
]);

//.run(function($rootScope) {
//    angular.element(document).on('click', function(e) {
//      $rootScope.$broadcast('documentClicked', angular.element(e.target));
//    });
//  });





