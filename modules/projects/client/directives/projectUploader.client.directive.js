'use strict';

angular.module('projects').directive('projectUploaderDirective', function () {
  return {
    restrict: 'AE',
    templateUrl: '/modules/projects/client/directives/views/projectUploader.html',
    controller: function ($scope, $http) {


      // Project Uploader Service logic

      $scope.uploading = false;

      $scope.projectUpload = function (files) {

        if (files.length > 0) {
          $scope.uploading = true;
          var filename = files[0].name;
          var type = files[0].type;
          var query = {
            filename: filename,
            type: type,
            user: $scope.user,
            project: $scope.project
          };
          var configObj = { cache: true };
          $http.post('api/v1/s3/upload/project', query, configObj)
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

                // file is uploaded successfully
                $scope.uploading = false;

                console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);

                // need to set image on front end
                if (data && data.s3Url) {
                  console.log('data v2\n', data);
                  $scope.project.file = data.s3Url;
                }
                console.log('$scope.imageURL:\n', $scope.imageURL);


              }).error(function () {

              });

              if (result && result.s3Url) {
                console.log('result v2\n', result);
                $scope.user.profileImageURL = result.s3Url;
                $scope.imageURL = result.s3Url;
              }
            })
            .error(function (data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              $scope.uploading = false;
            });

          //  .xhr(function(xhr) {
          //    $scope.abort = function() {
          //    xhr.abort();
          //    $scope.uploading = false;
          //  };
          //});

        }

      }

    }

  }
});
