'use strict';

(function () {

  var redactorOptions = {
  //   plugins: ['source', 'alignment', 'filemanager', 'imagemanager', 'video']
  };

  angular.module('angular-redactor')
    .constant('redactorOptions', redactorOptions)
    .directive('redactor', ['$timeout', function ($timeout) {
      console.log(':::redactorOptions::::000:::\n', redactorOptions);

      // this.upload.init('#redactor-modal-image-droparea', '/upload-url/', callback);


      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
          var redactorOptions = {
            focus: true,
            imageUpload: '/api/v1/projects/' + scope.project._id + '/s3/upload',
            imageUploadParam: scope.project.files,
            imageManagerJson: scope.imageManagerJson,
            plugins: ['source', 'alignment', 'filemanager', 'imagemanager', 'video', 'custom']
          };

          console.log(':::redactorOptions::::222:::\n', redactorOptions);
          console.log(':::scope::::\n', scope);
          console.log(':::element::::\n', element);
          console.log(':::attrs::::\n', attrs);
          console.log(':::111 ngModel 111::::\n', ngModel);

          // Expose scope var with loaded state of Redactor
          scope.redactorLoaded = false;

          var updateModel = function updateModel(value) {
              // $timeout to avoid $digest collision
              $timeout(function () {
                scope.$apply(function () {
                  console.log(':::value::::\n', value);
                  ngModel.$setViewValue(value);
                });
                console.log(':::ngModel::::\n', ngModel);
                console.log(':::updateModelFn ()  `ngModel.$viewValue` 1111::::\n', ngModel.$viewValue);
              });
            },
            options = {
              callbacks: {
                change: updateModel
              }
            },
            additionalOptions = attrs.redactor ?
              scope.$eval(attrs.redactor) : {},
            editor;


          angular.extend(options, redactorOptions, additionalOptions);
          options.imageUpload = '/api/v1/projects/' + scope.project._id + '/s3/upload';
          console.log(':::options 2::::\n', options);
          // put in timeout to avoid $digest collision.  call render() to set the initial value.
          $timeout(function () {
            editor = element.redactor(options);
            ngModel.$render();
          });

          ngModel.$render = function () {
            if (angular.isDefined(editor)) {
              $timeout(function () {
                element.redactor('code.set', ngModel.$viewValue || '');
                console.log(':::editor::::\n', editor);
                console.log(':::ngModel.$renderFn()  `ngModel.$viewValue` 2222::::\n', ngModel.$viewValue);
                scope.redactorLoaded = true;
              });
            }
          };

        }
      };


    }]);
})();










/**

'use strict';

(function () {

  var project = {
    _id: '56f4e0deb11c53c0117d967c'
  };
  var redactorOptions = {
    plugins: ['source', 'alignment', 'filemanager', 'imagemanager', 'video'],
    focus: true,
    imageUpload: '/api/v1/projects/' + project._id + '/s3/upload',
    imageUploadParam: {}
  };

  angular.module('angular-redactor')
    .constant('redactorOptions', redactorOptions)
    .directive('redactor', ['$timeout', function ($timeout) {

      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {

          // console.log(':::element::::\n', element);
          // console.log(':::111 ngModel 111::::\n', ngModel);

          // Expose scope var with loaded state of Redactor
          scope.redactorLoaded = false;

          var updateModel = function updateModel(value) {
              // $timeout to avoid $digest collision
              $timeout(function () {
                // console.log(':::value::::\n', value);
                scope.$apply(function () {
                  ngModel.$setViewValue(value);
                });
                // console.log(':::ngModel::::\n', ngModel);
                // console.log(':::ngModel.$viewValue::::\n', ngModel.$viewValue);
              });
            },
            options = {
              callbacks: {
                change: updateModel
              }
            },
            additionalOptions = attrs.redactor ?
              scope.$eval(attrs.redactor) : {},
            editor;


          angular.extend(options, redactorOptions, additionalOptions);
          // console.log(':::options 1::::\n', options);
          options.imageUpload = '/api/v1/projects/' + project._id + '/s3/upload';
          // console.log(':::options 2::::\n', options);
          // put in timeout to avoid $digest collision.  call render()
          // to set the initial value.
          $timeout(function () {
            editor = element.redactor(options);
            // console.log(':::editor::::\n', editor);
            ngModel.$render();
          });

          ngModel.$render = function () {
            if (angular.isDefined(editor)) {
              $timeout(function () {
                element.redactor('code.set', ngModel.$viewValue || '');
                scope.redactorLoaded = true;
              });
            }
          };

        }
      };


    }
    ]);
})();


 */
