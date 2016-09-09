'use strict';

module.exports = function (app) {
  // Root routing
  const core = require('../controllers/core.server.controller');
  const path = require('path');
  const config = require(path.resolve('./config/config'));

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);


  app.use(require('prerender-node')
    // Setup Prerender.io for Localhost Testing
    .set('prerenderServiceUrl', 'http://localhost:1337/')
    // Setup Prerender.io for Production
    .set('prerenderToken', config.PRERENDER_TOKEN));

};
