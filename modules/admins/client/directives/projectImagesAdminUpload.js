'use strict';

angular.module('admins').directive('projectImagesAdminUpload', function () {
  return {
    restrict: 'EA',
    templateUrl: '/modules/admins/client/directives/views/project-images-admin-upload.html',
    controller: function ($scope, $http, Authentication, Upload, $timeout) {
      $scope.user = Authentication.user;
      $scope.uploading = false;
      $scope.uploadBtnText = 'Select Files';

      var checkArrayBuffer = function (files) {
        $scope.arrayBufferCheck = _.isArrayBuffer(files);
      };

      /**
       * `$scope.adminFileReaderNg` reads files uploaded by user
       *
       * @param fileArray {array}
       *
       * `fileArray` is which ever property the files belong to.
       * for example, if they are document files, then the function would be passed
       * `$scope.project.fileUrls` as the argument; if images, then `$scope.project.imageGallery`
       * or `$scope.project.imageGalleryThumbnailUrls`

       `fileReader` can read the contents of a blob in 3 ways, as an ArrayBuffer, DataUrl, Text. E.g. (where `fileArray[0]` is a blob):
         fileReader.readAsArrayBuffer(fileArray[0]);
         fileReader.readAsDataURL(fileArray[0]);
         fileReader.readAsText(fileArray[0]);

       * The 3 methods on `fileReader` can be used with event listeners as well. In this case, the object `reader.result` contains the contents of blob as a "typed array".
       * Below is an example:
          fileReader.addEventListener('loadend', function() {
            // `reader.result` contains the contents of blob as a "typed array"
            console.log('reader.result: ', fileReader.result);
            console.log('reader.readyState: ', fileReader.readyState);
            console.log('reader.error: ', fileReader.error);
          });
       *
       */
      var fileReader = new FileReader();
      $scope.adminFileReaderNg = function (fileArray) {
        $scope.previewFiles = fileArray;
        if($scope.previewFiles.length > 0) { $scope.uploadBtnText = 'Select More Files'; }

        /** whichever of the three methods below is uncomment represents the format of what will be returned in `fileReader.result` when the `onload` event fires
         * fileReader.onloadend `event.target.result` === fileReader.onload `fileReader.result`
         */
        // $scope.fileAsArrayBuffer = fileReader.readAsArrayBuffer(fileArray[0]);
        fileReader.readAsDataURL(fileArray[0]);
        // fileReader.readAsText(fileArray[0]);

        fileReader.onload = function (event) {
          // console.log('onload::: var `event`: ' + event);
          // console.log('onload:::  var `fileReader.result`:\n', fileReader.result);
          // console.log('LOAD :: fileArray[0]\n', fileArray[0]);
          // $scope.uploadAdminImagesV2('projects', $scope.files, fileReader.result);
        };
        fileReader.onprogress = function(event) {
          // console.log('progress :: var `event`:\n', event);
        };
        // A callback, onloadend, is executed when the file has been read into memory, the data is then available via the result field.
        fileReader.onloadend = function (event) {
          // console.log('onloadend :: var `event`:\n', event);
          // console.log('fileReader.onloadend:: `event.target.result`:\n', event.target.result);
          // console.log('END :: fileArray[0]\n', fileArray[0]);
          // checkArrayBuffer(event.target.result);
          $scope.uploadAdminImagesV2('projects', fileArray[0], event.target.result);
        };
      };


          // todo: if this method doesn't work (with putting the file info in the headers), then here are 2 other thoughts for getting this working:
          // #1 try another data type for uploading to back end -- so, not ArrayBuffer; rather `readDataAsUrl` or `readDataAsText`
          // #2 try calling the entire upload function inside of the fileReader.onload method, per stackoverflow example

          //from directive in projects module used in create project html
      $scope.uploadAdminImagesV2 = function (bucket, fileData, files) {
        // console.log('uploadAdminImagesV2 ::::::   fileData\n', fileData);
        // console.log('uploadAdminImagesV2 ::::::   files\n', files);
        // console.log('uploadAdminImagesV2 ::::::   $scope.fileAsArrayBuffer\n', $scope.fileAsArrayBuffer);
        // console.log('uploadAdminImagesV2 ::::::   $scope.previewFiles\n', $scope.previewFiles);
        // console.log('arrayBufferCheck: ', _.isArrayBuffer(files));


        fileData.tags = [];
        var fileTags = [$scope.project.title, $scope.project.user.firstName + ' ' + $scope.project.user.lastName, $scope.project.keywords];
        fileData.tags.push(fileTags);
        console.log('fileData', fileData);
        console.log('files', files);
        $scope.uploading = true;
        // var file = files[0];
        // var file = files;

        var bodyData = new Uint8Array(files) || null;

        var headersData = {
          file: fileData,
          size: fileData.size,
          originalFilename: fileData.name,
          type: fileData.type,
          isDefaultImage: fileData.isDefaultImage || false,
          tags: fileData.tags || [],
          bucket: bucket,
        };
        // if (bucket === 'projects') {
        headersData.user = $scope.user;
        // }
        var url = `api/v1/${bucket}/${$scope.project._id}/files`;

        // console.log('headersData\n', headersData);
        // console.log('bodyData\n', bodyData);
        // console.log('headersData.fileArrayBuffer\n', headersData.fileArrayBuffer);
        // console.log('arrayBufferCheck #2: ', _.isArrayBuffer(bodyData));
        // console.log('bufferCheck #1: ', _.isBuffer(bodyData));

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
          // data: bodyData,
          data: files,
          transformRequest: []
        };

        // console.log('configObj.data\n', configObj.data);

        $http(configObj)
        // $http.post(url, query)
        .then(function successCallback(result) {
          $scope.uploading = false;
          $scope.uploadBtnText = 'Select Files';
          console.log('success ::  `$scope.files`\n', $scope.files);
          $scope.files = [];
          console.log('success ::  `$scope.files`  v2222\n', $scope.files);
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

      // files.forEach(function(file) {
      //   var query = { filename: files[0].name, type: files[0].type, bucket: bucket };
      //   if (bucket === 'projects') { query.user = $scope.user; }
      //   $http.post('api/v1/' + bucket + '/' + bucketId + '/images', query)
      //   .then(function (result) {
      //     console.log('result v1\n', result);
      //     $scope.uploading = false;
      //     $scope.uploadBtnText = 'Select Files';
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
      //     $scope.uploadBtnText = 'Select Files';
      //   });
      // });

    }
  };
});
