'use strict';

const path = require('path');
const config = require(path.resolve('./config/config'));
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const _ = require('lodash');
const Promise = require('bluebird');
const nodemailer = require('nodemailer');
const ses = require('nodemailer-ses-transport');
const EmailTemplate = require('email-templates').EmailTemplate;

const templatesDir = path.join(__dirname + '/../static');
const template = new EmailTemplate(path.join(templatesDir, 'verify-new-user'));

const sesOptions = {
  accessKeyId: config.S3_ID,
  secretAccessKey: config.S3_SECRET,
  region: 'us-west-2',
  rateLimit: 5
};
const transport = nodemailer.createTransport(ses(sesOptions));
Promise.promisifyAll(template);
Promise.promisifyAll(transport);


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
    // subjectLine: req.email.subjectLine,
    replyUrl: 'http://localhost:3000/signup-verify?tempUserId=' + req.tempUser._id + '&tempToken=' + req.tempUser.authToken
  }, req.baseEmailFields);

  // Send a single email
  template.renderAsync(messageFields, results => {
    console.log('results:\n', results);
    return results;
  })
  .then(results => {
    messageFields.html = results.html;
    messageFields.text = results.text;
    messageFields.subject = results.subject;
    console.log('messageFields:\n', messageFields);
    return messageFields;
  })
  .then(messageFields => {
    transport.sendMail(messageFields, (err, responseStatus) => {
      if (err) {
        console.error('sendmail ::  err:\n', err);
        return console.error(err)
      }
      console.log('responseStatus:\n', responseStatus);
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

/**
 * Serve static files
 *
 * @param req
 * @param res
 */
exports.getSignupEmail = (req, res) => {
  const emailId = req.params.emailId;
  // res.sendFile(path.join(__dirname + '/../static/' + fileName));
  res.sendFile(path.join(__dirname + '/../static/verify-new-user/html.ejs'));
};
