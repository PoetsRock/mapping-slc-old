import fs from 'fs';
import path from 'path';
import _ from 'lodash';

let config = require(path.resolve('./config/config')),
  Promise = require('bluebird'),
  AWS = require('aws-sdk'),
  tinify = Promise.promisifyAll(require('tinify'));

let s3Config = { bucket: 'mapping-slc-file-upload', region: 'us-west-1',
    directory: [
      { name: 'project', path: 'project-directory' },
      { name: 'user', path: 'user-directory' },
      { name: 'admin', path: 'admin-directory' }
    ]
  };


let configMainObj = (req, res, next) => {
  let file = req.body.data.files.file[0];
  file.fileId = shortId.generate();
  
  if(/\s/g.test(file.originalFilename)) {
    file.originalFilename = fileName.replace(/\s/g, '_');
  }
  let imageFile = fs.createReadStream(filePath);
  let s3Obj = new Object({
    header: { 'x-amz-decoded-content-length': file.size },
    ACL: file.aclLevel || req.body.data.fields['data[securityLevel]'] || 'private',
    region: 'us-west-1',
    Key: 'project-directory/' + project._id + '/' + fileName,
    Bucket: s3Config.bucket,
    ContentLength: file.size,
    ContentType: type,
    Body: imageFile,
    Metadata: {
      imageId: fileId,
      linkedThumbUrl: 'https://s3-' + awsS3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + 'project-directory/' + project._id + '/' + fileName + '/thumbs'
    }
  });
  req.body.s3Obj = s3Obj;
  next();
};


let configWysiwygObj = (req, res, next) => {
  req.body.s3Obj.aclLevel = 'read-only';
  req.body.s3Obj.Key = 'project-directory/' + project._id + '/' + fileName;
  req.body.s3Obj.Metadata = {
    linkedThumbUrl: 'https://s3-' + awsS3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + 'project-directory/' + project._id + '/' + fileName + '/thumbs'
  };
  next();
};

export {
  configMainObj,
  configWysiwygObj
};
