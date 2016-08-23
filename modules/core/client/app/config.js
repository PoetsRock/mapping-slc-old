'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngAnimate', 'ngCookies', 'ngMessages', 'ngMaterial', 'ngResource', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils', 'LocalStorageModule', 'bootstrapLightbox', 'cgNotify', 'vcRecaptcha', 'ngFileUpload'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
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
}());
