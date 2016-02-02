'use strict';

angular.module('core').directive('leftMenu', function (MenuService) {
  return {
    restrict: 'EA',
    templateUrl: 'modules/core/client/directives/views/google-left-menu.client.view.html',
    replace: true,
    link: function (scope, elm, attrs) {

      scope.itemsMenu = MenuService.itemsMenu;
      scope.showAll = MenuService.open.all;
      scope.showPart = MenuService.open.part;
      scope.showNone = MenuService.open.none;

      scope.$on('$stateChangeStart',
        function () {
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
      scope.menuToggle = function (event) {
        if (event.target.id !== "triggerMenu") {
          return;
        }
        event.stopPropagation();
        MenuService.setShowAll(!scope.showAll);
      };

      scope.$on('MenuService.update', function (event, open) {
        console.log('MenuService.update... open:\n', open);

        scope.showAll = open.all;
        scope.showPart = open.part;
        scope.showNone = open.none;
      });

    }
  };
});
