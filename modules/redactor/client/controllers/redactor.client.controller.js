'use strict';

//Angular Redactor controller
angular.module('angular-redactor').controller('RedactorController', ['$scope', '$stateParams', 'Authentication', '$http', 'AdminAuthService',
  function ($scope, $stateParams, Authentication, $http, AdminAuthService) {

    $scope.authentication = Authentication;
    $scope.isAdmin = AdminAuthService;
    
    $scope.redactorOptions = {
      // imageUpload: '/api/v1/projects/' + $scope.project._id + '/s3/upload',
      // imageUploadParam: $scope.project.files
      // autosave: 'scripts/save.php',
      // interval: 30,
      // autosaveCallback: testCallback
    };

    $scope.project = {
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

    $scope.imageManagerJson = {
      images: [
        { "thumb": "1m.jpg", "url": "1.jpg", "title": "Image 1", "id": 1  },
        { "thumb": "https://s3-us-west-1.amazonaws.com/mapping-slc-file-upload/project-directory/565a966a087f5958b73386e6/thumb_redwood.jpg",
          "url": "https://s3-us-west-1.amazonaws.com/mapping-slc-file-upload/project-directory/565a966a087f5958b73386e6/redwood.jpg",
          "title": "Image 2",
          "id": 2
        }
      ]
    };

    $scope.changeContent = function () {
      $scope.project.story = '<h1>Some bogus content</h1>'
    };

    $scope.project.story = '<p>This is my awesome content</p>';


/**


    $scope.uploading = false;
    var upload = null;

    $scope.onFileSelect = function (files) {
      console.log('$scope.onFileSelect() var `files`:\n', files);
      if (files.length === 1) {
        $scope.uploading = true;
        var query = {
          project: $scope.project,
          filename: files[0].name,
          type: files[0].type,
          size: files[0].size
        };
        console.log('files:::\n', files);
        console.log('query:::\n', query);
        $http.post('api/v1/projects/'+ $scope.project._id +'/s3/upload/documents', query)
          .success(function (result) {
            console.log('result v1\n', result);
            Upload.upload({
              url: result.url, //s3Url
              transformRequest: function (data, headersGetter) {
                var headers = headersGetter();
                delete headers.Authorization;
                console.log('data v1\n', data);
                return data;
              },
              fields: result.fields, //credentials
              method: 'POST',
              file: files[0]
            }).progress(function (evt) {
              console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
              var s3Result = xmlToJSON.parseString(data);   // parse
              // file is uploaded successfully
              $scope.uploading = false;
              console.log('s3Result:::\n', s3Result);
              console.log('status: ', status);
              console.log('The file ' + config.file.name + ' is uploaded successfully.\nResponse:\n', s3Result);
            });
          })
          .error(function (data, status, headers, config) {
            // called asynchronously if an error occurs or server returns response with an error status.
            $scope.uploading = false;
          });

      }
    };
*/




  }
]);
