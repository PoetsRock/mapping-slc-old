'use strict';

angular.module('core').service('MenuService', ['$rootScope',
  function ($rootScope) {

    this.open = {
      'part': false,
      'all': false,
      'none': false,
      'chatSideClosed': false
    };

    this.setShowPart = function (val) {
      this.open.part = val;
      console.log('###ShowPart this.open:\n', this.open);
      $rootScope.$broadcast('MenuService.update', this.open);
    };

    this.setShowAll = function (val) {
      this.open.all = val;
      if (val) {
        this.open.part = false;
        this.open.none = false;
      }
      $rootScope.$broadcast('MenuService.update', this.open);
    };
   
    
    this.killClass = function () {
      var mainMenuNav = angular.element( document.querySelector( '#main-menu-nav' ) );
      mainMenuNav.removeClass('my-open-all');
      this.setShowAll(false);
      
    };
    
  }
]);
