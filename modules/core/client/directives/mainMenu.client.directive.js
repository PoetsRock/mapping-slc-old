'use strict';

angular.module('core').directive('mainMenu', function (MenuService) {
  return {
    restrict: 'EA',
    templateUrl: 'modules/core/client/directives/views/main-menu.client.view.html',
    
    controller: function ($scope, $http, Authentication) {
      $scope.user = Authentication.user;

      $scope.itemsMenu = MenuService.itemsMenu;
      $scope.showAll = MenuService.open.all;
      $scope.showPart = MenuService.open.part;
      $scope.showNone = MenuService.open.none;
    
      $scope.$on('$stateChangeStart', function (event) {
        MenuService.setShowAll(false);
      });
    
      $scope.mouseenter = function () {
        MenuService.setShowPart(true);
      };
    
      $scope.mouseleave = function () {
        MenuService.setShowPart(false);
      };
    
      $scope.menuHover = function (event) {
        MenuService.setShowAll(true);
        $scope.toggleOverlayFunction('overlay');
      };
    
      $scope.menuToggle = function (event, close) {
        if (!close && event.target.id !== "triggerMenu" && event.target.className !== 'my-scroller' && !$scope.overlayActive) {
          return;
        }
        if($scope.overlayActive) {
          $scope.overlayActive = false;
          $scope.shadeMap = true;
          // $scope.toggleOverlayFunction(sourceFrom, sourceTo);
        }
        MenuService.setShowAll(!$scope.showAll);
      };
      
      
      $scope.$on('MenuService.update', function (event, open) {
        $scope.showAll = open.all;
        $scope.showPart = open.part;
        $scope.showNone = open.none;
      });

      // $scope.signOut = function() {
      //   $http.get('/api/v1/auth/signout');
      // }

    }
  };
});
