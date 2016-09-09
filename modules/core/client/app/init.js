'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName)
.config(['$locationProvider', '$httpProvider', '$mdThemingProvider', '$mdIconProvider',
  function ($locationProvider, $httpProvider, $mdThemingProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');
    $httpProvider.interceptors.push('authInterceptor');

    var customPrimary = {
      '50': '#06b599',
      '100': '#059d84',
      '200': '#05846f',
      '300': '#046b5b',
      '400': '#035346',
      '500': '#023a31',
      '600': '#01211c',
      '700': '#000907',
      '800': '#000000',
      '900': '#000000',
      'A100': '#07ceae',
      'A200': '#08e7c3',
      'A400': '#11f7d2',
      'A700': '#000000',
      // whether, by default, text (contrast) on this palette should be dark or light
      'contrastDefaultColor': 'light',
      //hues which contrast should be 'dark' by default
      'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
      // could also specify this if default was 'dark'
      'contrastLightColors': undefined
    };

    var customAccent = {
      '50': '#b3b3b3',
      '100': '#bfbfbf',
      '200': '#cccccc',
      '300': '#d9d9d9',
      '400': '#e6e6e6',
      '500': '#000000',
      '600': '#ffffff',
      '700': '#ffffff',
      '800': '#ffffff',
      '900': '#ffffff',
      'A100': '#ffffff',
      'A200': '#ffffff',
      'A400': '#f2f2f2',
      'A700': '#ffffff',
      // whether, by default, text (contrast) on this palette should be dark or light
      'contrastDefaultColor': 'dark',
      //hues which contrast should be 'dark' by default
      'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],
      // could also specify this if default was 'dark'
      'contrastLightColors': undefined
    };

    var customWarn = {
      '50': '#ff8080',
      '100': '#ff6666',
      '200': '#ff4d4d',
      '300': '#ff3333',
      '400': '#ff1a1a',
      '500': '#ff0000',
      '600': '#e60000',
      '700': '#cc0000',
      '800': '#b30000',
      '900': '#990000',
      'A100': '#ff9999',
      'A200': '#ffb3b3',
      'A400': '#ffcccc',
      'A700': '#800000',
      'contrastDefaultColor': 'light',
    };

    var customBackground = {
    //   '50': '#404040',
    //   '100': '#333333',
    //   '200': '#262626',
    //   '300': '#1a1a1a',
    //   '400': '#0d0d0d',
    //   '500': 'rgba(0,0,0,0.5)',
    //   '600': '#000000',
    //   '700': '#000000',
    //   '800': '#000000',
    //   '900': '#000000',
    //   'A100': '#4d4d4d',
    //   'A200': '#595959',
    //   'A400': '#666666',
    //   'A700': '#000000'
    // };
    '50': '#b3b3b3',
    '100': '#bfbfbf',
    '200': '#cccccc',
    '300': '#d9d9d9',
    '400': '#e6e6e6',
    '500': '#f2f2f2',
    '600': '#ffffff',
    '700': '#ffffff',
    '800': '#ffffff',
    '900': '#ffffff',
    'A100': '#ffffff',
    'A200': '#ffffff',
    'A400': '#f2f2f2',
    'A700': '#ffffff'
  };

    $mdThemingProvider
    .definePalette('customPrimary', customPrimary)
    .definePalette('customAccent', customAccent)
    .definePalette('customWarn', customWarn)
    .definePalette('customBackground', customBackground);

    $mdThemingProvider
    .theme('default')
      .primaryPalette('customPrimary')
      .accentPalette('customAccent')
      .warnPalette('customWarn')
      .backgroundPalette('customBackground');

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
