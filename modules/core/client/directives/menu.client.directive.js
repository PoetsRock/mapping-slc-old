'use strict';

angular.module('core').directive('leftMenu', function (MenuService) {
    return {
      restrict: 'EA',
      templateUrl: "modules/core/client/directives/views/google-left-menu.client.view.html",
      replace: true,

      //controller: function($scope) {
      controller: function() {
         //Collapse the menu after navigating away from page
        //console.log('$stateChangeSuccess: `e`:\n', e);
      },

      link: function (scope, elm, attrs) {
        scope.itemsMenu = MenuService.itemsMenu;
        scope.showAll = MenuService.open.all;
        scope.showPart = MenuService.open.part;
        scope.showNone = MenuService.open.none;

        scope.$on('$stateChangeStart',
          function (event, toState, toParams, fromState, fromParams) {
            var state = {event: event,toState: toState,toParams: toParams,fromState: fromState,fromParams: fromParams};
            //console.log('state:\n', state);
            MenuService.setShowAll(false);
          });

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
          console.log('MenuService.update... event:\n', event);
          console.log('MenuService.update... open.all:\n', open.all);

          scope.showAll = open.all;
          scope.showPart = open.part;
          scope.showNone = open.none;
        });

      }
    };
  });
