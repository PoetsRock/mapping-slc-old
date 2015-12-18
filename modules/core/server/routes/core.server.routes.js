'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller'),
      projects = require('../../../projects/server/controllers/projects.server.controller'),
      users = require('../../../users/server/controllers/users.server.controller.js');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);

  ////route for getting the Featured Projects Array
  //app.route('featured/')
  //  .get(core.getFeaturedProjects);

  ////route for updating the Featured Projects Array
  //app.route('featured/:projectId')
  //  .put(core.updateFeaturedProject);

};
