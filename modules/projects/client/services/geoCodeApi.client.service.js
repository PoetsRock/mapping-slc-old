'use strict';

angular.module('projects').service('GeoCodeApi', ['$http',
  function ($http) {

    // Geocodeapi service logic

    this.callGeoCodeApi = function (project, keys, projectSaveCallback) {
      console.log('keys::::::::\n', keys);
      console.log('keys.data.::::::::\n', keys.data);
      console.log('data.HERE_KEY::::::::\n', keys.data.HERE_KEY);
      console.log('data.HERE_SECRET::::::::\n', keys.data.HERE_SECRET);
      var hereKey = keys.data.HERE_KEY;
      var hereSecret = keys.data.HERE_SECRET;

      if (!project || !project.state || !project.city || !project.zip || !project.street || !hereKey || !hereSecret) {
        projectSaveCallback();
        console.log('err, there\'s an error, yo.');
        return;
      }

      return $http.get('http://geocoder.cit.api.here.com/6.2/geocode.json' +
          '?state=' + project.state +
          '&city=' + project.city +
          '&postalcode=' + project.zip +
          '&street=' + project.street +
          '&gen=8' +
          '&app_id=' + hereKey +
          '&app_code=' + hereSecret)
        .success(function (geoData) {
          project.lat = geoData.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
          project.lng = geoData.Response.View[0].Result[0].Location.DisplayPosition.Longitude;

        }).error(function (data, status) {
          console.log('geocode error:\n', data, 'status:\n', status);
          //TODO: handle this gracefully
        });

    };
  }
]);
