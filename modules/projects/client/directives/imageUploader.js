'use strict';

//noinspection JSAnnotator
angular.module('projects').directive('projectUploader', function () {
  return {
    restrict: 'AE',
    // scope: true,
    templateUrl: '/modules/projects/client/directives/views/project-uploader.html',
    controller: function ($scope, $timeout, $window, Authentication, Upload, $http) {
      $scope.user = Authentication.user;
      $scope.uploading = false;
      console.log('$scope.project:\n', $scope.project);
      console.log('$scope.project._id: ', $scope.project._id);
      $scope.imagesUploader = function (bucket, bucketId, files) {
        console.log('bucket: ', bucket);
        console.log('bucketId: ', bucketId);
        console.log('files\n', files);
        $scope.uploading = true;
        // files.forEach(function(file) {
        //   var query = { filename: files[0].name, type: files[0].type, bucket: bucket };
        //   if (bucket === 'projects') { query.user = $scope.user; }
        //   $http.post('api/v1/' + bucket + '/' + bucketId + '/images', query)
        //   .then(function (result) {
        //     console.log('result v1\n', result);
        //     $scope.uploading = false;
        //     // need to set image on front end
        //     if (result && result.s3Url) {
        //       console.log('result v2\n', result);
        //       $scope.user.profileImageURL = result.s3Url;
        //       $scope.imageURL = result.s3Url;
        //     }
        //   })
        //   .catch(function(err) {
        //     console.log('error on upload:\n', err);
        //     $scope.uploading = false;
        //   });
        // });
        var query = { file: files[0], filename: files[0].name, type: files[0].type, bucket: bucket };
        if (bucket === 'projects') { query.user = $scope.user; }
        console.log('api/v1/' + bucket + '/' + bucketId + '/images');
        console.log('query\n', query);
        $http.post('api/v1/' + bucket + '/' + bucketId + '/images', query)
          .then(function (result) {
            console.log('result v1\n', result);
            $scope.uploading = false;
            // need to set image on front end
            if (result && result.s3Url) {
              console.log('result v2\n', result);
              $scope.user.profileImageURL = result.s3Url;
              $scope.imageURL = result.s3Url;
            }
          })
          .catch(function(err) {
            console.log('error on upload:\n', err);
            $scope.uploading = false;
          });
      }
    
    
    }
  }
});
