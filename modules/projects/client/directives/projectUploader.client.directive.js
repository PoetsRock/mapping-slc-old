'use strict';

angular.module('projects').directive('projectUploaderDirective', function () {
  return {
    restrict: 'AE',
    templateUrl: '/modules/projects/client/directives/views/projectUploader.html',
    controller: function ($scope, $http, Authentication) {

      // // Project Uploader Service logic
      //
      // $scope.user = Authentication.user;
      // $scope.uploading = false;
      // var upload = null;
      //
      //
      // $scope.projectUpload = function (files) {
      //   //todo (1) change server function to default images to generic file names -- for user: `uploaded-profile-image.jpg` ... for projects: something like `uploaded-main-project-image.jpg`
      //   //todo (2) set public read permissions on images
      //   ///todo (3) file optimization
      //
      //   if (files.length > 1) {
      //
      //     for (var i = 0; files.length > i; i++) {
      //
      //       $scope.uploading = true;
      //       var filename = files[i].name;
      //       var type = files[i].type;
      //       var query = {
      //         projectId: '',
      //         user: $scope.user,
      //         filename: filename,
      //         type: type
      //       };
      //
      //       console.log('query:::\n', query);
      //       // $http.post('api/v1/projects/'+ query.project._id +'/s3/upload', query)
      //       $http.post('api/v1/projects/s3/upload', query)
      //         .success(function (result) {
      //           console.log('file name: ', filename, '\nfile ' + [i] + ' of ' + files.length);
      //           console.log('\nresult v1,\n', result, '\n\n');
      //           Upload.upload({
      //               url: result.url, //s3Url
      //               transformRequest: function (data, headersGetter) {
      //                 var headers = headersGetter();
      //                 delete headers.Authorization;
      //                 console.log('data v1\n', data);
      //                 return data;
      //               },
      //               fields: result.fields, //credentials
      //               method: 'POST',
      //               file: files[i]
      //             })
      //             .progress(function (evt) {
      //               console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
      //             })
      //             .success(function (data, status, headers, config) {
      //               var s3Result = xmlToJSON.parseString(data);   // parse
      //               // file is uploaded successfully
      //               $scope.uploading = false;
      //               console.log('s3Result:::\n', s3Result);
      //               console.log('status: ', status);
      //               console.log('The file ' + config.file.name + ' is uploaded successfully.\nResponse:\n', s3Result);
      //
      //               $scope.user.profileImageURL = 'https://s3.amazonaws.com' + s3Result.PostResponse[0].Bucket[0]._text + '/' + s3Result.PostResponse[0].Key[0]._text;
      //
      //               console.log('https://s3.amazonaws.com' + s3Result.PostResponse[0].Bucket[0]._text + '/' + s3Result.PostResponse[0].Key[0]._text);
      //               console.log('$scope.user.profileImageURL final:\n', user.profileImageURL);
      //             });
      //         })
      //         .error(function (data, status, headers, config) {
      //           // called asynchronously if an error occurs
      //           // or server returns response with an error status.
      //           $scope.uploading = false;
      //         });
      //
      //     }
      //   }
      // };


    }

  }
});
