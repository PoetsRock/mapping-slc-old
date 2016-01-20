'use strict';

angular.module('core').service('MenuService', ['$rootScope',
  function ($rootScope) {

    this.open = {
      "part": false,
      "all": false,
      "none": false,
      "chatSideClosed": false
    };

    this.setShowPart = function (val) {
      this.open.part = val;
      $rootScope.$broadcast('MenuService.update', this.open);
    };

    this.setShowAll = function (val) {
      console.log('this.setShowAll\nval\n', val, '\n\n');
      this.open.all = val;
      if (val) {
        this.open.part = false;
        this.open.none = false;
      //} else if(!val && !this.open.part) {
      //  $rootScope.toggleOverlayFunction('overlay');
      }
      $rootScope.$broadcast('MenuService.update', this.open);
    };

    this.setShowNone = function(val) {
      console.log('setShowNone\nval\n', val, '\n\n');
      this.open.none = val;
      if (val) {
        //this.open.part = false;
        this.open.all = false;
      }
      $rootScope.$broadcast('MenuService.update', this.open);
    };

  }
]);
