'use strict';

angular.module('users').controller('ProfilePictureController', ['$scope', 'Authentication', 'Upload', '$http', 'ProfileImageService',
  function ($scope, Authentication, Upload, $http, ProfileImageService) {
    
    $scope.user = Authentication.user;
    $scope.uploading = false;
    // $scope.imageURL = $scope.user.profileImageURL;
    var upload = null;
    $scope.newProfileImage = {};
    
    
    $scope.init = function () {
      if (!$scope.user.profileImageUrl) {
        $scope.uploadBtnText = 'Upload Photo'
      }
      $scope.uploadBtnText = 'Update Photo';
      // ProfileImageService.getUploadedProfilePic(Authentication,
      //   function (image, err) {
      //     $scope.user.profileImageUrl = image;
      //   });
      console.log('$scope.user\n', $scope.user);
      console.log('$scope.user.profileImageUrl\n', $scope.user.profileImageUrl);
    };
    
    /**
     * hits back end route that calls `getS3File()`
     *
     * `getS3File()` requires userId and user image file name, both passed in the route params
     *
     **/
    $scope.getImage = function () {
      $http.get('/api/v1/users/' + $scope.user._id + '/images/' + $scope.user.profileImageFileName, { cache: true })
      .then(function (image) {
        $scope.image = image;
        return console.log('image from `change-profile-picture.controller.client.controller.js`:\n', image, '\n\n');
      })
      .catch(function (err) {
        return console.log('ERROR IN CHANGE-PROFILE CONTROLLER\nerr in getting image:\n', err, '\n\n');
      });
    };
    
    
    var fileReader = new FileReader();
    
    $scope.profileImageFileReader = function (fileArray) {
      $scope.previewFile = fileArray[0];
      
      fileReader.readAsDataURL(fileArray[0]);
      fileReader.onload = function (event) {
        // console.log('onload::: var `event`: ' + event);
        // console.log('onload:::  var `fileReader.result`:\n', fileReader.result);
        // console.log('LOAD :: fileArray[0]\n', fileArray[0]);
      };
      fileReader.onprogress = function (event) {
        console.log('progress :: var `event`:\n', event);
      };
      // A callback, onloadend, is executed when the file has been read into memory, the data is then available via the result field.
      fileReader.onloadend = function (event) {
        console.log('event:\n', event, '\n\n\n\n\n');
        console.log('fileArray[0]:\n', fileArray[0], '\n\n\n\n\n\n\n\n');
        console.log('event.target.result:\n', event.target.result);
        $scope.uploadUserProfileImage('users', fileArray[0], event.target.result);
      };
    };
    
    
    $scope.uploadUserProfileImage = function (bucket, fileData, files) {
      $scope.uploading = true;
      var fileTags = [$scope.user._id, $scope.user.lastName + ', ' + $scope.user.firstName, 'profile image'];
      fileData.tags = [];
      fileData.tags.push(fileTags);
      
      var headersData = {
        file: fileData,
        size: fileData.size,
        originalFilename: fileData.name,
        type: fileData.type,
        user: $scope.user,
        isDefaultImage: fileData.isDefaultImage || false,
        tags: fileData.tags || [],
        bucket: bucket,
      };
      var url = `api/v1/${bucket}/${$scope.user._id}/images/profileImage`;
      var configObj = {
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': headersData.type,
          'Size': headersData.size,
          'File-Name': headersData.originalFilename,
          'Default-Image': headersData.isDefaultImage,
          'Tags': headersData.tags,
          'Bucket': headersData.bucket
        },
        data: files,
        transformRequest: []
      };
      
      $http(configObj)
      .then(function successCallback(result) {
        $scope.uploading = false;
        $scope.uploadBtnText = 'Select Files';
        $scope.files = [];
        
        //todo need to set image on front end  !!  !!
        // call watch?  add to scope?
        console.log('result v1\n', result);
      }, function errorCallback(rejected) {
        $scope.uploading = false;
        $scope.files = [];
        $scope.uploadBtnText = 'Select Files';
        console.log('error on upload:\n', rejected);
        console.log('error ``$scope.files`:\n', $scope.files);
      });
  
  
    };
      //   console.log('$scope.uploadUserProfileImage: ::: files:\n', files);
      //   console.log('$scope.uploadUserProfileImage: ::: files[0]:\n', files[0]);
      //   console.log('onFileSelect for uploading user profile image var `$scope.user._id`: ', $scope.user._id);
      //   var uploadParams = { bucket: 'users', bucketId: $scope.user._id };
      //  
      //   $scope.uploading = true;
      //   var filename = files[0].name;
      //   var type = files[0].type;
      //   var query = {
      //     bucketId: uploadParams.bucketId,
      //     filename: filename,
      //     type: type
      //   };
      //   console.log('files:::\n', files);
      //   console.log('query:::\n', query);
      //  
      //   $http.post('api/v1/' + uploadParams.bucket + '/' + query.bucketId + '/images', query)
      //   .success(function (result) {
      //     console.log('result v1\n', result);
      //     Upload.upload({
      //       url: result.url, //s3Url
      //       transformRequest: function (data, headersGetter) {
      //         var headers = headersGetter();
      //         delete headers.Authorization;
      //         console.log('data v1\n', data);
      //         return data;
      //       },
      //       fields: result.fields, //credentials
      //       method: 'POST',
      //       file: files[0]
      //     }).progress(function (evt) {
      //       console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
      //     }).success(function (data, status, headers, config) {
      //       var s3Result = xmlToJSON.parseString(data);   // parse
      //       // file is uploaded successfully
      //       $scope.uploading = false;
      //       $scope.user.profileImageURL = 'https://s3-us-west-1.amazonaws.com/' + s3Result.PostResponse[0].Bucket[0]._text + '/' + s3Result.PostResponse[0].Key[0]._text;
      //     });
      //   })
      //   .error(function (data, status, headers, config) {
      //     console.log('error!!!\n', data);
      //     // called asynchronously if an error occurs
      //     // or server returns response with an error status.
      //     $scope.uploading = false;
      //   });
      
      
    
    
    /** cancel/abort the upload in progress. */
    $scope.abort = function () {
      console.log('abort!!!');
      upload.abort();
      $scope.uploading = false;
    };
    
  }
]);
