'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'Upload', '$http',
  function ($scope, $timeout, $window, Authentication, Upload, $http) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;
    $scope.uploading = false;
    console.log('$scope.user :\n', $scope.user);

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
        var configObj = {cache: true};
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

    //$scope.user.profileImageURL
    $scope.getProfilePic = function () {
      ////first, check if image is cached
      //if('modules/users/client/img/profile/uploads/coffee_n_chris.jpg'){
      //  //get cached image
      //} else {
      //
      //}
      $http({
        url: '/api/v1/users/' + $scope.user._id + '/picture/' + $scope.user.profileImageFileName,
        method: 'GET',
        cache: true
      })
        .then(function (data, status, headers, config, statusText) {
          console.log(data);
          console.log('config:\n', config);
          console.log('statusText:\n', statusText);
          console.log('data.data.Body.data:\n', data.data.Body.data);
          $scope.imageURL = data.data.Body.data;
        })

    }

  }
]);
