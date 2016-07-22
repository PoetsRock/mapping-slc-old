'use strict';

angular.module('core').factory('mainPageStateService', ['MenuService',
  function (MenuService, mainPageStateObj) {

    /*
    var mainPageStateObj = [
      { overlayActive: '' },
      { shadeMap: '' },
      { menuOpen: '' },
      { toggleSidebar: '' },
      { sourceFrom: '' },
      { sourceTo: '' },
      { callMenuService: '' }
    ];
    */

    if (mainPageStateObj.overlayActive && mainPageStateObj.sourceFrom === 'overlay') {
      console.log('toggle the shade! v1\n', mainPageStateObj.overlayActive, '\n', mainPageStateObj.sourceFrom);
      mainPageStateObj.overlayActive = !mainPageStateObj.overlayActive;
      mainPageStateObj.shadeMap = true;
    } else if (mainPageStateObj.overlayActive && mainPageStateObj.sourceFrom === 'menu-closed') {
      console.log('toggle the shade! v2\n', mainPageStateObj.overlayActive, '\n', mainPageStateObj.sourceFrom);
      mainPageStateObj.overlayActive = false;
      mainPageStateObj.menuOpen = true;
      mainPageStateObj.shadeMap = true;
    } else if (!mainPageStateObj.overlayActive && mainPageStateObj.sourceFrom === 'menu-closed' && !mainPageStateObj.menuOpen) {
      console.log('toggle the shade! v3\n', mainPageStateObj.overlayActive, '\n', mainPageStateObj.sourceFrom);
      mainPageStateObj.menuOpen = !mainPageStateObj.menuOpen;
      mainPageStateObj.shadeMap = false;
      MenuService.setShowAll(false);
      // MenuService.setShowPart(false);
    } else if (!mainPageStateObj.overlayActive && !mainPageStateObj.toggleSidebar && mainPageStateObj.sourceFrom === 'home' && mainPageStateObj.sourceTo === 'home') {
      console.log('toggle the shade! v4\n', mainPageStateObj.overlayActive, '\n', mainPageStateObj.sourceFrom);
      // mainPageStateObj.menuOpen = false;
      MenuService.setShowAll(false);
      // mainPageStateObj.overlayActive = true;
      mainPageStateObj.shadeMap = false;
    } else if (!mainPageStateObj.overlayActive && !mainPageStateObj.toggleSidebar && mainPageStateObj.sourceFrom === 'home' && mainPageStateObj.sourceTo !== 'home') {
      console.log('toggle the shade! v5\n', mainPageStateObj.overlayActive, '\n', mainPageStateObj.sourceFrom);
      mainPageStateObj.menuOpen = false;
      mainPageStateObj.overlayActive = true;
      mainPageStateObj.shadeMap = false;
      MenuService.setShowAll(false);
      // MenuService.setShowPart(false);
    } else if (!mainPageStateObj.overlayActive && mainPageStateObj.toggleSidebar && mainPageStateObj.sourceFrom === 'home') {
      console.log('toggle the shade! v6 ::  overlayActive \n', mainPageStateObj.overlayActive, '\ntoggleSidebar: ', mainPageStateObj.toggleSidebar, '\nsourceFrom: ', mainPageStateObj.sourceFrom);
      mainPageStateObj.toggleSidebar = false;
      mainPageStateObj.menuOpen = false;
      mainPageStateObj.shadeMap = false;
      MenuService.setShowAll(false);
      // MenuService.setShowPart(false);
      mainPageStateObj.overlayActive = true;
    }

    return mainPageStateObj;

  }
]);