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
      var setSessionStorageUrl = function() {
        return '/api/v1/projects/' + $scope.project._id + '/wysiwyg/upload';
      };

      var testSetSessionStorageUrl = function() {
        imageCount += imageCount;

        $scope.froalaOptions.imageUploadURL = localStorageService.get('tempImage' + imageCount);
        console.log('\nimageUploadURL: ', $scope.froalaOptions.imageUploadURL);
      };
      
      $scope.getProjectImages = function() {
        var projectImagesArray = $http.get('/api/v1/projects/' + $scope.project._id + '/upload/', { cache: true });
        console.log('\nprojectImagesArray:\n', projectImagesArray);
      };


      $scope.froalaOptions = {
        imageUploadURL: setSessionStorageUrl(),
        charCounterCount: false,
        toolbarInline: false,
        imageManagerPreloader: '../../../modules/core/client/img/infinity-spinner.gif',
        imageManagerPageSize: 25,
        imageManagerScrollOffset: 10,
        imageManagerLoadMethod: 'GET',
        imageManagerLoadURL: $scope.getProjectImages(),
        // imageManagerLoadParams: {}, //additional params passed in the load images request to server
        events: {
          'froalaEditor.image.beforeUpload': function (e, editor, images) {
            console.log('\nimage before upoload:::::::::::');
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\nimages:\n', images);
          },
          'froalaEditor.image.inserted': function (e, editor, $img, response) {
            console.log('\nimage inserted:::::::::::');
            console.log('\nimageUploadURL: ', $scope.froalaOptions.imageUploadURL);
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\$img:\n', $img);
            console.log('\response:\n', response);
          },
          'froalaEditor.image.loaded': function (e, editor, $img) {
            $img.imageId = '';

            console.log('\nimage loaded:::::::::::');
            console.log('\nimageUploadURL: ', $scope.froalaOptions.imageUploadURL);
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\n$img:\n', $img);
          },
          'froalaEditor.image.replaced': function (e, editor, $img, response) {
            console.log('\nimage replaced:::::::::::');
            console.log('\nimageUploadURL: ', $scope.froalaOptions.imageUploadURL);
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\n$img:\n', $img);
            console.log('\nresponse:\n', response);
          },
          'froalaEditor.image.removed': function (e, editor, $img) {
            console.log('\nimage removed:::::::::::');
            console.log('\nimageUploadURL: ', $scope.froalaOptions.imageUploadURL);
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\n$img:\n', $img);
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

