'use strict';

angular.module('users').directive('changeProfilePicture', function () {
  return {
    restrict: 'EA',
    templateUrl: 'modules/users/client/directives/views/change-profile-picture.html',
    controller: function($scope, Upload) {

      $scope.uploading = false;

      $scope.imageUpload = function (bucket, bucketId, files) {
        $scope.uploading = true;
        console.log('files[0]:\n', files[0]);
        bucketId = bucketId || $scope.user._id;
        $scope.uploading = true;
        var data = {
          filename: files[0].name,
          size: files[0].size,
          type: files[0].type,
          aclLevel: 'public-read',
          bucket: bucket,
          bucketId: bucketId
        };
        console.log('data:\n', data);
        Upload.upload({
          url: 'api/v1/' + bucket + '/' + bucketId + '/images',
          method: 'POST',
          data: data, // (meta-)data to be sent along with file
          file: files[0]
        })
        .then(function(resp) {
          console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
          console.log('resp:\n', resp);
          $scope.uploading = false;
          console.log('resp.data.response:\n', resp.data.response);
          $scope.files = [];
          $scope.user.profileImage.thumbImageUrl = resp.data.response.profileImage.thumbImageUrl;
        }, function (resp) {
          $scope.uploading = false;
          console.log('Error status: ' + resp.status);
        }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
      };


    }
  };
});
