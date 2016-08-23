'use strict';

module.exports = function (app) {
  const contactsPolicy = require('../policies/contacts.server.policy');
  const contacts = require('../controllers/contacts.server.controller');
  const emailCtrl = require('../controllers/contacts.email.server.controller');

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
    .get(contacts.getSignupEmail);

  app.route('/api/v1/emails/email/test')
  .put(emailCtrl.sendTempUserSignupEmail);


  // Finish by binding the Contact middleware
  app.param('contactId', contacts.contactByID);
  app.param('fileName', contacts.fileName);
};
