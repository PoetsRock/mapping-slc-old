import multiparty from 'multiparty';
import Promise from 'bluebird';
import errorHandler from '../../../core/server/controllers/errors.server.controller';


let parseFileUpload = (requestObj) => {
  // parse a file upload
  let form = new multiparty.Form();
  Promise.promisify(form.parse);
  return form.parseAsync(requestObj)
    .then((response) => {
      console.log('parseFileUpload callback `response`:\n', response, '\n\n');
      if (!requestObj.body) { return requestObj.body = {}; }
      return { fields: fieldsObject, files: filesObject };
    })
    .catch(err => {
      console.log('parseFileUpload callback `err`:\n', err, '\n\n');
      return errorHandler(err);
    });
};

export {
  parseFileUpload
}