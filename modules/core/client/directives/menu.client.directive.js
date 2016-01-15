'use strict';

angular.module('core').directive('leftMenu', function (MenuService) {
    return {
      restrict: 'EA',
      templateUrl: "modules/core/client/directives/views/google-left-menu.client.view.html",
      replace: true,
      link: function (scope, elm, attrs) {
        scope.itemsMenu = MenuService.itemsMenu;
        scope.showAll = MenuService.open.all;
        scope.showPart = MenuService.open.part;
        scope.showNone = MenuService.open.none;

        //console.log('scope.showNone:\n', MenuService.open.none);
        //console.log('scope.showNone:\n', scope.showNone);

        //console.log('scope.showNone:\n', MenuService.open.none);
        //console.log('scope.showNone:\n', scope.showNone);

        scope.mouseenter = function () {
          MenuService.setShowPart(true);
        };

        scope.mouseleave = function () {
          MenuService.setShowPart(false);
        };

        scope.menuHover = function (event) {
          MenuService.setShowAll(true);
          scope.toggleOverlayFunction('overlay');
        };
        scope.menuToggle = function (event) {
          if (event.target.id !== "triggerMenu") {
            console.log('menuToggle inside `if`');
            return;
          }
          //console.log('menuToggle... event:\n', event);
          event.stopPropagation();
          MenuService.setShowAll(!scope.showAll);
        };

        scope.$on('MenuService.update', function (event, open) {
          //console.log('MenuService.update... open:\n', open);
          //console.log('MenuService.open.all:\n', MenuService.open.all);
          //console.log('scope.showAll:\n', scope.showAll);

          //console.log('MenuService.open.none:\n', MenuService.open.none);
          //console.log('scope.showNone:\n', scope.showNone);

          scope.showAll = open.all;
          scope.showPart = open.part;
          scope.showNone = open.none;
        });
      }
    };
  });
