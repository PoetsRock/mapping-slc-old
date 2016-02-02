'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'Upload', '$http', 'ProfileImageService',
  function ($scope, $timeout, $window, Authentication, Upload, $http, ProfileImageService) {

    $scope.init = function () {
      ProfileImageService.getUploadedProfilePic();
    };

    //// Create a new cache with a capacity of 10
    //var lruCache = $cacheFactory('lruCache', { capacity: 10 });

    $scope.user = Authentication.user;
    $scope.uploading = false;
    $scope.imageURL = $scope.user.profileImageURL;
    var upload = null;


    $scope.onFileSelect = function (files) {

      if (files.length > 0) {
        $scope.uploading = true;
        var filename = files[0].name;
        var type = files[0].type;
        var query = {
          user: $scope.user,
          filename: filename,
          type: type
        };
        var configObj = { cache: true };
        $http.post('api/v1/s3/upload', query, configObj)
          .success(function (result) {
            console.log('result v1\n', result);
            Upload.upload({
              url: result.url, //s3Url
              transformRequest: function (data, headersGetter) {
                var headers = headersGetter();
                delete headers.Authorization;
                console.log('data v1\n', data);
                return data;
              },
              fields: result.fields, //credentials
              method: 'POST',
              file: files[0]
            }).progress(function (evt) {

              console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));

            }).success(function (data, status, headers, config) {

              var s3Result = xmlToJSON.parseString(data);   // parse

              // file is uploaded successfully
              $scope.uploading = false;
              console.log('status: ', status);
              console.log('The file ' + config.file.name + ' is uploaded successfully.\nResponse:\n', s3Result);

              $scope.imageURL = 'https://s3-us-west-1.amazonaws.com/mapping-slc-file-upload/' + s3Result.PostResponse[0].Key[0]._text;

              console.log('$scope.imageURL 111:\n', $scope.imageURL);


            }).error(function () {

            });


            if (result && result.s3Url) {
              console.log('result v3452\n', result);
              $scope.user.profileImageURL = result.s3Url;
              $scope.imageURL = result.s3Url;
            }
          })
          .error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.uploading = false;
          });

        ////abort request
        //  .xhr(function(xhr) {
        //    $scope.abort = function() {
        //    xhr.abort();
        //    $scope.uploading = false;
        //  };
        //});

      }


    };


    /**
     *
     * @param requestType {string} - the requestType specifies what type of files are being uploaded...
     *    for example, 'profile-image' is passed in when the content is for a user's profile image.
     * @param files {object} a Blob that contains the file(s) to upload
     */
      //$scope.onFileSelect = function (files, requestType) {
    $scope.onFileSelectNEW = function (files) {
      //if (files.length > 0) {
      $scope.uploading = true;

      console.log('files:\n', files[0]);
      console.log('files:\n', files[0].File);

      var fileType = files[0].type;
      if (fileType === 'image/jpeg') {
        fileType = '.jpg'
      } else if (fileType === 'image/png') {
        fileType = '.png'
      }
      var fileName = '';
      //hard coded for now ... later will refactor to take multiple use cases
      var requestType = 'profile-image';

      if (requestType === 'profile-image') {
        fileName = {
          origFileName: files[0].name.replace(/\s/g, '_'), //substitute all whitespace with underscores
          fileName: 'uploaded-profile-image' + fileType
        };
      }

      var query = {
        user: $scope.user,
        fileName: fileName.fileName,
        origFileName: fileName.origFileName,
        type: files[0].type
      };

      console.log('fileType:\n', fileType);
      console.log('query:\n', query);

      $http.post('api/v1/s3/upload/media/photo', query)
        .then(function (result) {

          console.log('result:\n', result);
          console.log('result.data:\n', result.data);
          console.log('result.status:\n', result.status);
          console.log('result.config:\n', result.config);

          /**
           Specify the file and optional data to be sent to the server.
           Each field including nested objects will be sent as a form data multipart.
           Samples:

           {pic: file, username: username}
           {files: files, otherInfo: {id: id, person: person,...}} multiple files (html5)
           {profiles: {[{pic: file1, username: username1}, {pic: file2, username: username2}]} nested array multiple files (html5)
           {file: file, info: Upload.json({id: id, name: name, ...})} send fields as json string
           {file: file, info: Upload.jsonBlob({id: id, name: name, ...})} send fields as json blob
           {picFile: Upload.rename(file, 'profile.jpg'), title: title} send file with picFile key and profile.jpg file name
         **/


            //upload to back end
          upload = Upload.upload({
              url: result.config.url, //s3Url
              //transformRequest: function (data, headersGetter) {
              //  var headers = headersGetter();
              //  delete headers.Authorization;
              //  console.log('data v1\n', data);
              //  return data;
              //},
              //info: Upload.jsonBlob({id: id, name: name}),
              file: files[0],
              //data: {
              //  file: files,
              //  picFile: Upload.rename(files, 'uploaded-profile-image.jpg')
              //},
              //fields: result.fields, //credentials
              method: 'POST'
            })
            .then(function (resp) {
              // file is uploaded successfully
              console.log('resp:\n', resp);
              var s3Result = xmlToJSON.parseString(resp.data);   // parse
              console.log('file ' + resp.config.data.file.name + 'is uploaded successfully. Response: ' + s3Result);
              console.log('status: ', resp.status);
              $scope.uploading = false;
              ProfileImageService.getUploadedProfilePic();
            }, function (resp) {
              // handle error
            }, function (evt) {
              //var s3Result = xmlToJSON.parseString(resp.data);
              console.log('evt:\n', evt);
              // progress notify
              console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + evt.config.data.file.name);
            });
          //upload.catch(errorCallback);
          //upload.finally(callback, notifyCallback);


          //  .progress(function (evt) {
          //    console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
          //  })
          //  .success(function (data, status, headers, config) {
          //    var s3Result = xmlToJSON.parseString(data);   // parse
          //    console.log('status: ', status);
          //    console.log('The file ' + config.file.name + ' is uploaded successfully.\nResponse:\n', s3Result);
          //    $scope.uploading = false;
          //    ProfileImageService.getUploadedProfilePic();
          //  })
          //  .error(function () {
          //
          //  });
          //})
          //.error(function (data, status, headers, config) {
          //  // called asynchronously if an error occurs
          //  // or server returns response with an error status.
          //  $scope.uploading = false;
          //});
        });
      //.catch(err)
      //.finally(callback, notifyCallback);
    };
    //};


    /* cancel/abort the upload in progress. */
    $scope.abort = function () {
      console.log('abort!!!');
      upload.abort();
      $scope.uploading = false;
    };


    $scope.getProfilePic = function () {

    };


  }
]);
