// 'use strict';
//
// angular.module('core').directive('submitProjectDirective', function () {
//   return {
//     restrict: 'EA',
//     templateUrl: '/modules/core/client/directives/views/submit-project-directive.html',
//     controller: function($scope) {
//
//       var popupIndex = 0;
//       var popupMenuToggle = function (event) {
//         console.log('popupMenuToggle `event`', event);
//         if (!$scope.menuOpen && popupIndex !== event.target._leaflet_id) {
//           $scope.toggleOverlayFunction('menu-closed');
//           popupIndex = event.target._leaflet_id;
//           // } else if (!$scope.menuOpen && popupIndex === event.target._leaflet_id) {
//         } else if ($scope.menuOpen && popupIndex !== event.target._leaflet_id) {
//           popupIndex = event.target._leaflet_id;
//         } else if ($scope.menuOpen && popupIndex === event.target._leaflet_id) {
//           popupIndex = 0;
//         }
//         return popupIndex;
//       };
//
//     }
//
//   };
// });
