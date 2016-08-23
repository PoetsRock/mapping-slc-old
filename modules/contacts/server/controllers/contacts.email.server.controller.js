'use strict';

const path = require('path');
const config = require(path.resolve('./config/config'));
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const _ = require('lodash');
const Promise = require('bluebird');
const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate;

const templatesDir = path.join(__dirname + '/../static');
const template = new EmailTemplate(path.join(templatesDir, 'verify-new-user'));
const transport = nodemailer.createTransport({
  pool: false,
  host: 'ecbiz198.inmotionhosting.com',
  port: 587,
  secure: false,
  auth: {
    user: config.mailer.options.auth.user,
    pass: config.mailer.options.auth.pass
  }
});

Promise.promisifyAll(template);
Promise.promisifyAll(transport);

/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.formatEmail = (req, res, next) => {
  req.baseEmailFields = {
    from: `Mapping SLC <maps@mappingslc.org>`,
    to: req.email.to,
  };
  next();
};


/**
 * Send Email
 *
 * @param req
 * @param res
 */
exports.sendTempUserSignupEmail = (req, res) => {
  const messageFields = _.extend({
    tempUserId: req.tempUser._id,
    tempToken: req.tempUser.authToken,
    subjectLine: req.email.subjectLine,
    replyUrl: 'http://localhost:3000/api/v1/auth/signup/verify?tempUserId=' + req.tempUser._id + '&tempToken=' + req.tempUser.authToken
  }, req.baseEmailFields);

  // Send a single email
  template.renderAsync(messageFields, results => {
    return results;
  })
  .then(results => {
    messageFields.html = results.html;
    messageFields.text = results.text;
    messageFields.subject = results.subject;
    return messageFields;
  })
  .then(messageFields => {
    transport.sendMail(messageFields, (err, responseStatus) => {
      if (err) {
        console.error('sendmail ::  err:\n', err);
        return console.error(err)
      }
      return res.jsonp(responseStatus);
    });
  })
  .catch(err => {
    return res.status(400).send({ message: errorHandler.getErrorMessage(err) });
  });



  // template.render(messageFields, (err, results) => {
  //   if (err) {
  //     console.error('err:\n', err);
  //     return console.error(err)
  //   }
  //   messageFields.html = results.html;
  //   messageFields.text = results.text;
  //   messageFields.subject = results.subject;
  //
  //   transport.sendMail(messageFields, (err, responseStatus) => {
  //     if (err) {
  //       console.error('sendmail ::  err:\n', err);
  //       return console.error(err)
  //     }
  //     return res.jsonp(responseStatus);
  //   });
  // });

};
