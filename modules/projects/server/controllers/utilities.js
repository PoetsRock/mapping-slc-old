'use strict';

let fileExt = [
  { type: 'image/jpeg', extension: 'jpg' },
  { type: 'image/png', extension: 'png' },
  { type: 'image/gif', extension: 'gif' }
];

exports.getFileExt = (fileType, fileName) => {
  let extension = fileExt.find(x => { 
    return x.type === fileType;
  });
  if(!extension && fileName) { return fileName.slice(-3); }
  return extension;
};
