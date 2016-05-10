'use strict';

angular.module('core').service('MarkerDataService', ['$http',
  function ($http, markerData) {
    // Project Marker Data Service

    this.getMarkerData = function () {
      return $http.get('/api/v1/markerData', { cache: true })
        .then(function (projects) {
          return projects.data;
        })
        .catch(function (error) {
          console.log('marker data error: \n', error);
        });
    };

  }
]);
