'use strict';

let moment = require('moment');

/**
 *  Creates and configures an object to update the associated database document
 * @param req
 * @param res
 * @param next
 */
exports.configMongoObj = (req, res, next) => {
  let fileData = req.body.fileData;

  // todo make dynamic !!
  let currentUserId = '5611ca9493e8d4af5022bc17';

  let fieldsToUpdate = {
    profileImageUrl: fileData.fullImageUrl ,
    profileImageThumbUrl: fileData.thumbImageUrl,
    $addToSet: {
      modified: {
        modifiedBy: currentUserId,
        modifiedAt: moment.utc(Date.now())
      }
    }
  };
  req.body.fileData = fileData;
  req.body.fieldsToUpdate = fieldsToUpdate;
  next();
};
