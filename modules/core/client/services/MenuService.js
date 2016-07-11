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
      // } else if(!val && !this.open.part) {
      //  $rootScope.toggleOverlayFunction('overlay');
      } else {
        // scope.toggleOverlayFunction('overlay');
      }
      console.log('###ShowAll this.open:\n', this.open);
      $rootScope.$broadcast('MenuService.update', this.open);
    };

    this.setShowNone = function () {
      this.open.none = true;
      this.open.part = false;
      this.open.all = false;
      // if (val) {
      //   this.open.part = false;
      //   this.open.all = false;
      // }
      console.log('MenuSERVICE :::  this.setShowNone() :: `this.open`:\n', this.open);
      $rootScope.$broadcast('MenuService.close', this.open);
    };

  }
]);
