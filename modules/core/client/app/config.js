'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngTouch', 'ngSanitize',  'ngMessages', 'ngCookies', 'ui.router', 'ui.bootstrap', 'ui.utils', 'ngCkeditor', 'bootstrapLightbox', 'cgNotify'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {

    console.log('module registration -- right here, baby...');
    console.log('moduleName:::::::::::::::::::::::::::::::::::::::::::');
    console.log(moduleName);
    console.log('dependencies:::::::::::::::::::::::::::::::::::::::::::');
    console.log(dependencies);
    console.log('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');

    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();
