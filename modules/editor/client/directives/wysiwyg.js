'use strict';

angular.module('editor').directive('wysiwyg', function () {
  return {
    restrict: 'EA',
    require: '?ngModel',
    scope: false,
    templateUrl: '/modules/editor/client/directives/views/text-editor.html',
    controller: function ($scope, $element) {

      let projectId = '572d234048a67ec647f2741d';
      let imageId = 'thumb_40.jpg';

      $scope.projectText = '';
      console.log('$element.froalaEditor', $element.froalaEditor);

      $scope.froalaOptions = {
        imageUploadURL: '/api/v1/projects/' + '56b5b776e24e183326f276a4' + '/wysiwyg/upload',
        charCounterCount: false,
        toolbarInline: false,
        imageManagerPreloader: '../../../modules/core/client/img/infinity-spinner.gif',
        imageManagerPageSize: 25,
        imageManagerScrollOffset: 10,
        imageManagerLoadURL: 'https://s3-us-west-1.amazonaws.com/mapping-slc-file-upload/project-directory/' + projectId + '/thumbs/' + imageId,
        imageManagerLoadMethod: 'GET',
        imageManagerLoadParams: {}, //additional params passed in the load images request to server

        events: {
          'froalaEditor.image.error': function (e, editor, error) {
            console.log('\nimage.error::::::\n');
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\nerror:\n', error);
          },
          'froalaEditor.image.beforeUpload': function (e, editor, images) {
            console.log('\nimage.beforeUpload::::::\n');
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\nimages:\n', images);
          },
          'froalaEditor.link.bad': function (e, editor, error) {
            console.log('\nlink.bad::::::\n');
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\nerror:\n', error);
          },
          'froalaEditor.image.loaded': function (e, editor, $img) {
            console.log('\nimage.loaded:::::\n');
            console.log('\nevent:\n', e);
            console.log('\neditor:\n', editor);
            console.log('\nimage.$img:\n', $img);
          }
        }
      };

    }
  };
});
