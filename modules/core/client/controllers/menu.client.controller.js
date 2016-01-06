'use strict';

angular.module('core')


  .controller('contentBodyController', [ 'MenuService', '$scope', function (MenuService, $scope) {
    $scope.isMenuClosed = !MenuService.open.all;

    $scope.closeMenu = function () {
      MenuService.setShowAll(false);
    };

    $scope.$on('MenuService.update', function (event, open) {
      $scope.isMenuClosed = !open.all;
    });
    return $scope;
  }])





  .controller('chatController', [ 'MenuService', '$scope', function (MenuService, $scope) {
    $scope.title = "Chat";
    $scope.userImage = "./img/defaultPhoto.png";
    $scope.chatSide = !MenuService.open.chatSide;

    $scope.chatSideChangeState = function () {
      MenuService.setChatSide(!$scope.chatSide);
    };
    $scope.$on('MenuService.chatChangedState', function (event, open) {
      $scope.chatSide = open.chatSideClosed;
    });
    return $scope;
  }])



.service('MenuService', [ '$rootScope', function ($rootScope) {
  return {
    itemsMenu: [
      {
        name: 'Home',
        href: '#home',
        icon: 'fa-home'
      },
      {
        name: 'Setting',
        href: '#setting',
        icon: 'fa-cogs'
      },
      {
        name: 'Portfolio',
        href: '#portfolio',
        icon: 'fa-desktop',
        children: [
          {
            name: 'child 1',
            href: '#child_1',
            icon: 'fa-sort-amount-asc'
          },
          {
            name: 'child 2',
            href: '#child_2',
            icon: 'fa-sort-amount-asc'
          }
        ]
      },
      {
        name: 'Blog',
        href: '#blog',
        icon: 'fa-book'
      },
      {
        name: 'Prices',
        href: '#prices',
        icon: 'fa-eur',
        children: [
          {
            name: 'child 3',
            href: '#child_3',
            icon: 'fa-sort-amount-asc'
          },
          {
            name: 'child 4',
            href: '#child_4',
            icon: 'fa-sort-amount-asc'
          }
        ]
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
        scope.menuTogle = function (event) {
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
