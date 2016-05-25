'use strict';

angular.module('admins').directive('wysiwygEditor', function () {
  return {
    restrict: 'EA',
    require: '?ngModel',
    scope: false,
    templateUrl: '/modules/admins/client/directives/views/wysiwyg-editor.html',
    controller: function ($scope, $http, $element, localStorageService) {

      
      $scope.showWysiwyg = false;
      $scope.projectText = '';
      var imageCount = 0;


      /**
       e //callback event.
       editor //editor instance
       cmd //command name
       param1 //first parameter for command {optional}
       param2 //second parameter for command {optional}
       */
      var uploadImage = function() {
        return '/api/v1/projects/' + $scope.project._id + '/wysiwyg/upload';
      };

      // var testSetSessionStorageUrl = function() {
      //   imageCount += imageCount;
      //
      //   $scope.froalaOptions.imageUploadURL = localStorageService.get('tempImage' + imageCount);
      //   console.log('\nimageUploadURL: ', $scope.froalaOptions.imageUploadURL);
      // };
      
      // var getProjectImages = function() {
      //   return $http.get('/api/v1/projects/' + $scope.project._id + '/upload/', { cache: true })
      //     .then(function(response) {
      //       var baseUrlsArray = response.data.imageData.Contents;
      //       return baseUrlsArray.map(function(image) {
      //         var imageObj = {};
      //         imageObj.url = 'https://s3-us-west-1.amazonaws.com/' + response.data.imageData.Name + '/' + image.Key;
      //         imageObj.thumb = 'https://s3-us-west-1.amazonaws.com/' + response.data.imageData.Name + '/' + image.Key;
      //         return imageObj;
      //       });
      //     });
      // };

      /**
       *
       * @param isMainImage {boolean}
       * @param altImageId  {string}
       */
      $scope.getImageByImageId = function(isMainImage, altImageId) {
        var imageId = altImageId || $scope.project.mainImageData.imageId;
        console.log('$scope.getImageByImageId `imageId`: ', imageId);
        if(isMainImage) {
          return $http.get('/api/v1/projects/' + $scope.project._id + '/images/default', { cache: true })
          .then(function(response, reject) {
            if (reject) { console.log('get image `response`:\n', response); }
            console.log('get image `response`:\n', response);
            return response;
          });
        } else {
          return $http.get('/api/v1/projects/' + $scope.project._id + '/images/' + imageId, { cache: true })
          .then(function(response, reject) {
            if (reject) { console.log('get image `response`:\n', response); }
            console.log('get image `response`:\n', response);
            return response;
          });
        }
      };

      $scope.getBucketAcl = function() {
        return $http.get('/api/v1/projects/acl')
          .then(function(response, reject) {
            if (reject) { console.log('get image `response`:\n', response); }
            console.log('get image `response`:\n', response);
            return response;
          });        
      };

      $scope.getObjectAcl = function() {
        return $http.get('/api/v1/projects/acl/object')
        .then(function(response, reject) {
          if (reject) { console.log('get image `response`:\n', response); }
          console.log('get image `response`:\n', response);
          return response;
        });
      };
      
      $scope.getImagesByProjectId = function() {
        console.log('get imagessss ::::::::');
        return $http.get('/api/v1/projects/' + $scope.project._id + '/images/', { cache: true })
        .then(function (response, reject) {
          if (reject) { console.log('get imagessss `reject`:\n', reject); }
          console.log('get imagessss `response`:\n', response);
          console.log('get imagessss `response`:\n', $scope.project.imageGallery);

          return $scope.project.imageGallery.map(function(image) {
            $scope.images = {
              main: image.url,
              thumb: image.thumbImageUrl
            };
            console.log('$scope.images:\n', $scope.images);
            return $scope.images;
          });
        });
      };

      $scope.createNewId = function() {
        console.log('create shortId HEREEEEE');
        return $http.get('/api/v1/shortId')
          .then(function(response) {
            console.log('create shortId ::  `response`:\n', response);
            return response;
          })
          .catch(function(err) {
            console.log('create shortId ::  `err`:\n', err);
            throwError(err);
          });
      };

      // $scope.getProjectImages = function() {
      //   $http.get('/api/v1/projects/' + $scope.project._id + '/upload/', { cache: true })
      //   .then(function(response) {
      //     var baseUrlsArray = response.data.imageData.Contents;
      //     var images = baseUrlsArray.map(function(image) {
      //       var imageObj = {};
      //       imageObj.url = 'https://s3-us-west-1.amazonaws.com/' + response.data.imageData.Name + '/' + image.Key;
      //       imageObj.thumb = 'https://s3-us-west-1.amazonaws.com/' + response.data.imageData.Name + '/' + image.Key;
      //       return imageObj;
      //     });
      //     console.log('images:\n', images);
      //     return images;
      //   });
      // };


      $scope.froalaOptions = {
        imageUploadURL: uploadImage(),
        charCounterCount: false,
        toolbarInline: false,
        imageManagerPreloader: '../../../modules/core/client/img/infinity-spinner.gif',
        imageManagerPageSize: 25,
        imageManagerScrollOffset: 10,
        imageManagerLoadMethod: 'GET',
        imageManagerLoadURL: 'https://s3-us-west-1.amazonaws.com/mapping-slc-file-upload/project-directory/561978272356222b1ceb5a7c/222.jpg',
        // imageManagerLoadURL: getProjectImages(),
        // imageManagerLoadParams: {}, //additional params passed in the load images request to server
        events: {
          'froalaEditor.image.beforeUpload': function (e, editor, images) {
            // console.log('\nimage before upoload:::::::::::');
            // console.log('\nevent:\n', e);
            // console.log('\neditor:\n', editor);
            // console.log('\nimages:\n', images);
          },
          'froalaEditor.image.inserted': function (e, editor, $img, response) {
            console.log('\nimage inserted:::::::::::');
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\$img:\n', $img);
            console.log('\response:\n', response);
          },
          'froalaEditor.image.loaded': function (e, editor, $img) {
            // $img.imageId = '';
            console.log('\nimage loaded:::::::::::');
            console.log('\nimageUploadURL: ', $scope.froalaOptions.imageUploadURL);
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\n$img:\n', $img);
          },
          'froalaEditor.image.replaced': function (e, editor, $img, response) {
            // console.log('\nimage replaced:::::::::::');
            // console.log('\nimageUploadURL: ', $scope.froalaOptions.imageUploadURL);
            // console.log('\nevent:\n', e);
            // console.log('\neditor:\n', editor);
            // console.log('\n$img:\n', $img);
            // console.log('\nresponse:\n', response);
          },
          'froalaEditor.image.removed': function (e, editor, $img) {
            // console.log('\nimage removed:::::::::::');
            // console.log('\nimageUploadURL: ', $scope.froalaOptions.imageUploadURL);
            // console.log('\nevent:\n', e);
            // console.log('\neditor:\n', editor);
            // console.log('\n$img:\n', $img);
          },
          'froalaEditor.image.error': function (e, editor, error) {
            console.log('\nimage error:::::::::::');
            console.log('\nimageUploadURL: ', $scope.froalaOptions.imageUploadURL);
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\nerror:\n', error);
          },
          'froalaEditor.link.bad': function (e, editor, error) {
            console.log('\nimage bad link:::::::::::');
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\nerror:\n', error);
          },
          'froalaEditor.imageManager.error': function (e, editor, error, response) {
            console.log('\nimageManager.error:::::::::::');
            console.log('\imageManagerLoadURL: ', $scope.froalaOptions.imageManagerLoadURL);
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\nerror:\n', error);
            console.log('\nresponse:\n', response);
          }
        }
      };

    }
  };
});




/**
 *
 
 
 :::::::::::::::response::::::::::::::::
 { IsTruncated: false,
  Contents:
   [ { Key: 'project-directory/561978272356222b1ceb5a7c/a.jpg',
       LastModified: Thu May 12 2016 21:15:40 GMT-0600 (MDT),
       ETag: '"bbe0827caf78b3ec1b7b53b11e23a45c"',
       Size: 23187,
       StorageClass: 'STANDARD' },
     { Key: 'project-directory/561978272356222b1ceb5a7c/redwood.jpg',
       LastModified: Fri May 13 2016 20:35:16 GMT-0600 (MDT),
       ETag: '"00d5535eda5b6e81a816cfae08916ba5"',
       Size: 99981,
       StorageClass: 'STANDARD' },
     { Key: 'project-directory/561978272356222b1ceb5a7c/test.png',
       LastModified: Fri May 13 2016 20:35:18 GMT-0600 (MDT),
       ETag: '"07e6eb95e4ca14087298689f1006493c"',
       Size: 268514,
       StorageClass: 'STANDARD' },
     { Key: 'project-directory/561978272356222b1ceb5a7c/thumbs/',
       LastModified: Fri May 13 2016 20:33:08 GMT-0600 (MDT),
       ETag: '"d41d8cd98f00b204e9800998ecf8427e"',
       Size: 0,
       StorageClass: 'STANDARD' },
     { Key: 'project-directory/561978272356222b1ceb5a7c/thumbs/redwood.jpg',
       LastModified: Fri May 13 2016 20:35:36 GMT-0600 (MDT),
       ETag: '"160981a35c37896e06117c197961b17b"',
       Size: 42143,
       StorageClass: 'STANDARD' },
     { Key: 'project-directory/561978272356222b1ceb5a7c/thumbs/test.png',
       LastModified: Fri May 13 2016 20:35:37 GMT-0600 (MDT),
       ETag: '"887c8f07dab121e1153ded0ba2615253"',
       Size: 14158,
       StorageClass: 'STANDARD' } ],
  Name: 'mapping-slc-file-upload',
  Prefix: 'project-directory/561978272356222b1ceb5a7c',
  MaxKeys: 10,
  CommonPrefixes: [],
  EncodingType: 'url',
  KeyCount: 6 }


 
 */

