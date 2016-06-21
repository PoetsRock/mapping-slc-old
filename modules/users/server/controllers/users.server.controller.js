'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./users/users.authentication.server.controller'),
  require('./users/users.authorization.server.controller'),
  require('./users/users.password.server.controller'),
  require('./users/users.profile.server.controller'),
  require('./users/users.newsletter.server.controller'),
  require('./users/users.uploader.server.controller'),
  require('./users/users.middleware.server.controller')
);
