'use strict';

angular.module('core').service('MenuService', [ '$rootScope',
  function ($rootScope) {

    return {

      open: {
        "part": false,
        "all": false,
        "chatSideClosed": false
      },

      setShowPart: function (val) {
        //console.log('setShowPart\nval\n', val, '\n\n');
        this.open.part = val;
        $rootScope.$broadcast('MenuService.update', this.open);
      },

      setShowAll: function (val) {
        //console.log('setShowAll\nval\n', val, '\n\n');
        this.open.all = val;
        if (val) {
          this.open.part = false;
        }
        $rootScope.$broadcast('MenuService.update', this.open);

      },

      setShowNone: function() {

        this.open.all = false;
        this.open.part = false;
        $rootScope.$broadcast('MenuService.update', this.open);
      },

      setChatSide: function (val) {
        this.open.chatSideClosed = val;
        $rootScope.$broadcast('MenuService.chatChangedState', this.open);
      }
    };
  }
]);
