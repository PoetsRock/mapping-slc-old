'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider', '$mdThemingProvider', '$mdIconProvider',
  function ($locationProvider, $httpProvider, $mdThemingProvider, $mdIconProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('yellow');

    // Register the user `avatar` icons
    $mdIconProvider
    .defaultIconSet('./assets/svg/avatars.svg', 128)
    .icon('menu'       , './assets/svg/menu.svg'        , 24)
    .icon('share'      , './assets/svg/share.svg'       , 24)
    .icon('google_plus', './assets/svg/google_plus.svg' , 512)
    .icon('hangouts'   , './assets/svg/hangouts.svg'    , 512)
    .icon('twitter'    , './assets/svg/twitter.svg'     , 512)
    .icon('phone'      , './assets/svg/phone.svg'       , 512);


    $httpProvider.interceptors.push('authInterceptor');

  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if ((role === 'guest') || (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1)) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
});

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
