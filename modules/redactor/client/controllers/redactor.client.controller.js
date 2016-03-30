'use strict';

//Angular Redactor controller
angular.module('angular-redactor').controller('RedactorController', ['$scope', '$stateParams', 'Authentication', '$http', 'AdminAuthService',
  function ($scope, $stateParams, Authentication, $http, AdminAuthService) {

    $scope.authentication = Authentication;
    $scope.isAdmin = AdminAuthService;
    
    $scope.redactorOptions = { };

    $scope.files;



    $scope.changeContent = function () {
      $scope.content = "<h1>Some bogus content</h1>"
    };
    
    $scope.content = "<p>This is my awesome content</p>";




















    $scope.user = Authentication.user;
    $scope.uploading = false;
    $scope.imageURL = $scope.user.profileImageURL;
    var upload = null;

    //todo (1) change server function to default images to generic file names -- for user: `uploaded-profile-image.jpg` ... for projects: something like `uploaded-main-project-image.jpg`
    //todo (2) set public read permissions on images
    ///todo (3) file optimization
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
              console.log('s3Result:::\n', s3Result);
              console.log('status: ', status);
              console.log('The file ' + config.file.name + ' is uploaded successfully.\nResponse:\n', s3Result);


              $scope.user.profileImageURL = 'https://s3.amazonaws.com' + s3Result.PostResponse[0].Bucket[0]._text +'/' + s3Result.PostResponse[0].Key[0]._text;

              console.log('https://s3.amazonaws.com' + s3Result.PostResponse[0].Bucket[0]._text +'/' + s3Result.PostResponse[0].Key[0]._text);
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





    var query = {
      user: $scope.user
      // filename: filename,
      // type: type
    };




  }
]);
