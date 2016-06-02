'use strict';

angular.module('admins').directive('projectImagesAdminUpload', function () {
  return {
    restrict: 'EA',
    templateUrl: '/modules/admins/client/directives/views/project-images-admin-upload.html',
    controller: function($scope, $http, Authentication, Upload, $timeout) {

      // $scope.files = {};
        /**
       *
       * @param fileArray
       *
       * `fileArray` is which ever property the files belong to.
       * for example, if they are document files, then the function would be passed
       * `$scope.project.fileUrls` as the argument; if images, then `$scope.project.imageGallery`
       * or `$scope.project.imageGalleryThumbnailUrls`
       *
       */
      $scope.adminFileReaderNg = function (fileArray) {
        console.log('fileArray:\n', fileArray);

        var fileReader = new FileReader();
    
        var files = fileArray;
        var file = fileArray[0];
        $scope.previewImages = files;
        console.log('files:\n', files);
        console.log('file:\n', file);
        var selectedFile;
        // loop through files
        for (var i = 0; i < files.length; i++) {
          selectedFile = files[i];
        }
    
        // A callback, onloadend, is executed when the file has been read into memory, the data is then available via the result field.
        fileReader.loadend = function (event) {
        console.log('fileReader.loadend:: `event.target.result`:\n', event.target.result);
        };
    
        var newFile = fileReader.result;
        var printEventType = function (event) {
          console.log('got event: ' + event.type);
          console.log('newFile:\n' + newFile);
        };


        fileReader.onload = function (event) {
          console.log('fileReader.onload:::  got event: ' + event.type);
          var arrayBuffer = fileReader.result;
          console.log('fileReader.onload:::  arrayBuffer: ', arrayBuffer);
        };
      };



      
      $scope.uploadAdminImages = function(files, errFiles) {
        console.log('files:\n', files);
        console.log('errFiles:\n', errFiles);
        $scope.files = files;
        
        $scope.errFile = errFiles && errFiles[0];
        if (files) {
          $http.post('/api/v1/projects/' + $scope.project._id + '/images', files)
          // file.upload = Upload.upload({
          //   url: http.post('/api/v1/projects/' + $scope.project._id + '/images'),
          //   data: {file: file}
          // });
          // file.upload
          .then(function(response) {
            console.log('response:\n', response);
          })
          .then(function(event) {
            console.log('event:\n', event);
              file.progress = Math.min(100, parseInt(100.0 *
                event.loaded / event.total));
          })
          .catch(function(err) {
            console.log('err:\n', err);
          });
        }
      };





      //from directive in projects module used in create project html

      $scope.user = Authentication.user;
      $scope.uploading = false;
      console.log('$scope.project:\n', $scope.project);
      console.log('$scope.project._id: ', $scope.project._id);
      $scope.uploadAdminImagesV2 = function (bucket, bucketId, files) {
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
  };
});
