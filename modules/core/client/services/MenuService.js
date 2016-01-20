'use strict';

//angular.module('core').service('MenuService', [ '$rootScope', '$scope',
//  function ($rootScope, $scope) {

angular.module('core').service('MenuService', [ '$rootScope',
  function ($rootScope) {


    this.open = {
      "part": false,
      "all": false,
      "none": false,
      "chatSideClosed": false
    };

    this.setShowPart = function (val) {
      //console.log('setShowPart\nval\n', val, '\n\n');
      this.open.part = val;
      $rootScope.$broadcast('MenuService.update', this.open);
    };

    this.setShowAll = function (val) {
      console.log('this.setShowAll\nval\n', val, '\n\n');
      this.open.all = val;
      if (val) {
        this.open.part = false;
        this.open.none = false;
      //} else {
      //  this.open.all = false;
        //this.toggleOverlayFunction('overlay');
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


    //return {
    //
    //  open: {
    //    "part": false,
    //    "all": false,
    //    "none": false,
    //    "chatSideClosed": false
    //  },
    //
    //  setShowPart: function (val) {
    //    //console.log('setShowPart\nval\n', val, '\n\n');
    //    this.open.part = val;
    //    $rootScope.$broadcast('MenuService.update', this.open);
    //  },
    //
    //  setShowAll: function (val) {
    //    //console.log('setShowAll\nval\n', val, '\n\n');
    //    this.open.all = val;
    //    if (val) {
    //      this.open.part = false;
    //      this.open.none = false;
    //    } else {
    //      $scope.toggleOverlayFunction('overlay');
    //    }
    //
    //    $rootScope.$broadcast('MenuService.update', this.open);
    //
    //  },
    //
    //  setChatSide: function (val) {
    //    this.open.chatSideClosed = val;
    //    $rootScope.$broadcast('MenuService.chatChangedState', this.open);
    //  }
    //};







  }
]);
