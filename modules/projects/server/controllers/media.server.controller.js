// 'use strict';
//
//
// var mongoose = require('mongoose'),
//   fs = require('fs'),
//   path = require('path'),
//   util = require('util'),
//   _ = require('lodash'),
//   errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
//   Project = mongoose.model('Project'),
//   multiparty = require('multiparty'),
//   config = require(path.resolve('./config/config')),
//   projects = require('./projects.server.controller'),
//   Promise = require('bluebird'),
//   AWS = require('aws-sdk'),
//   s3Config = {
//     bucket: 'mapping-slc-file-upload',
//     region: 'us-west-1',
//     directory: [
//       { name: 'project', path: 'project-directory' },
//       { name: 'user', path: 'user-directory' },
//       { name: 'admin', path: 'admin-directory' }
//     ]
//   },
//   s3Url = 'https://' + s3Config.bucket + '.s3-' + s3Config.region + '.amazonaws.com',
//   crypto = require('crypto'),
//   moment = require('moment'),
//   tinify = require('tinify');
//
//
//
// /**
//  *
//  * Multiparty Middleware for Handling Multipart Form Data
//  *
//  * @param req
//  * @param res
//  * @param next
//  */
// exports.parseFileUpload = (req, res, next) => {
//   // parse a file upload
//   var form = new multiparty.Form();
//   form.parse(req, function (err, fieldsObject, filesObject) {
//     if (err) {
//       console.log('parseFileUpload callback `err`:\n', err, '\n\n');
//     }
//     if (!req.body) {
//       return req.body = {};
//     }
//     req.body.data = { fields: fieldsObject, files: filesObject };
//     req.body.dataAsStr = util.inspect({ fields: fieldsObject, files: filesObject });
//     next();
//   });
// };
//
//
// exports.findOneVideoId = function (req, res) {
//   Project.findById(req.body._id)
//     .exec(function (err, project) {
//       if (err) {
//         return next(err);
//       }
//       if (!project) {
//         return next(new Error('Failed to load project ' + id + 'associated with the requested video.')
//         )
//       }
//       res.vimeoId = project.vimeoId;
//     });
// };
//
//
// /**
//  *
//  * create AWS credentials for front end upload to S3
//  *
//  * @param req
//  * @param res
//  *
//  */
// exports.createUploadCredentials = (req, res) => {
//   let project = req.body.project;
//   let fileType = req.body.type;
//   let fileName = req.body.filename;
//   if (1 !== 1) {
//     fileName = req.body.filename.replace(/\s/g, '_'); //substitute all whitespace with underscores
//   }
//   let path = 'project-directory/' + project._id + '/' + fileName;
//   let readType = 'public-read';
//   let expiration = moment().add(5, 'm').toDate(); //15 minutes
//   let s3Policy = {
//     'expiration': expiration,
//     'conditions': [{
//       'bucket': s3Config.bucket
//     },
//       ['starts-with', '$key', path],
//       {
//         'acl': readType
//       },
//       {
//         'success_action_status': '201'
//       },
//       ['starts-with', '$Content-Type', req.body.type],
//       ['content-length-range', 2048, 10485760], //min and max
//     ]
//   };
//
//   let stringPolicy = JSON.stringify(s3Policy);
//   let base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');
//
//   // sign policy
//   let signature = crypto.createHmac('sha1', config.S3_SECRET)
//     .update(new Buffer(base64Policy, 'utf-8')).digest('base64');
//
//   let credentials = {
//     url: s3Url,
//     fields: {
//       key: path,
//       AWSAccessKeyId: config.S3_ID,
//       acl: readType,
//       policy: base64Policy,
//       signature: signature,
//       'Content-Type': fileType,
//       success_action_status: 201
//     }
//   };
//
//   if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//     fileType = 'application/docx'
//   }
//   /** save document URLs to MongoDb */
//   let newFile = {
//     fileUrl: 'https://s3-us-west-1.amazonaws.com/' + s3Config.bucket + '/' + 'project-directory/' + project._id + '/' + fileName,
//     fileName: fileName,
//     fileType: fileType,
//     fileSize: req.body.size
//   };
//
//   project.fileUrls = project.fileUrls || [];
//   project.fileUrls.push(newFile);
//   Project.update({ _id: project._id }, { fileUrls: project.fileUrls }, { runValidators: true }, function (err, response) {
//     if (err) {
//       let errMessage = {
//         message: 'Error dating database for project file upload',
//         error: err
//       };
//       console.log('errMessage:\n', errMessage, '\n\n');
//       res.jsonp(errMessage);
//     }
//     console.log('::::: file upload update db successful::: var `response`:\n', response, '\n\n');
//     res.jsonp(credentials);
//   });
// };
//
//
// /**
//  *
//  * Uploads documents to s3:
//  * * stores files path bucket: `mapping-slc-file-upload/project-directory/<project-id>/`
//  * * url to access documents: ``
//  *
//  * @param req
//  * @param res
//  *
//  */
// exports.streamProjectDocuments = (req, res) => {
//
//   var project = req.project;
//
//   var file = req.body.data.files.file[0];
//   var filePath = req.body.data.files.file[0].path;
//   var fileName = req.body.data.files.file[0].originalFilename;
//   var type = req.body.data.files.file[0].headers['content-type'];
//   var aclLevel = req.body.data.fields['data[securityLevel]'];
//
//   if (/\s/g.test(fileName)) {
//     fileName = fileName.replace(/\s/g, '_');
//   }
//
//   /** config aws s3 config settings, file object, and create a new instance of the s3 service */
//   let awsS3Config = {
//     accessKeyId: config.S3_ID,
//     secretAccessKey: config.S3_SECRET,
//     region: 'us-west-1',
//     Key: 'project-directory/' + project._id + '/' + fileName,
//     Bucket: s3Config.bucket
//   };
//   let fileStream = fs.createReadStream(filePath);
//   let s3obj = {
//     header: { 'x-amz-decoded-content-length': file.size },
//     ACL: aclLevel || 'private',
//     region: 'us-west-1',
//     Key: 'project-directory/' + project._id + '/' + fileName,
//     Bucket: s3Config.bucket,
//     ContentLength: file.size,
//     ContentType: type,
//     Body: fileStream
//     // ServerSideEncryption: 'AES256'
//   };
//
//
//
//   /** now upload document to S3 */
//   let s3 = new AWS.S3(awsS3Config);
//
//   s3.upload({ Bucket: s3obj.Bucket, Key: s3obj.Key, Metadata: {}, Body: s3obj.Body })
//     .on('httpUploadProgress', function (evt) {
//       console.log(evt);
//     })
//     .send(function (err, data) {
//       if (err) {
//         console.log('s3 upload error message:\n', err);
//       }
//       console.log('s3 upload project files :: SUCCESSFUL UPLOAD :: Response var `data`:\n', data);
//
//       /** now save main document url and ETag to mongoDb */
//       let updatedProject = {
//         fileUrls: data.Location,
//         fileEtags: data.ETag
//       };
//       Project.update(updatedProject);
//
//       /** now respond with a success message */
//       // res.jsonp({ message: 's3 file upload was successful', mainImageUrl: data.Location });
//
//       let response = {
//         message: 's3 file upload was successful',
//         s3obj: s3obj
//       };
//       res.jsonp(response);
//
//     });
//
// };
//
//
// /**
//  *
//  * Uploads images to s3 - stores files in `mapping-slc-file-upload/project-directory/<project-id>/`
//  *
//  * @param req
//  * @param res
//  */
// exports.uploadProjectImages = (req, res) => {
//
//   console.log('req.body.data.files.file[0]:\n', req.body.data.files.file[0], '\n');
//
//   let project = {};
//   if (req.project) {
//     project = req.project;
//   }
//
//   let file = req.body.data.files.file[0],
//     filePath = file.path,
//     fileName = file.originalFilename,
//     type = file.headers['content-type'];
//
//   if (req.source === 'wysiwyg') {
//     file.aclLevel = 'read-only'
//   }
//   if (/\s/g.test(fileName)) {
//     fileName = fileName.replace(/\s/g, '_');
//   }
//
//   /** config aws s3 config settings, file object, and create a new instance of the s3 service */
//   let awsS3Config = {
//     accessKeyId: config.S3_ID,
//     secretAccessKey: config.S3_SECRET,
//     region: 'us-west-1',
//     Key: 'project-directory/' + project._id + '/' + fileName,
//     Bucket: s3Config.bucket
//   };
//
//
//   // let metaData
//   // Metadata: metaData,
//
//   if (req.source !== 'wysiwyg') {
//
//     let configObj = {
//       file: fs.createReadStream(filePath),
//       projectId: project._id,
//       fileName: fileName,
//       filePathThumb: filePathThumb
//     };
//
//     _imageOptimizationAndThumb(configObj)
//       .then((response) => {
//         console.log('imageOptimizationAndThumb `response`:\n', response);
//       });
//
//     /** configure response object */
//     let updatedImageAndThumb = {
//       mainImageUrl: 'https://s3-' + awsS3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + 'project-directory/' + project._id + '/' + fileName,
//       mainImageThumbnailUrl: 'https://s3-' + awsS3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + 'project-directory/' + project._id + '/' + 'thumb_' + fileName
//     };
//
//     /** now save the image URLs to mongoDb */
//     Project.update(updatedImageAndThumb);
//
//     /** configure response object */
//     updatedImageAndThumb.message = 's3 file upload was successful';
//
//     return res.send(updatedImageAndThumb);
//   }
//
//
//   if (req.source === 'wysiwyg') {
//
//     /** `s3obj`: {object} credentials and config needed for uploading directly to s3 without optimizing image  **/
//     let s3obj = new Object({
//       header: { 'x-amz-decoded-content-length': file.size },
//       ACL: file.aclLevel || req.body.data.fields['data[securityLevel]'] || 'private',
//       region: 'us-west-1',
//       Key: 'project-directory/' + project._id + '/' + fileName,
//       Bucket: s3Config.bucket,
//       ContentLength: file.size,
//       ContentType: type,
//       Body: fs.createReadStream(filePath)
//     });
//
//     /** create new instance of S3 */
//     let s3 = new AWS.S3(awsS3Config);
//
//     /** upload image to S3 */
//     s3.upload({ Bucket: s3obj.Bucket, Key: s3obj.Key, Body: s3obj.Body })
//       .on('httpUploadProgress', function (evt) {
//         console.log(evt);
//       })
//       .send(function (err, data) {
//         if (err) {
//           console.log('s3 upload error message:\n', err);
//         }
//         console.log('s3 upload project files :: SUCCESSFUL UPLOAD :: Response var `data`:\n', data);
//
//         /** now save main document url and ETag to mongoDb */
//         let updatedProject = {
//           mainImageUrl: 'https://s3-' + awsS3Config.region + '.amazonaws.com/' + s3Config.bucket + '/' + 'project-directory/' + project._id + '/' + fileName,
//           fileUrls: data.Location,
//           fileEtags: data.ETag
//         };
//
//         /** now save the image URLs to mongoDb */
//         Project.update(updatedProject);
//
//
//         /** configure response object */
//         return res.jsonp({ link: updatedProject.mainImageUrl });
//       });
//   }
// };
//
//
// let _imageOptimizationAndThumb = (configObj) => {
//
//   return _compressImage(configObj.projectId, configObj.fileName, configObj.filePath)
//     .then(response => {
//       console.log('response'. response);
//       return _createThumbnail(configObj.projectId, configObj.fileName, configObj.filePathThumb);
//     });
// };
//
//
// /**
//  *
//  * sends image to TingPNG, which creates optimized thumbnail of image and then uploads thumb to s3
//  *
//  * @param {string} projectId
//  * @param {string} fileName
//  * @param {string} filePath
//  *
//  * @returns {string} optimizedImg
//  * @private
//  */
// let _createThumbnail = (projectId, fileName, filePath) => {
//   tinify.key = config.TINY_PNG_KEY;
//   let source = tinify.fromFile(filePath);
//   return source.resize({
//     method: 'cover',
//     width: 150,
//     height: 150
//   })
//     .store({
//       service: 's3',
//       aws_access_key_id: config.S3_ID,
//       aws_secret_access_key: config.S3_SECRET,
//       region: 'us-west-1',
//       path: s3Config.bucket + '/' + 'project-directory/' + projectId + '/thumbs/' + 'thumb_' + fileName
//     });
// };
//
// /**
//  *
//  * * Compress an image before uploading file
//  *
//  * @param {string} dirDestination - name of the directory for upload path, either `project` or `user`
//  * @param {string} sourceId - the id of either the project or user
//  * @param {string} fileName
//  * @param {string} filePath
//  *
//  * @returns {string} optimizedImg
//  * @private
//  */
// let _compressImage = (dirDestination, sourceId, fileName, filePath) => {
//   tinify.key = config.TINY_PNG_KEY;
//
//   let source = tinify.fromFile(filePath);
//   let bufferSource = tinify.fromBuffer(filePath);
//   var sourceIdBucket = req.params.sourceId || req.params.userId || req.params.projectId;
//   let directory = s3Config.directory.find(x => { return x.name === dirDestination })
//   .then(response => {
//     return response.path;
//   });
//   console.log('s3 upload directory:::::::::::::::', directory);
//   return source.store({
//     service: 's3',
//     aws_access_key_id: config.S3_ID,
//     aws_secret_access_key: config.S3_SECRET,
//     region: 'us-west-1',
//     path: s3Config.bucket + '/' + directory + '/' + sourceIdBucket + '/' + fileName
//   });
// };
//
//
//
//
//
// exports.getS3Images = (req, res) => {
//
//   console.log(':::::::::::::::   getImagesByProjectId   :::::::::::::::');
//   console.log('req.params:::::::::::::::\n', req.params, '\n\n');
//
//   var awsS3Config = {
//     accessKeyId: config.S3_ID,
//     secretAccessKey: config.S3_SECRET,
//     region: 'us-west-1'
//   };
//   /** now upload document to S3 */
//   let s3 = new AWS.S3(awsS3Config);
//
//   // req.params
//   //req.params.projectId
//
//
//   // var sourceIdBucket = req.params.sourceId || req.params.userId || req.params.projectId;
//   // let directory = s3Config.directory.find(x => { return x.name === dirDestination })
//   // .then(response => {
//   //   return response.path;
//   // });
//   // console.log('s3 upload directory:::::::::::::::', directory, '\n\n');
//
// //
// //  https://s3-us-west-1.amazonaws.com/mapping-slc-file-upload/project-directory/561978272356222b1ceb5a7c/thumbs/test.png
//
//   let sourceBucket = 'project-directory';
// //Bucket: s3Config.bucket + '/' + sourceBucket + '/' + req.params.projectId,
//
//   var thumbParams = {
//     Bucket: 'mapping-slc-file-upload',
//     Prefix: sourceBucket + '/' + req.params.projectId + '/thumbs',
//     EncodingType: 'url'
//   };
//
//   var imageParams = {
//     Bucket: 'mapping-slc-file-upload',
//     Prefix: sourceBucket + '/' + req.params.projectId,
//     EncodingType: 'url'
//   };
//
//   let listObjects = Promise.promisifyAll(s3);
//
//
//   listObjects.listObjectsV2Async(imageParams)
//   .then(response => {
//     console.log(':::::::::::::::response::::::::::::::::\n', response, '\n\n');
//
//
//     let root = response.Contents.Name + response.Contents.Prefix;
//     return response.Contents.map(x => {
//       let projectImage = {};
//       projectImage.image = {};
//       projectImage.image.url = root + x.Key;
//       projectImage.image.eTag = x.ETag;
//     });
//   })
//   .then(projectImages => {
//     listObjects.listObjectsV2Async(imageParams)
//     .then(response => {
//       console.log(':::::::::::::::response::::::::::::::::\n', response, '\n\n');
//
//     let projectThumbs = response.Contents.map(x => {
//       let projectImage = {};
//       projectImage.thumb = {};
//       projectImage.thumb.url = root + x.Key;
//       projectImage.thumb.eTag = x.ETag;
//     });
//   })
//   .catch(err => {
//     console.log(':::::::::::::::err:::::::::::::::::\n', err);
//     res.send(err);
//   });
//   });
//
//
//   };
//
//
//
//
//
// /**
//  * get pre-signed URL from AWS S3
//  *
//  * req.params.id {string} - the unique ID of the requesting source - either `projectId` or `userId`
//  * req.params.imageId {string} - file name with extension
//  */
// exports.getS3SignedUrl = (req, res) => {
//
//   console.log(':::::::::::::::   getS3SignedUrl   :::::::::::::::');
//   console.log('req.params:::::::::::::::\n', req.params, '\n\n');
//
//   var awsS3Config = {
//     accessKeyId: config.S3_ID,
//     secretAccessKey: config.S3_SECRET,
//     region: 'us-west-1'
//   };
//   var s3 = new AWS.S3(awsS3Config);
//   var fileToGet = req.params.fileId;
//   var sourceIdBucket = req.params.sourceId || req.params.userId || req.params.projectId;
//   let directory = s3Config.directory.find(x => { return x.name === dirDestination })
//   .then(response => {
//     return response.path;
//   });
//   console.log('s3 upload directory:::::::::::::::', directory, '\n\n');
//   var fileData = {
//     fileToGet: fileToGet,
//     sourceIdBucket: sourceIdBucket,
//     params: {
//       Bucket: s3Config.bucket + '/' + directory + '/' + sourceIdBucket,
//       Key: fileToGet
//     }
//   };
//
//   let getSignedUrl = Promise.promisify(s3.getSignedUrl(method, params));
//
//   console.log('getSignedUrl promisified:::::::::::::::\n', getSignedUrl, '\n\n');
//
//   getSignedUrl('getObject', fileData.params)
//   .then(response => {
//       console.log('The URL is: ', response);
//       res.status(200).send({
//         message: 'Success: URL is available for 15 minutes',
//         url: response
//       });
//   })
//   .catch(err => {
//     console.log('Error getting file: ', err);
//     console.log('err.statusCode: ', err.statusCode);
//     res.status(400).send({
//       message: 'Error getting file',
//       error: err
//     });
//   });
//
//     // s3.getSignedUrl('getObject', fileData.params,
//     // (err, url) => {
//     //   if (err) {
//     //     res.status(400).send({
//     //       message: 'Error',
//     //       error: err
//     //     })
//     //   }
//     //   console.log('The URL is: ', url);
//     //   res.status(200).send({
//     //     message: 'Success: URL is availble for 15 minutes',
//     //     url: url
//     //   });
//     // });
// };
//
// /**
//  * get file from AWS S3
//  *
//  * req.params.id {string} - user._id
//  * req.params.imageId {string} - file name with extension
//  */
//
// exports.getS3File = function (req, res) {
//   var awsS3Config = {
//     accessKeyId: config.S3_ID,
//     secretAccessKey: config.S3_SECRET,
//     region: 'us-west-1'
//   };
//   var s3 = new AWS.S3(awsS3Config);
//   var fileToGet = req.params.fileId;
//   var userIdBucket = req.params.userId;
//   var fileData = {
//     fileToGet: fileToGet,
//     userIdBucket: userIdBucket,
//     params: {
//       Bucket: s3Config.bucket + '/' + s3Config.directory.user + '/' + userIdBucket,
//       Key: fileToGet
//     }
//   };
//   var pathToLocalDisk = 'modules/users/client/img/profile/uploads/';
//   var userProfileImage = pathToLocalDisk + fileToGet;
//   //var fileType = '';
//
//
//   s3.getObject(fileData.params, function (err, callback) {
//     //require('string_decoder');
//     if (err) {
//       console.log('err:\n', err);
//       res.send({
//         message: 'ERROR, yo: ' + err
//       })
//     } else {
//       // var imageAsBase64Array = callback.Body.toString('base64');
//       // var imageAsUtf8 = callback.Body.toString('Utf8');
//
//       // console.log('callback.Body:\n', callback.Body, '\n\n\n');
//       // console.log('userProfileImage:\n', userProfileImage, '\n\n\n');
//
//       fs.writeFile(userProfileImage, callback.Body, 'base64',
//         (err) => {
//           if (err) {
//             throw err;
//           }
//           res.status(200).send({
//             message: 'Success: File Delivered:\n'
//             // fullResponse: callback,
//             // imageAsBase64Array: imageAsBase64Array,
//             // imageAsUtf8: imageAsUtf8
//           });
//         });
//     }
//   });
// };
//
//
//
// exports.deleteImageByImageId = (req, res) => {
//
// };
//
//
//
// // exports.testWysiwyg = (req, res) => {
// //   console.log('\n\n\nreq.body.data.files.file\n', req.body.data.files.file);
// //   console.log('\n\n\nreq.body.data.files.file[0].path\n', req.body.data.files.file[0].path);
// //   // res.send({ link: 'http://lorempixel.com/g/400/200/' });
// //   res.send({ link: req.body.data.files.file[0].path });
// // };
