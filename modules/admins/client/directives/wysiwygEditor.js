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
        return '/api/v1/projects/' + $scope.project._id + '/images';
      };
      var getProjectImages = function() {
        return '/api/v1/projects/' + $scope.project._id + '/images';
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
          'froalaEditor.image.beforeUpload': function (e, editor, images) {
            // console.log('image before upoload:::::::::::');
            // console.log('event:\n', e);
            // console.log('editor:\n', editor);
            // console.log('images:\n', images);
          },
          'froalaEditor.image.inserted': function (e, editor, $img, response) {
            // console.log('image inserted:::::::::::');
            // console.log('event:\n', e);
            // console.log('editor:\n', editor);
            // console.log('\$img:\n', $img);
            // console.log('\response:\n', response);
          },
          'froalaEditor.image.loaded': function (e, editor, $img) {
            // $img.imageId = '';
            // console.log('image loaded:::::::::::');
            // console.log('imageUploadURL: ', $scope.froalaOptions.imageUploadURL);
            // console.log('event:\n', e);
            // console.log('editor:\n', editor);
            // console.log('$img:\n', $img);
          },
          'froalaEditor.image.replaced': function (e, editor, $img, response) {
            // console.log('image replaced:::::::::::');
            // console.log('imageUploadURL: ', $scope.froalaOptions.imageUploadURL);
            // console.log('event:\n', e);
            // console.log('editor:\n', editor);
            // console.log('$img:\n', $img);
            // console.log('response:\n', response);
          },
          'froalaEditor.image.removed': function (e, editor, $img) {
            // console.log('image removed:::::::::::');
            // console.log('imageUploadURL: ', $scope.froalaOptions.imageUploadURL);
            // console.log('event:\n', e);
            // console.log('editor:\n', editor);
            // console.log('$img:\n', $img);
          },
          'froalaEditor.image.error': function (e, editor, error) {
            console.log('image error:::::::::::');
            console.log('imageUploadURL: ', $scope.froalaOptions.imageUploadURL);
            console.log('event:\n', e);
            console.log('editor:\n', editor);
            console.log('error:\n', error);
          },
          'froalaEditor.link.bad': function (e, editor, error) {
            console.log('image bad link:::::::::::');
            console.log('event:\n', e);
            console.log('editor:\n', editor);
            console.log('error:\n', error);
          },
          'froalaEditor.imageManager.error': function (e, editor, error, response) {
            console.log('imageManager.error:::::::::::');
            console.log('\imageManagerLoadURL: ', $scope.froalaOptions.imageManagerLoadURL);
            console.log('event:\n', e);
            console.log('editor:\n', editor);
            console.log('error:\n', error);
            console.log('response:\n', response);
          }
        }
      };



      // $scope.getBucketAcl = function() {
      //   return $http.get('/api/v1/projects/acl')
      //   .then(function(response, reject) {
      //     if (reject) { console.log('get image `response`:\n', response); }
      //     console.log('get image `response`:\n', response);
      //     return response;
      //   });
      // };
      //
      // $scope.getObjectAcl = function() {
      //   return $http.get('/api/v1/projects/acl/object')
      //   .then(function(response, reject) {
      //     if (reject) { console.log('get image `response`:\n', response); }
      //     console.log('get image `response`:\n', response);
      //     return response;
      //   });
      // };
      //
      // $scope.getImagesByProjectId = function() {
      //   console.log('get imagessss ::::::::');
      //   return $http.get('/api/v1/projects/' + $scope.project._id + '/images/', { cache: true })
      //   .then(function (response, reject) {
      //     if (reject) { console.log('get imagessss `reject`:\n', reject); }
      //     console.log('get imagessss `response`:\n', response);
      //     console.log('get imagessss `response`:\n', $scope.project.imageGallery);
      //
      //     return $scope.project.imageGallery.map(function(image) {
      //       $scope.images = {
      //         main: image.url,
      //         thumb: image.thumbImageUrl
      //       };
      //       console.log('$scope.images:\n', $scope.images);
      //       return $scope.images;
      //     });
      //   });
      // };
      //
      // $scope.createNewId = function() {
      //   console.log('create shortId HEREEEEE');
      //   return $http.get('/api/v1/shortId')
      //   .then(function(response) {
      //     console.log('create shortId ::  `response`:\n', response);
      //     return response;
      //   })
      //   .catch(function(err) {
      //     console.log('create shortId ::  `err`:\n', err);
      //     throwError(err);
      //   });
      // };







    }
  };
});


