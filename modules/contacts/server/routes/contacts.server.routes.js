'use strict';

module.exports = function (app) {
  const contactsPolicy = require('../policies/contacts.server.policy');
  const contacts = require('../controllers/contacts.server.controller');
  const emailCtrl = require('../controllers/contacts.email.server.controller');
  const middleware = require('../controllers/contacts.middleware.server.controller');

// Contacts collection routes
  //app.route('/api/v1/contacts').all(contactsPolicy.isAllowed)
  app.route('/api/v1/contacts')
    .get(contacts.list)
    .post(contacts.create);

// Single contact routes
  app.route('/api/v1/contacts/:contactId')
    .get(contacts.read)
    .put(contacts.update)
    .delete(contacts.delete);

  app.route('/api/v1/emails/auth/signup/:fileName')
    .get(emailCtrl.getSignupEmail);

  app.route('/api/v1/emails/email/test')
    .put(emailCtrl.sendTempUserSignupEmail);

  app.route('/api/v1/emails/:email/static')
    .put(emailCtrl.getSignupEmail);

  // Finish by binding the Contact middleware
  app.param('contactId', middleware.contactByID);
  app.param('fileName', middleware.fileName);
  app.param('emailId', middleware.fileName);
};
