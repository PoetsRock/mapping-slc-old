'use strict';

//Google Places API

angular.module('core').service('googlePlacesService', ['$scope', '$http',
  function ($scope, $http) {
    var googlePlacesMarker = null;
    // var googlePlacesMarkerLayer = null;
    var googlePlacesMarkerArray = [];
    $scope.googlePlacesLayer = false;

    this.googlePlacesData = function () {
      $http.get('/places').success(function (poiData) {
        var placeLength = poiData.results.length;
        for (var place = 0; place < placeLength; place++) {
          var mapLat = poiData.results[place].geometry.location.lat;
          var mapLng = poiData.results[place].geometry.location.lng;
          var mapTitle = poiData.results[place].name;
          googlePlacesMarker = L.marker([mapLat, mapLng]).toGeoJSON();
          googlePlacesMarkerArray.push(googlePlacesMarker);
        }

        $scope.googlePlacesMarkerLayer = L.geoJson(googlePlacesMarkerArray, {
          style: function (feature) {
            return {
              'title': mapTitle,
              'marker-size': 'large',
              'marker-symbol': 'marker',
              'marker-color': '#00295A',
              'riseOnHover': true,
              'riseOffset': 250,
              'opacity': 0.5,
              'clickable': true
            }
          }
        });


        //style the polygon tracts
        var style = {
          'stroke': true,
          'clickable': true,
          'color': '#00D',
          'fillColor': '#00D',
          'weight': 1.0,
          'opacity': 0.2,
          'fillOpacity': 0.0,
          'className': ''  //String that sets custom class name on an element
        };
        var hoverStyle = {
          'color': '#00D',
          'fillOpacity': 0.5,
          'weight': 1.0,
          'opacity': 0.2,
          'className': ''  //String that sets custom class name on an element
        };

        var hoverOffset = new L.Point(30, -16);


      });
    };


  }
]);
