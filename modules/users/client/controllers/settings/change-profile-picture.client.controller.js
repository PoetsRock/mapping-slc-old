'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'Upload', '$http',
  function ($scope, $timeout, $window, Authentication, Upload, $http) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;
    $scope.uploading = false;

    $scope.onFileSelect = function(files) {

      if (files.length > 0) {
        $scope.uploading = true;
        var filename = files[0].name;
        var type = files[0].type;
        var query = {
          filename: filename,
          type: type
        };
        //cache: true
        $http.post('api/v1/s3/upload', query)
          .success(function(result) {
            Upload.upload({
              url: result.url, //s3Url
              transformRequest: function(data, headersGetter) {
                var headers = headersGetter();
                delete headers.Authorization;
                return data;
              },
              fields: result.fields, //credentials
              method: 'POST',
              file: files[0]
            }).progress(function(evt) {
              console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {
              // file is uploaded successfully
              $scope.uploading = false;
              console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
              // need to set image on front end
              //$scope.imageURL = $scope.user.profileImageURL = data;

                $http({
                  url: '',
                  method: 'PUT'
                })
                  .then(function(data) {

                  })
                  .finally(function(data) {

                  });

              // and need to update mongodb


            }).error(function() {

            });
          })
          .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.uploading = false;
          })

          .xhr(function(xhr) {
            $scope.abort = function() {
            xhr.abort();
            $scope.uploading = false;
          };
        });

      }


    };


  }
]);
