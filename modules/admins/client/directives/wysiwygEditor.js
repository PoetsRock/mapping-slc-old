'use strict';

angular.module('admins').directive('wysiwygEditor', function () {
  return {
    restrict: 'EA',
    require: '?ngModel',
    scope: false,
    templateUrl: '/modules/admins/client/directives/views/wysiwyg-editor.html',
    controller: function ($scope, $http) {

      $scope.showWysiwyg = false;
      $scope.projectText = '';

      /**
       *
       * @param imageId {string}
       */
      $scope.getImageByImageId = function(imageId) {
        return $http.get('/api/v1/projects/' + $scope.project._id + '/images/' + imageId, { cache: true })
        .then(function(response, reject) {
          if (reject) { console.log('get image `response`:\n', response); }
          console.log('get image `response`:\n', response);
          return response;
        });
      };

      var uploadImage = function() {
        // var url = '/api/v1/projects/' + $scope.project._id + '/images/wysiwyg';
        var url = '/api/v1/projects/' + '5799582abef5d8c91e731f21' + '/images/wysiwyg';
        console.log('url: ', url);
        return url;
      };
      var getProjectImages = function() {
        return '/api/v1/projects/' + '5799582abef5d8c91e731f21' + '/images';
      };

      $scope.froalaOptions = {
        imageUploadURL: uploadImage(),
        charCounterCount: false,
        toolbarInline: false,
        imageManagerPreloader: '../../../modules/core/client/img/loaders/infinity-spinner.gif',
        imageManagerPageSize: 25,
        imageManagerScrollOffset: 10,
        imageManagerLoadURL: getProjectImages(),
        events: {
          'froalaEditor.image.beforeUpload': function (e, editor, images) {},
          'froalaEditor.image.inserted': function (e, editor, $img, response) {},
          'froalaEditor.image.loaded': function (e, editor, $img) {},
          'froalaEditor.image.replaced': function (e, editor, $img, response) {},
          'froalaEditor.image.removed': function (e, editor, $img) {},
          'froalaEditor.image.error': function (e, editor, error) {},
          'froalaEditor.link.bad': function (e, editor, error) {},
          'froalaEditor.imageManager.error': function (e, editor, error, response) {}
        }
      };
    }
  };
});


