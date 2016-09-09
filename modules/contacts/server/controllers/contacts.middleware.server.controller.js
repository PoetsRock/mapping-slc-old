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


exports.fileName = (req, res, next, id) => {
  req.params[id] = id;
  console.log('id: ', id);
  console.log('req.params[id]: ', req.params[id]);
  next();
};


exports.emailId = (req, res, next, id) => {
  console.log('req.params:\n', req.params);
  req.params[id] = id;
  next();
};


/**
 *
 * @param req
 * @param res
 * @param next
 */
exports.formatEmail = (req, res, next) => {
  console.log('req.body:\n', req.body);
  req.baseEmailFields = {
    from: `Mapping SLC <maps@mappingslc.org>`,
    to: req.body.email,
    subjectLine: req.body.subjectLine || 'Mapping SLC | Please confirm your email address'
  };
  next();
};

