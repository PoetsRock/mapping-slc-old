'use strict';

(function () {
  
  var redactorOptions = {
    plugins: ['source', 'alignment', 'filemanager', 'imagemanager', 'video'],
    focus: true
  };

  angular.module('angular-redactor')
    .constant('redactorOptions', redactorOptions)
    .directive('redactor', ['$timeout', function ($timeout) {

      var project = {
        _id: '56f4e0deb11c53c0117d967c'
      };

      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {

          // Expose scope var with loaded state of Redactor
          scope.redactorLoaded = false;

          var updateModel = function updateModel(value) {
              // $timeout to avoid $digest collision
              $timeout(function () {
                scope.$apply(function () {
                  ngModel.$setViewValue(value);
                });
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
          console.log(':::options 1::::\n', options);
          options.imageUpload = '/api/v1/projects/' + project._id + '/s3/upload';
          console.log(':::options 2::::\n', options);
          // put in timeout to avoid $digest collision.  call render()
          // to set the initial value.
          $timeout(function () {
            editor = element.redactor(options);
            console.log(':::editor::::\n', editor);
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
