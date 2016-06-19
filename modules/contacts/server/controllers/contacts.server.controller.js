'use strict';

/**
 * Module dependencies.
 */
let path = require('path'),
  config = require(path.resolve('./config/config')),
  Promise = require('bluebird'),
  mongoose = require('mongoose'),
  nodemailer = require('nodemailer'),
  // EmailTemplates = require('../../../../html-email.html'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

Promise.promisifyAll(require('nodemailer'));
mongoose.Promise = Promise;
let Contact = mongoose.model('Contact');
let User = mongoose.model('User');


let customConfigOpen = {
  pool: false,
  host: 'ecbiz198.inmotionhosting.com',
  port: 587,
  secure: false,
  auth: {
    user: config.mailer.options.auth.user,
    pass: config.mailer.options.auth.pass
  }
};

let customConfigSecure = {
  pool: false,
  secureHost: 'secure198.inmotionhosting.com',
  securePort: 465,
  secure: true,
  tls: {
      secureProtocol: "TLSv1_method"
    },
  auth: {
    user: config.mailer.options.auth.user,
    pass: config.mailer.options.auth.pass
  }
};

let transporter = nodemailer.createTransport(customConfigOpen);

exports.emailTest = (req, res) => {
  let messageFields = {
    from: `Mapping SLC <maps@mappingslc.org>`,
    to: 'christanseer@hotmail.com',
    subject: 'Test Email!',
    text: 'This is just a test, yo.',
    html: '<p>This is just a test, yo.</p>'
  };

  //create template builder
  let templates = new EmailTemplates();

  let sendHtmlEmail = transporter.templateSender({
    render: function(context, callback) {
      templates.render('html-email.html', context, (err, html, text) => {
        if(err) {
          return callback(err);
        }
        callback(null, {
          html: html,
          text: text
        });
      });
    }
  });

  // transporter.templateSender({
  //
  // });


  // .then(response => {
  //   console.log('email success `response`:\n', response);
  //   return res.status(201).send({
  //     message: 'email sent',
  //     data: response
  //   });
  // })
  // .catch(err => {
  //   console.log('email ERROR:\n', err);
  //   return res.status(400).send({
  //     message: 'Email ERROR:',
  //     data: response
  //   });
  // });


  transporter.sendMail(messageFields)
  .then(response => {
    console.log('email response:\n', response);
    return res.send({ message: 'email success', data: response });
  })
  .catch(err => {
    console.log('email ERROR:\n', err);
    return res.send({ message: 'email error', error: err });
  });

};


/**
 * emailAdmins sends an email to all users with an admin or superadmin role when a message arrives via the contact form or when a new project arrives
 * 
 * @param req
 * @param res
 */
exports.emailAdmins = (req, res) => {
  
};


/**
 * emailNewUser sends an email when a user signs up via the newsletter subscription page to provide user with login details and a temp(??) password
 * 
 * @param req
 * @param res
 */
exports.emailNewUser = (req, res) => {

};





var _checkForExistingUser = function (currentUniqueId) {
  User.find({
    'users._id': req.query
  })
    .exec(function (err, users) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        if (users.email === currentUniqueId) {
          return true;
        }
      }
    });
};


/**
 * Create a Contact
 */
exports.create = function (req, res) {
  var contact = new Contact(req.body);
  contact.user = req.user;

  if (req.user._doc._id) {  //determine whether user is logged in
    if (req.body.email === req.user._doc.email) {    //if true, then put message to current user's document

    } else {    //

    }
  }
  else if (_checkForExistingUser(req.body.email)) {
    console.log('update!');
    // if checkForExistingUser() is true, then user already exists
    // and we'll make a put on that document
  } else {
    console.log('create!');
    // if user does not exist, we'll create a new User document
    // and, in either case, we will save the message,
    // and send it to the admin panel
  }
  contact.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contact);
    }
  });
};

/**
 * Show the current Contact
 */
exports.read = function (req, res) {
  res.jsonp(req.contact);
};

/**
 * Update a Contact
 */
exports.update = function (req, res) {
  var contact = req.contact;

  contact = _.extend(contact, req.body);

  contact.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contact);
    }
  });
};

/**
 * Delete an Contact
 */
exports.delete = function (req, res) {
  var contact = req.contact;

  contact.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contact);
    }
  });
};

/**
 * List of Contacts
 */
exports.list = function (req, res) {
  Contact.find().sort('-created').populate('user', 'displayName').exec(function (err, contacts) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(contacts);
    }
  });
};

/**
 * Contact middleware
 */
exports.contactByID = function (req, res, next, id) {
  Contact.findById(id).populate('user', 'displayName').exec(function (err, contact) {
    if (err) return next(err);
    if (!contact) return next(new Error('Failed to load Contact ' + id));
    req.contact = contact;
    next();
  });
};

/**
 * Contact authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
  if (req.contact.user.id !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }
  next();
};
