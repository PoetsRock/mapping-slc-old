'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'Upload', '$http', 'ProfileImageService',
  function ($scope, $timeout, $window, Authentication, Upload, $http, ProfileImageService) {

    $scope.init = function () {
      console.log('init me baby!');
      ProfileImageService.getUploadedProfilePic(Authentication,
        function(image, err) {
          console.log('image\n', image);
          console.log('err\n', err);
          $scope.user.profileImageURL = image;
        });
    };

    //// Create a new cache with a capacity of 10
    //var lruCache = $cacheFactory('lruCache', { capacity: 10 });

    $scope.user = Authentication.user;
    $scope.uploading = false;
    $scope.imageURL = $scope.user.profileImageURL;
    var upload = null;

    
    $scope.onFileSelect = function (files) {
      //todo (1) change server function to default images to generic file names -- for user: `uploaded-profile-image.jpg` ... for projects: something like `uploaded-main-project-image.jpg`
      //todo (2) set public read permissions on images
      ///todo (3) file optimization

      if (files.length === 1) {
        $scope.uploading = true;
        var filename = files[0].name;
        var type = files[0].type;
        var query = {
          user: $scope.user,
          filename: filename,
          type: type
        };
        console.log('files:::\n', files);
        console.log('query:::\n', query);
        $http.post('api/v1/user/'+ query.user._id +'/s3/upload', query)
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
              console.log('s3Result:::\n', s3Result);
              console.log('status: ', status);
              console.log('The file ' + config.file.name + ' is uploaded successfully.\nResponse:\n', s3Result);


              $scope.user.profileImageURL = 'https://s3-us-west-1.amazonaws.com/' + s3Result.PostResponse[0].Bucket[0]._text +'/' + s3Result.PostResponse[0].Key[0]._text;

              console.log('https://s3-us-west-1.amazonaws.com/' + s3Result.PostResponse[0].Bucket[0]._text +'/' + s3Result.PostResponse[0].Key[0]._text);
              console.log('$scope.user.profileImageURL final:\n', user.profileImageURL);
            });
          })
          .error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.uploading = false;
          });

      }
    };

    // $scope.image;
    /**
     * hits back end route that calls `getS3File()`
     *
     * `getS3File()` requires userId and user image file name, both passed in the route params
     *
     **/
    $scope.getImage = function() {
      console.log('$scope.user\n:', $scope.user, '\n\n');
      console.log('$scope.user.profileImageFileName  :', $scope.user.profileImageFileName);

      $http.get('/api/v1/users/' + $scope.user._id + '/images/' + $scope.user.profileImageFileName, {cache: true})
        .then(function(err, image) {
          if(err) {
            console.log('ERROR IN CHANGE-PROFILE CONTROLLER\nerr in getting image:\n', err, '\n\n');
            return;
          }
          $scope.image = image;
          console.log('image from `change-profile-picture.controller.client.controller.js`:\n', image, '\n\n');
        });
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

      $http.post('api/v1/users/'+ query.user._id +'/s3/upload', query)
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
