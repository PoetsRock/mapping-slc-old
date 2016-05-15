'use strict';

angular.module('editor').directive('wysiwyg', function () {
  return {
    restrict: 'EA',
    require: '?ngModel',
    scope: false,
    templateUrl: '/modules/editor/client/directives/views/wysiwyg-editor.html',
    controller: function ($scope, $element, localStorageService) {

      let projectId = '572d234048a67ec647f2741d';
      let imageId = 'thumb_40.jpg';

      $scope.projectText = '';
      var imageCount = 0;
      console.log('$element.froalaEditor', $element.froalaEditor);


      /**
       e //callback event.
       editor //editor instance
       cmd //command name
       param1 //first parameter for command {optional}
       param2 //second parameter for command {optional}
       */
      var testSessionStorageUrl = function() {
        return '/api/v1/projects/' + '56b5b776e24e183326f276a4' + '/wysiwyg/upload';
      };

      var setSessionStorageUrl = function() {
        imageCount += imageCount;

        $scope.froalaOptions.imageUploadURL = localStorageService.get('tempImage' + imageCount);
        console.log('\nimageUploadURL: ', $scope.froalaOptions.imageUploadURL);
      };

// blob:http%3A//localhost%3A3000/a224870e-4131-4e41-9362-fcb8f6a47960
//        imageUploadURL: '/api/v1/projects/' + '56b5b776e24e183326f276a4' + '/wysiwyg/upload',
      $scope.froalaOptions = {
        imageUploadURL: testSessionStorageUrl(),
        charCounterCount: false,
        toolbarInline: false,
        imageManagerPreloader: '../../../modules/core/client/img/infinity-spinner.gif',
        imageManagerPageSize: 25,
        imageManagerScrollOffset: 10,
        imageManagerLoadURL: 'https://s3-us-west-1.amazonaws.com/mapping-slc-file-upload/project-directory/' + projectId + '/thumbs/' + imageId,
        imageManagerLoadMethod: 'GET',
        imageManagerLoadParams: {}, //additional params passed in the load images request to server

        events: {
          'froalaEditor.image.beforeUpload': function (e, editor, images) {
            console.log('\nimage.beforeUpload::::::\n');
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\nimages:\n', images);
          },
          'froalaEditor.image.error': function (e, editor, error) {
            console.log('\nimageUploadURL: ', $scope.froalaOptions.imageUploadURL);
            console.log('\nimage.error::::::\n');
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\nerror:\n', error);
          },
          'froalaEditor.link.bad': function (e, editor, error) {
            console.log('\nlink.bad::::::\n');
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\nerror:\n', error);
          },
          'froalaEditor.image.loaded': function (e, editor, $img) {
            console.log('\nimageUploadURL: ', $scope.froalaOptions.imageUploadURL);
            console.log('\nimage.loaded:::::\n');
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\n$img:\n', $img);
          }
        }
      };

    }
  };
});
