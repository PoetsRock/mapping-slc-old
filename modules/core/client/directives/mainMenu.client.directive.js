'use strict';

angular.module('core').directive('mainMenu', function (MenuService) {
  return {
    restrict: 'EA',
    templateUrl: 'modules/core/client/directives/views/main-menu.client.view.html',
    
    controller: function ($scope, AdminAuthService) {
      $scope.isAdmin = AdminAuthService.user;
    },
    replace: true,
    link: function (scope, element, attrs) {
    
      scope.itemsMenu = MenuService.itemsMenu;
      scope.showAll = MenuService.open.all;
      scope.showPart = MenuService.open.part;
      scope.showNone = MenuService.open.none;
    
      scope.$on('$stateChangeStart', function (event) {
        MenuService.setShowAll(false);
      });
    
      scope.mouseenter = function () {
        MenuService.setShowPart(true);
      };
    
      scope.mouseleave = function () {
        MenuService.setShowPart(false);
      };
    
      scope.menuHover = function (event) {
        MenuService.setShowAll(true);
        //if(!scope.showAll) {
        scope.toggleOverlayFunction('overlay');
        //}
      };
    
      scope.menuToggle = function (event, close) {
        if (!close && event.target.id !== "triggerMenu" && event.target.className !== 'my-scroller') { return; }
        // event.stopPropagation();
        MenuService.setShowAll(!scope.showAll);
      };
      // scope.menuToggle = function (event) {
      //   if (event.target.id !== "triggerMenu") {
      //     return;
      //   }
      //   event.stopPropagation();
      //   MenuService.setShowAll(!scope.showAll);
      // };
    
      scope.$on('MenuService.update', function (event, open) {
        scope.showAll = open.all;
        scope.showPart = open.part;
        scope.showNone = open.none;
      });
    
    }
  };
});