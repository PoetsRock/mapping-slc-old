'use strict';

(function () {

  var project = {
    _id : "5662bca75312bbd5796b7923",
    user : "5611ca9493e8d4af5022bc17",
    story : "<p>Though You&#39;re Gone Now, For Someday, Let Someday Come and My Lonely One Can Go Off into the Setting Sun</p>",
    lat : 40.7702461,
    lng : -111.8717249,
    mapImage : "http://api.tiles.mapbox.com/v4/poetsrock.map-55znsh8b/url-http%3A%2F%2Fwww.mappingslc.org%2Fimages%2Fsite_img%2Flogo_marker_150px.png(-111.8717249,40.7702461)/-111.8717249,40.7702461,15/800x250.png?access_token=pk.eyJ1IjoicG9ldHNyb2NrIiwiYSI6Imc1b245cjAifQ.vwb579x58Ma-CcnfQNamiw",
    specialLayout : [],
    featured : false,
    imageGallery : [],
    tags : [],
    keywords : [],
    category : [],
    zip : 84103,
    state : "UT",
    city : "Salt Lake City",
    street : "39 I St.",
    storySummary : "",
    shortTitle : "",
    title : "Though You're Gone Now, For Someday, Let Someday Come and My Lonely One Can Go Off into the Setting Sun.",
    modifiedBy : "",
    createdOn : "2015-12-05T10:29:59.204Z",
    status : [
      "received"
    ],
    submittedOn : "2015-12-06T01:43:54.476Z"
  };

  var imageManagerJson = {
    images: [
      { "thumb": "../../../modules/core/client/img/rose_park_still_bw_thumb.png",
        "url": "https://s3-us-west-1.amazonaws.com/mapping-slc-file-upload/project-directory/565a966a087f5958b73386e6/redwood.jpg",
        "title": "Image 1",
        "id": 1
      },
      { "thumb": "https://s3-us-west-1.amazonaws.com/mapping-slc-file-upload/project-directory/565a966a087f5958b73386e6/thumb_redwood.jpg",
        "url": "https://s3-us-west-1.amazonaws.com/mapping-slc-file-upload/project-directory/565a966a087f5958b73386e6/redwood.jpg",
        "title": "Image 2",
        "id": 2
      }
    ]
  };

  var redactorOptions = {
    focus: true,
    imageUpload: '/api/v1/projects/' + project._id + '/s3/upload',
    imageManagerJson: imageManagerJson,
    plugins: ['source', 'alignment', 'filemanager', 'imagemanager', 'video']
  };

  angular.module('angular-redactor')
    .constant('redactorOptions', redactorOptions)
    .directive('redactor', ['$timeout', function ($timeout) {
      console.log(':::redactorOptions::::000:::\n', redactorOptions);

      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {

          // console.log(':::redactorOptions::::222:::\n', redactorOptions);
          // console.log(':::scope::::\n', scope);
          // console.log(':::element::::\n', element);
          console.log(':::attrs::::\n', attrs);
          console.log(':::111 ngModel 111::::\n', ngModel);

          // Expose scope var with loaded state of Redactor
          scope.redactorLoaded = false;

          var updateModel = function updateModel(value) {
              // $timeout to avoid $digest collision
              $timeout(function () {
                scope.$apply(function () {
                  // console.log(':::value::::\n', value);
                  ngModel.$setViewValue(value);
                });
                console.log(':::ngModel::::\n', ngModel);
                // console.log(':::updateModelFn ()  `ngModel.$viewValue` 1111::::\n', ngModel.$viewValue);
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
