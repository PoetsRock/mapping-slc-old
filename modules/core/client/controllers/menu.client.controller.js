'use strict';

angular.module('core')

//children: [
//  {
//    name: 'child 1',
//    stateRef: '#child_1',
//    icon: 'fa-sort-amount-asc'
//  },
//  {
//    name: 'child 2',
//    stateRef: '#child_2',
//    icon: 'fa-sort-amount-asc'
//  }
//]

//children: [
//  {
//    name: 'child 3',
//    stateRef: '#child_3',
//    icon: 'fa-sort-amount-asc'
//  },
//  {
//    name: 'child 4',
//    stateRef: '#child_4',
//    icon: 'fa-sort-amount-asc'
//  }
//]

.service('MenuService', [ '$rootScope', function ($rootScope) {
  return {
    itemsMenu: [
      {
        name: 'Home',
        stateRef: '#home',
        icon: 'fa-home'
      },
      {
        name: 'Projects',
        stateRef: '#setting',
        icon: 'fa-map-marker'
      },
      {
        name: 'Contributors',
        stateRef: '#portfolio',
        icon: 'fa-users'
      },
      {
        name: 'Submit a Project',
        stateRef: '#blog',
        icon: 'fa-file'
      },
      {
        name: 'About Mapping SLC',
        stateRef: '#prices',
        icon: 'fa-map-signs'
      }
    ],

    open: {
      "part": false,
      "all": false,
      "chatSideClosed": false
    },

    setShowPart: function (val) {
      this.open.part = val;
      $rootScope.$broadcast('MenuService.update', this.open);
    },
    setShowAll: function (val) {
      this.open.all = val;
      if (val) {
        this.open.part = false;
      }
      $rootScope.$broadcast('MenuService.update', this.open);

    },
    setChatSide: function (val) {
      this.open.chatSideClosed = val;
      $rootScope.$broadcast('MenuService.chatChangedState', this.open);
    }
  };
}])


  .directive('leftMenu', function (MenuService) {
    return {
      restrict: 'EA',
      templateUrl: "modules/core/client/directives/views/google-left-menu.client.view.html",
      replace: true,
      link: function (scope, elm, attrs) {
        scope.itemsMenu = MenuService.itemsMenu;
        scope.showAll = MenuService.open.all;
        scope.showPart = MenuService.open.part;

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
          scope.toggleOverlayFunction('menu-open');
          if (event.target.id !== "triggerMenu") {
            return;
          }
          event.stopPropagation();
          MenuService.setShowAll(!scope.showAll);
        };

        scope.$on('MenuService.update', function (event, open) {
          scope.showAll = open.all;
          scope.showPart = open.part;
        });
      }
    };
  });
