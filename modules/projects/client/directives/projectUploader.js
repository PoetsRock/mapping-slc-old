'use strict';

//noinspection JSAnnotator
angular.module('projects').directive('projectUploader', function () {
  return {
    restrict: 'AE',
    templateUrl: '/modules/projects/client/directives/views/project-uploader.html',
    controller: function ($scope, $timeout, $window, Authentication, Upload, $http) {
      $scope.user = Authentication.user;
      $scope.imageURL = $scope.user.profileImageURL;
      $scope.uploading = false;
      $scope.uploadBtnText = 'Select Files';


      $scope.imageUpload = function (bucket, bucketId, files) {
        bucketId = bucketId || $scope.project._id;
        if (files.length > 0) {
          $scope.uploading = true;
          // $scope.uploadBtnText = 'Add More Files';
          var data = {
            filename: files[0].name,
            size: files[0].size,
            type: files[0].type,
            aclLevel: 'public-read',
            isDefaultImage: files[0].isDefaultImage || false,
            tags: files[0].tags || [],
            user: $scope.user,
            bucket: bucket,
            bucketId: bucketId
          };

          Upload.upload({
            url: 'api/v1/' + bucket + '/' + bucketId + '/images',
            method: 'POST',
            data: data, // (meta-)data to be sent along with files
            file: files[0]
          })
          .then(function(resp) {
            // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            console.log('response:\n', resp);
            console.log('files #0:\n', files);
            console.log('$scope.files #1:\n', $scope.files);
            // console.log('$scope.files.length #1:\n', $scope.project.files.length);
            // delete $scope.project.files;

            $scope.uploading = false;
            // var index = resp.data.response.imageGallery.length - 1;
            // $scope.project.imageGallery.push(resp.data.response.imageGallery[index]);
            // console.log('resp.data.response.imageGallery[index]:\n', resp.data.response.imageGallery[index]);
            console.log('$scope.uploading: ', $scope.uploading);
            // console.log('$scope.files #2:\n', $scope.project.files);
          }, function (resp) {
            $scope.uploading = false;
            console.log('Error status: ' + resp.status);
          }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
          });
        }
      };

    }
  }
});
