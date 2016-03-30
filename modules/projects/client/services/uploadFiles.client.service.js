// 'use strict';
//
// angular.module('projects').factory('uploadFilesService', ['$http', 'Authentication', Upload,
//   function ($http, Authentication, Upload) {
//
//     var user = Authentication.user;
//
//
//     /**
//      * uploads images from create project form
//      * @param project
//      * @param file
//      */
//
//
//
//     // var upload = Upload.upload({
//     //    *url: 'server/upload/url', // upload.php script, node.js route, or servlet url
//
//
//
//
//
//     // Project Uploader Service logic
//
//     $scope.uploadPic = function(project, file) {
//       console.log('`project`:\n', project);
//       console.log('`file`:\n', file);
//
//
//
//       /* Convert a single file or array of files to a single or array of base64 data url representation of the file(s).  Could be used to send file in base64 format inside json to the databases */
//       Upload.base64DataUrl(files)
//         .then(function(urls){
//
//         });
//
//       /* Convert the file to blob url object or base64 data url based on boolean disallowObjectUrl value */
//       Upload.dataUrl(file, boolean)
//         .then(function(url){
//
//         });
//
//       /*
//        alternative way of uploading, send the file binary with the file's content-type.
//        Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
//        This is equivalent to angular $http() but allow you to listen to the progress event for HTML5 browsers.*/
//       var fileReader = new FileReader();
//       var altUpload = Upload.http({
//         url: '/api/v1/projects/' + project._id  + '/s3/upload',
//         headers : {
//           'Content-Type': file.type
//         },
//         data: file
//       });
//
//       altUpload.then(function (response) {
//         $timeout(function () {
//           file.result = response.data;
//           console.log('inside of promise: `file`:\n', file);
//           console.log('inside of promise: `response`:\n', response);
//           console.log('inside of promise: `file.result`:\n', file.result);
//         });
//       }, function (response) {
//         if (response.status > 0)
//           $scope.errorMsg = response.status + ': ' + response.data;
//       }, function (evt) {
//         // Math.min is to fix IE which reports 200% sometimes
//         file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
//       });
//
//
//       //normal upload
//       var upload = Upload.upload({
//         // url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
//         url: '/api/v1/projects/' + project._id  + '/s3/upload',
//         data: {project: project, file: file},
//         method: 'PUT' //'POST' or 'PUT'(html5), default POST
//       });
//
//
//       upload.then(function (response) {
//         $timeout(function () {
//           file.result = response.data;
//           console.log('inside of promise: `file`:\n', file);
//           console.log('inside of promise: `response`:\n', response);
//           console.log('inside of promise: `file.result`:\n', file.result);
//         });
//       }, function (response) {
//         if (response.status > 0)
//           $scope.errorMsg = response.status + ': ' + response.data;
//       }, function (evt) {
//         // Math.min is to fix IE which reports 200% sometimes
//         file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
//       });
//     };
//
//
//
//     return {
//
//       uploadFiles: function (project, files, callback) {
//       var err = {};
//       var fileInfo = { };
//
//         //do code
//
//       //call return to return value
//       return callback(err, fileInfo);
//     }
//
//   }
//
//   }
// ]);
