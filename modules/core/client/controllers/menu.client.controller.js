'use strict';

angular.module('core').controller('MenuController', ['$scope', '$window',
  function($scope, $window) {

    /**
     * gnmenu.js v1.0.0
     * http://www.codrops.com
     *
     * Licensed under the MIT license.
     * http://www.opensource.org/licenses/mit-license.php
     *
     * Copyright 2013, Codrops
     * http://www.codrops.com
     */
//;( function( window ) {

    function gnMenu(el, options) {
      this.el = el;
      this._init();
    }

    gnMenu.prototype = {
      _init: function () {
        this.trigger = this.el.querySelector('a.gn-icon-menu');
        this.menu = this.el.querySelector('nav.gn-menu-wrapper');
        this.isMenuOpen = false;
        this.eventtype = mobilecheck() ? 'touchstart' : 'click';
        this._initEvents();

        var self = this;
        this.bodyClickFn = function () {
          self._closeMenu();
          this.removeEventListener(self.eventtype, self.bodyClickFn);
        };
      },
      _initEvents: function () {
        var self = this;

        if (!mobilecheck()) {
          this.trigger.addEventListener('mouseover', function (ev) {
            self._openIconMenu();
          });
          this.trigger.addEventListener('mouseout', function (ev) {
            self._closeIconMenu();
          });

          this.menu.addEventListener('mouseover', function (ev) {
            self._openMenu();
            document.addEventListener(self.eventtype, self.bodyClickFn);
          });
        }
        this.trigger.addEventListener(this.eventtype, function (ev) {
          ev.stopPropagation();
          ev.preventDefault();
          if (self.isMenuOpen) {
            self._closeMenu();
            document.removeEventListener(self.eventtype, self.bodyClickFn);
          }
          else {
            self._openMenu();
            document.addEventListener(self.eventtype, self.bodyClickFn);
          }
        });
        this.menu.addEventListener(this.eventtype, function (ev) {
          ev.stopPropagation();
        });
      },
      _openIconMenu: function () {
        classie.add(this.menu, 'gn-open-part');
      },
      _closeIconMenu: function () {
        classie.remove(this.menu, 'gn-open-part');
      },
      _openMenu: function () {
        if (this.isMenuOpen) return;
        classie.add(this.trigger, 'gn-selected');
        this.isMenuOpen = true;
        classie.add(this.menu, 'gn-open-all');
        this._closeIconMenu();
      },
      _closeMenu: function () {
        if (!this.isMenuOpen) return;
        classie.remove(this.trigger, 'gn-selected');
        this.isMenuOpen = false;
        classie.remove(this.menu, 'gn-open-all');
        this._closeIconMenu();
      }
    };

    // add to global namespace
    $window.gnMenu = gnMenu;

    gnMenu($window);

  }
]);
//(window);
