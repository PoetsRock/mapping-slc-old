'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ApiKeys', '$http', 'MarkerDataService', 'mapService', 'AdminAuthService', '$rootScope', '$location', '$sce', 'UtilsService', 'MenuService',
  function ($scope, Authentication, ApiKeys, $http, MarkerDataService, mapService, AdminAuthService, $rootScope, $location, $sce, UtilsService, MenuService) {

    $scope.authentication = Authentication;
    $scope.isAdmin = AdminAuthService;

    $scope.trustAsHtml = $sce.trustAsHtml;
    // $scope.projectMarker = null;
    // $scope.markerData = null;

    $scope.overlayActive = true;
    $scope.sourceTo = '';
    $scope.sourceFrom = '';
    $scope.menuOpen = false;
    $scope.shadeMap = false;

    // $scope.goToProject = function (id) {
    //   $location.path('projects/' + id);
    // };

    //provides logic for the css in the forms
    UtilsService.cssLayout();

    $scope.toggleOverlayFunction = function (sourceFrom, sourceTo) {
      // console.log('::::::toggleOverlayFunction::::::  sourceFrom\n', sourceFrom, '\nsourceTo:\n', sourceTo, '$scope.overlayActive:\n', $scope.overlayActive);
      $scope.sourceFrom = sourceFrom;
      $scope.sourceTo = sourceTo;
      if ($scope.overlayActive && sourceFrom === 'overlay') {
        console.log('toggle the shade! v1\n', $scope.overlayActive, '\n', sourceFrom);
        $scope.overlayActive = !$scope.overlayActive;
        $scope.shadeMap = true;
      } else if ($scope.overlayActive && sourceFrom === 'menu-closed') {
        console.log('toggle the shade! v2\n', $scope.overlayActive, '\n', sourceFrom);
        $scope.overlayActive = false;
        $scope.menuOpen = true;
        $scope.shadeMap = true;
      } else if (!$scope.overlayActive && sourceFrom === 'menu-closed' && !$scope.menuOpen) {
        console.log('toggle the shade! v3\n', $scope.overlayActive, '\n', sourceFrom);
        $scope.menuOpen = !$scope.menuOpen;
        $scope.shadeMap = false;
        MenuService.setShowAll(false);
        MenuService.setShowPart(false);
      } else if (!$scope.overlayActive && sourceFrom === 'home') {
        console.log('toggle the shade! v4\n', $scope.overlayActive, '\n', sourceFrom);
        $scope.menuOpen = false;
        $scope.overlayActive = true;
        $scope.shadeMap = false;
        MenuService.setShowAll(false);
        MenuService.setShowPart(false);
      }
    };

    /** atrribution toggle */
    $scope.attributionFull = false;
    $scope.attributionText = '<div style="padding: 0 5px 0 2px"><a href="http://www.mapbox.com/about/maps/" target="_blank">Mapbox</a>(the world\'s best maps) & <a href="http://leafletjs.com/" target="_blank">Leaflet</a>, with map data by <a href="http://openstreetmap.org/copyright">OpenStreetMap©</a> | <a href="http://mapbox.com/map-feedback/" class="mapbox-improve-map">Improve this map</a></div>';

    // $scope.markers = true;
    // $scope.filters = true;

    //service that returns public front end keys
    ApiKeys.getApiKeys()
      .then(function (resolved, rejected) {
        mapFunction(resolved.data.MAPBOX_KEY, resolved.data.MAPBOX_SECRET);
      });


    /**
     **  call map and add functionality
     **/
    var mapFunction = function (mapboxKey, mapboxAccessToken) {
      $scope.projectMarkerArray = [];
      L.mapbox.accessToken = mapboxAccessToken;

      //creates a Mapbox map
      var map = L.mapbox.map('map', null, {
        infoControl: false, attributionControl: false,
        legendControl: { position: 'bottomleft' }
      })
      .setView([40.7630772, -111.8689467], 12)
      .addControl(L.control.zoom({ position: 'topright' }));

      L.mapbox.tileLayer('poetsrock.la999il2').addTo(map);

      //todo: overly complicated - refactor the multiple variables below into `var layers`, an array of objects
      // var grayMap = L.mapbox.tileLayer('poetsrock.b06189bb'),
      //     topoMap = L.mapbox.tileLayer('poetsrock.la97f747'),
      //     greenMap = L.mapbox.tileLayer('poetsrock.jdgpalp2'),
      //     landscape = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png'),
      //     comic = L.mapbox.tileLayer('poetsrock.23d30eb5'),
      //     watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png');
      //
      // var layers = [
      //   {
      //     grayMap: {
      //       name: 'Gray Map',
      //       tileLayerId: L.mapbox.tileLayer('poetsrock.b06189bb')
      //     }
      //   },
      //   {
      //     mainMap: {
      //       name: 'Main Map',
      //       tileLayerId: L.mapbox.tileLayer('poetsrock.la999il2')
      //     }
      //   },
      //   { 'Topo Map': topoMap },
      //   {'Green Map': greenMap },
      //   {'Landscape': landscape },
      //   {'Comically Yours': comic },
      //   {'Gray Day': grayMap },
      //   {'Watercolor': watercolor }
      // ];
      // // Add Multiple Tilesets to Map via drop down
      // L.control.layers(layers).addTo(map);

      /** `info` id is part of creating tooltip with absolute position */
      var info = document.getElementById('info');

      /** Map legend */
        /** markup for legend */
      var legend = '<div style="padding: 0 5px 0 2px"><a href="http://www.mapbox.com/about/maps/" target="_blank">Mapbox</a>(the world\'s best maps) & <a href="http://leafletjs.com/" target="_blank">Leaflet</a>, with map data by <a href="http://openstreetmap.org/copyright">OpenStreetMap©</a> | <a href="http://mapbox.com/map-feedback/" class="mapbox-improve-map">Improve this map</a></div>';

      /** toggle for map legend */
      map.getContainer().querySelector('#legend').onclick = function () {
        if (this.className === 'active') {
          map.legendControl.removeLegend(legend);
          this.className = '';
        } else {
          map.legendControl.addLegend(legend);
          this.className = 'active';
        }
        return false;
      };
      
      /** adds event listener for click on main map **/
      map.on('click', function (event) {
        // console.log('map click!::::: `event`\n', event);
        /** if $scope.showAll is true, then main menu is open; MenuService.killClass() removes class "my-open-all", which closes menu  **/
        if ($scope.showAll) {
          MenuService.killClass();
        }
      });

      //todo refactor into directive -- and use it
      // Connect check boxes to ui functions
      function toggleCheckBoxes(control, element) {
      // function toggleCheckBoxes(control, $element) {
        if (element.className === 'active') {
        // if ($element.className === 'active') {
          control.removeFrom(map);
          element.className = '';
          // $element.className = '';
        } else {
          control.addTo(map);
          element.className = 'active';
          // $element.className = 'active';
        }
      }


      //service that returns project markers
      MarkerDataService.getMarkerData()
        .then(function (markerData) {
          $scope.addProjectMarkers(markerData);
        })
        .catch(function (data, status) {
          console.log('Failed to load project markers. Status: ' + status);
        });


      //todo refactor into service
      //todo refactor to be more modular
      /** add markers from marker data */
      $scope.addProjectMarkers = function (markerData) {
        console.log('markerData:\n', markerData);

        $scope.markerData = markerData;
        var index = 0;
        //loop through markers array and return values for each property
        markerData.forEach(function(markerDatum) {
          $scope.projectMarker = L.mapbox.featureLayer({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [markerDatum.lng, markerDatum.lat]
            },
            properties: {
              // customize markers by adding simplestyle properties: https://www.mapbox.com/guides/an-open-platform/#simplestyle
              'marker-size': 'large',
              'marker-color': markerDatum.markerColor,
              'marker-symbol': 'marker-stroked',
              projectId: markerDatum._id,
              summary: markerDatum.storySummary,
              title: markerDatum.title,
              mainImage: markerDatum.mainImage,
              category: markerDatum.category,
              mapImage: markerDatum.mapImage,
              mainImgThumbnail: markerDatum.mainImgThumbnail,
              lat: markerDatum.lat,
              lng: markerDatum.lng,
              published: markerDatum.createdOn,
              leafletId: null,
              arrayIndexId: index
            }
          })
          .on('click', function (event) { //toggle on marker click event that fires event to sidebar for display
              $scope.$apply(function () {
                if (!$scope.overlayActive) { $scope.shadeMap = true; }
                $scope.projectProperties = event.target._geojson.properties;
                $scope.markerId = event.target._leaflet_id;
                $scope.showSidebar($scope.markerId, $scope.projectProperties);
              });
              var popupIndex = 0;
              var popupMenuToggle = function(event) {
                console.log('popupMenuToggle `event`', event);
                if (!$scope.menuOpen && popupIndex !== event.target._leaflet_id) {
                  $scope.toggleOverlayFunction('menu-closed');
                  popupIndex = event.target._leaflet_id;
                // } else if (!$scope.menuOpen && popupIndex === event.target._leaflet_id) {
                } else if ($scope.menuOpen && popupIndex !== event.target._leaflet_id) {
                  popupIndex = event.target._leaflet_id;
                } else if ($scope.menuOpen && popupIndex === event.target._leaflet_id) {
                  popupIndex = 0;
                }
                return popupIndex;
              };
              map.panTo(event.layer.getLatLng()); //	center the map when a project marker is clicked
              popupMenuToggle(event);
              return $scope.projectMarker;
            });
          $scope.projectMarker.addTo(map);
          $scope.projectMarkerArray.push($scope.projectMarker);
        });
        return $scope.projectMarkerArray;
      };


    };



    if (!Array.prototype.findIndex) {
      Array.prototype.findIndex = function(predicate) {
        if (this === null) {
          throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return i;
          }
        }
        return -1;
      };
    }

  }
]);
