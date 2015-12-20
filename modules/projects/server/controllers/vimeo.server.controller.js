'use strict';

exports.getOneVideo = function (req, res) {

  var path = require('path'),
    mongoose = require('mongoose'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    Project = mongoose.model('Project'),
    request = require('request'),
    vimeo_module = require('../../../../node_modules/vimeo/index.js'),
    Vimeo = vimeo_module.Vimeo,
    util_module = require('util');


  //if(process.env.NODE_ENV === 'production') {
  //  var defaultEnvConfig = require('../../../../config/env/default');
  //  res.jsonp(defaultEnvConfig);
  //} else if (process.env.NODE_ENV === 'local-development') {
    var keys = require('../../../../config/env/local-development.js');
    var vimeoKeys = {
      CLIENT_ID: keys.VIMEO_KEY,
      CLIENT_SECRET: keys.VIMEO_SECRET,
      ACCESS_TOKEN: keys.VIMEO_TOKEN
    };
    res.jsonp(vimeoKeys);
  //}

  /**
   * Get a video from vimeo api
   */

  var Vimeo = require('vimeo').Vimeo;
  var lib = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

// scope is an array of permissions your token needs to access. You can read more at https://developer.vimeo.com/api/authentication#scopes
  lib.generateClientCredentials(scope, function (err, access_token) {
    if (err) {
      throw err;
    }

    var token = access_token.access_token;

    // Other useful information is included alongside the access token
    // We include the final scopes granted to the token. This is important because the user (or api) might revoke scopes during the authentication process
    var scopes = access_token.scope;
  });


  lib.request(/*options*/{
    // This is the path for the videos contained within the staff picks channels
    path: '/channels/staffpicks/videos',
    // This adds the parameters to request page two, and 10 items per page
    query: {
      page: 2,
      per_page: 10
    }
  }, /*callback*/function (error, body, status_code, headers) {
    if (error) {
      console.log('error');
      console.log(error);
    } else {
      console.log('body');
      console.log(body);
    }

    console.log('status code');
    console.log(status_code);
    console.log('headers');
    console.log(headers);
  });


};
