//'use strict';
//
//  var fs = require('fs'),
//      nconf = require('nconf'),
//      development = require('../../../../config/env/development.js'),
//      localDev = require('../../../../config/env/local-development.js');
//
//  // add env vars and args
//  nconf.env().argv();
//
//// load in configs from the config files
//  var envVars = {},
//  // so we can iterate over each config file
//      confs = [development, localDev];
//
//// for every config file
//  confs.forEach(function(conf) {
//    // get each key
//    for (var key in conf) {
//      // and add it to the envVars object
//      envVars[key] = conf[key]
//    }
//  });
//// save the envVars object
//  nconf.envVars(envVars);
//
//// logging this here works and properly shows the port setting
//  console.log('envVars : ' + nconf.get('mapbox:MAPBOX_KEY'));
//
//
//
//  //
//  ////
//  //// Save the configuration object to disk
//  ////
//  //nconf.save(function (err) {
//  //  fs.readFile('modules/users/server/config/private/keys.json', function (err, data) {
//  //    console.dir(JSON.parse(data.toString()))
//  //  });
//  //});
//
//
//
//module.exports = nconf;
