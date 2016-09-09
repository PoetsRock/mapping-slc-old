'use strict';

angular.module('admins').directive('projectImages', function () {
  return {
    restrict: 'E',
    templateUrl: '/modules/admins/client/directives/views/project-images.html',
    controller: function ($scope, $http, notify, Authentication, Upload) {
      $scope.user = Authentication.user;
      $scope.uploadBtnText = 'Select Files';
      $scope.editImages = false;


      $scope.setDefaultImage = function (imageNull, index) {
        $scope.project.imageGallery.find(function(image, currentIndex) {
          if(image.isDefaultImage) {
            $scope.project.imageGallery[currentIndex].isDefaultImage = false;
          }
        });
        $scope.project.imageGallery[index].isDefaultImage = true;
        var updatedFields = {
          imageGallery: $scope.project.imageGallery,
          mainImage: $scope.project.imageGallery[index]
        };
        return $http.patch('/api/v1/projects/' + $scope.project._id + '/images?setDefaultImage=true', updatedFields)
        .then(function successCallback() {
          notify({
            message: 'Default image has been updated',
            classes: 'ng-notify-contact-success'
          })
        }, function errorCallback(reject) {
          console.error('ERROR: Image was not deleted `reject`:\n', reject);
          notify({
            message: 'Error updating default image',
            classes: 'ng-notify-contact-failure'
          });
        });
      };


      $scope.deleteImageById = function (image, index) {
        return $http.delete('/api/v1/projects/' + $scope.project._id + '/images/' + image.imageId, image)
        .then(function successCallback() {
        //   function find(element, index) {
        //     if(element.imageId === imageData.imageId) return index;
        //   }
        //   var index = $scope.project.imageGallery.findIndex(find);
          // $scope.$watch('project.imageGallery', function (newValue, oldValue, scope) {
          $scope.project.imageGallery.splice(index, 1);
          // }, true); // sets objectEquality parameter in order to perform a deep watch on the array

        }, function errorCallback(reject) {
          console.error('ERROR: Image was not deleted `reject`:\n', reject);
        });
      };

      $scope.imageUpload = function (bucket, bucketId, files) {
        bucketId = bucketId || $scope.project._id;
        if ($scope.project.imageGallery.length === 0  || !$scope.project.mainImage.imageUrl) {
          files[0].isDefaultImage = true;
        }

        console.log('$scope.uploading ###111: ', $scope.uploading);
        $scope.uploading = true;
        console.log('$scope.uploading ###222: ', $scope.uploading);

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
        .then(function successCb(resp) {
          var index = resp.data.response.imageGallery.length - 1;
          $scope.project.imageGallery.push(resp.data.response.imageGallery[index]);
          $scope.files.pop();
          $scope.uploading = false;

          if ($scope.project.imageGallery.length === 0 || !$scope.project.mainImage.imageUrl) {
            $scope.project.mainImage = $scope.project.imageGallery[0];
            console.log('$scope.project.mainImage:\n', $scope.project.mainImage);
          }

        }, function errorCb(err) {
          $scope.uploading = false;
          console.log('Error status: ' + err.status);
          }, function (evt) {
            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.file.name);
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
