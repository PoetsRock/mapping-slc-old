'use strict';

angular.module('admins').directive('projectImagesAdminUpload', function () {
  return {
    restrict: 'EA',
    templateUrl: '/modules/admins/client/directives/views/project-images-admin-upload.html',
    controller: function ($scope, $http, Authentication, Upload) {
      $scope.user = Authentication.user;
      $scope.uploading = false;
      $scope.uploadBtnText = 'Select Files';

      $scope.imageUpload = function (bucket, bucketId, files) {
        bucketId = bucketId || $scope.project._id;
        if ($scope.project.imageGallery.length === 0) {
          files[0].isDefaultImage = true
        }

        $scope.uploading = true;
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
        .then(function (resp) {
          delete $scope.files;
          $scope.uploading = false;
          var index = resp.data.response.imageGallery.length - 1;
          $scope.project.imageGallery.push(resp.data.response.imageGallery[index]);
        }, function (resp) {
          $scope.uploading = false;
          console.log('Error status: ' + resp.status);
        }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
      };

      $scope.removePreviewImage = function (hashKey) {
        console.log('hashKey: ', hashKey);

        function indexLookUp(element, index, array) {
          array.find(function (image) {
            console.log('find image: ', image);
            if (image.$$hashKey === hashKey) {
              return index
            }
          });
        }

        var imageIndex = $scope.previewImages.findIndex(indexLookUp);
        console.log('imageIndex: ', imageIndex);
      };


    }
  };
});
