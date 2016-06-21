'use strict';

angular.module('admins').directive('projectImagesAdminUpload', function () {
  return {
    restrict: 'EA',
    templateUrl: '/modules/admins/client/directives/views/project-images-admin-upload.html',
    controller: function ($scope, $http, Authentication) {
      $scope.user = Authentication.user;
      $scope.uploading = false;
      $scope.uploadBtnText = 'Select Files';

      // fileReader.onload = function (event) { }; // event listener options for future use
      // fileReader.onprogress = function(event) { }; // event listener options for future use

      var fileReader = new FileReader();
      $scope.adminFileReaderNg = function (fileArray) {
        $scope.previewFiles = fileArray;
        if($scope.previewFiles.length > 0) { $scope.uploadBtnText = 'Select More Files'; }

        console.log('fileArray[0]:\n', fileArray[0]);

        // var imageAsText = fileReader.readAsText(fileArray[0]);

        /// var imageDataUrl = fileReader.readAsDataURL(fileArray[0]);
        // console.log('imageDataUrl:\n', imageDataUrl);

        fileReader.readAsArrayBuffer(fileArray[0]);

        fileReader.onloadend = function (event) {

          var fileAsArrayBuffer = event.target.result;
          console.log('fileAsArrayBuffer:\n', fileAsArrayBuffer);
          // $scope.uploadAdminImagesV2('projects', fileArray[0], event.target.result);
          $scope.uploadAdminImagesV2('projects', fileArray[0], fileAsArrayBuffer);
        };
      };

      $scope.uploadAdminImagesV2 = function (bucket, fileData, files) {
        $scope.uploading = true;
        var fileTags = [$scope.project.title, $scope.project.user.firstName + ' ' + $scope.project.user.lastName, $scope.project.keywords];
        fileData.tags = [];
        fileData.tags.push(fileTags);

        var headersData = {
          file: fileData,
          size: fileData.size,
          originalFilename: fileData.name,
          type: fileData.type,
          user: $scope.user,
          isDefaultImage: fileData.isDefaultImage || false,
          tags: fileData.tags || [],
          bucket: bucket,
        };
        var url = `api/v1/${bucket}/${$scope.project._id}/files`;
        var configObj = {
          method: 'POST',
          url: url,
          headers: {
            'Content-Type': headersData.type,
            'Size': headersData.size,
            'File-Name': headersData.originalFilename,
            'Default-Image': headersData.isDefaultImage,
            'Tags': headersData.tags,
            'Bucket': headersData.bucket
          },
          data: files,
          transformRequest: []
        };

        $http(configObj)
        .then(function successCallback(result) {
          $scope.uploading = false;
          $scope.uploadBtnText = 'Select Files';
          $scope.files = [];

          //todo need to set image on front end  !!  !!
          // call watch?  add to scope?
          console.log('result v1\n', result);
        }, function errorCallback(rejected) {
          $scope.uploading = false;
          $scope.files = [];
          $scope.uploadBtnText = 'Select Files';
          console.log('error on upload:\n', rejected);
          console.log('error ``$scope.files`:\n', $scope.files);
        });
      };

      $scope.removePreviewImage = function(hashKey) {
        console.log('hashKey: ', hashKey);

        function indexLookUp(element, index, array) {
          array.find(function(image) {
            console.log('find image: ', image);
            if(image.$$hashKey === hashKey) { return index }
          });
        }

        var imageIndex = $scope.previewImages.findIndex(indexLookUp);
        console.log('imageIndex: ', imageIndex);
      };


    }
  };
});