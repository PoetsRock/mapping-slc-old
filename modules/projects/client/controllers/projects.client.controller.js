'use strict';

// Projects controller
//noinspection JSAnnotator
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', '$http', '$sce', 'ApiKeys', 'GeoCodeApi', '$rootScope', 'AdminAuthService', 'User', 'AdminUpdateUser', '$state', 'UtilsService', '$uibModal', '$window', '$log', 'notify', '$document', 'publishedProjectsService', 'userFavoritesService', 'Upload',
  function ($scope, $stateParams, $location, Authentication, Projects, $http, $sce, ApiKeys, GeoCodeApi, $rootScope, AdminAuthService, User, AdminUpdateUser, $state, UtilsService, $uibModal, $window, $log, notify, $document, publishedProjectsService, userFavoritesService, Upload) {
    $scope.user = Authentication.user;
    $scope.isAdmin = AdminAuthService;
    $scope.logo = '../../../modules/core/img/brand/mapping_150w.png';
    var width = '800';
    var height = '250';
    var markerUrl = 'url-http%3A%2F%2Fwww.mappingslc.org%2Fimages%2Fsite_img%2Flogo_marker_150px.png';
    $scope.mapImage = '';
    $rootScope.signInBeforeProject = false;
    $scope.updateToContrib = null;
    $scope.isPublished = false;
    $scope.userToEdit = {};
    $scope.images = [];
    $scope.files = [];
    $scope.override = false;
    $scope.isFavorite = false;
    $scope.trustAsHtml = $sce.trustAsHtml;
    $scope.project = {};
    $scope.previewImages = [];
    $scope.projectFiles = [];
    $scope.uploading = false;

    $scope.init = function () {
      $scope.publishedProjectsFn();
    };

    $scope.initSubmissionStatus = function () {
      $scope.findOne();
    };

    //provides logic for the css in the forms
    UtilsService.cssLayout();

    $scope.showUpload = false;
    $scope.showSubmit = false;
    $scope.showUploadFunction = function () {
      if (project.street !== '') {
        $scope.showUpload = true;
      }
      if ($scope.showUpload && this.project.story !== '') {
        $scope.showSubmit = true;
      }
    };




    var imagesUploader = function (bucket, bucketId, files) {
      $scope.uploading = true;
      // files.forEach(function(file) {
      //   var query = { filename: files[0].name, type: files[0].type, bucket: bucket };
      //   if (bucket === 'projects') { query.user = $scope.user; }
      //   $http.post('api/v1/' + bucket + '/' + bucketId + '/images', query)
      //   .then(function (result) {
      //     console.log('result v1\n', result);
      //     $scope.uploading = false;
      //     // need to set image on front end
      //     if (result && result.s3Url) {
      //       console.log('result v2\n', result);
      //       $scope.user.profileImageURL = result.s3Url;
      //       $scope.imageURL = result.s3Url;
      //     }
      //   })
      //   .catch(function(err) {
      //     console.log('error on upload:\n', err);
      //     $scope.uploading = false;
      //   });
      // });
      var query = { file: files[0], filename: files[0].name, type: files[0].type, bucket: bucket };
      if (bucket === 'projects') { query.user = $scope.user; }
      console.log('query\n', query);
      $http.post('api/v1/' + bucket + '/' + bucketId + '/images', query)
      .then(function (result) {
        console.log('result v1\n', result);
        $scope.uploading = false;
        // need to set image on front end
        // if (result && result.s3Url) {
        //   console.log('result v2\n', result);
        //   $scope.user.profileImageURL = result.s3Url;
        //   $scope.imageURL = result.s3Url;
        // }
        return result;
      })
      .catch(function(err) {
        console.log('error on upload:\n', err);
        $scope.uploading = false;
      });
    };










    /**
     * called when $scope.project.status updates
     */
    $scope.projectStatusChanged = function () {
      if ($scope.project.status === 'published') {
        $scope.publishProject();
      } else {
        $scope.update();
      }
      $scope.toggleEdit = false;
    };

    $scope.confirmPublishModal = function () {
      $scope.animationsEnabled = true;
      $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: '/modules/projects/client/directives/views/project-warning-modal.html',
        controller: 'ModalController',
        size: 'lg'
      });
    };

    var publishUser = function (project) {
      console.log('publishUser ::::  project.user._id:: ', project.user._id);
      AdminUpdateUser.get({ userId: project.user._id },
        function (userData) {
          if (userData.roles[0] !== 'admin' || userData.roles[0] !== 'superUser' && project.status === 'published') {
            userData.roles[0] = 'contributor';
          }

          console.log('userData  :::: ::\n', userData);
          console.log('publishUser ::::  project._id:: ', project._id);

          userData.associatedProjects.push(project._id);

          userData.$update(function (userData, putResponseHeaders) {
          });
        });
    };


    $scope.publishProject = function () {
      //todo need to call on a confirm modal first
      $scope.confirmPublishModal();
      $scope.project.publishedDate = new Date();
      $scope.update();
      publishUser($scope.project); //call method to display contributor bio
    };

    var saveProject = null;
    $scope.updateLatLng = function (project) {
      $http.get('/api/v1/keys')
      .then(function (keys, revoked) {

        GeoCodeApi.callGeoCodeApi(project, keys, saveProject)
        .success(function (data) {
          var mapboxKey = keys.data.MAPBOX_KEY;
          var mapboxSecret = keys.data.MAPBOX_SECRET;
          project.lat = data.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
          project.lng = data.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
          project.mapImage = 'http://api.tiles.mapbox.com/v4/' + mapboxKey + '/' + markerUrl + '(' + project.lng + ',' + project.lat + ')/' + project.lng + ',' + project.lat + ',15/' + width + 'x' + height + '.png?access_token=' + mapboxSecret;
          saveProject();
        })
        .error(function (data, status) {

        })
      });
    };


    // Find a list of all published projects
    $scope.publishedProjects = [];
    $scope.publishedProjectsFn = function () {
      $http.get('/api/v1/projects/published', { cache: true })
      .then(function (publishedProjects) {
        $scope.publishedProjects = publishedProjects.data;
      });
    };


    // Create new Project
    $scope.create = function (isValid) {
      $scope.error = null;
      console.log('$scope.project v2', $scope.project);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'projectForm');
        return false;
      }
      // Create new Project object
      var project = new Projects({
        createdBy: Authentication.user._id,
        street: this.project.street,
        city: this.project.city,
        state: 'UT',
        zip: this.project.zip,
        story: '',
        title: this.project.title
      });

      saveProject = function () {
        project.$save(function (response) {
          console.log('response\n', response);
          console.log('$scope.project.files\n', $scope.project.files);
          console.log('$scope.project.files', $scope.project.files);
          $scope.uploadProjectFiles(response, $scope.project.files);
          $scope.override = true;
          $location.path('projects/' + response._id + '/status');

          // Clear form fields
          $scope.street = '';
          $scope.city = '';
          $scope.state = '';
          $scope.zip = '';
          $scope.story = '';
          $scope.title = '';
          $scope.files = '';
          // publishUser(response);
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.updateLatLng(project);
      $scope.override = false;
    };


    // Remove existing Project
    $scope.remove = function (project) {
      if (project) {
        project.$remove();

        for (var i in $scope.projects) {
          if ($scope.projects [i] === project) {
            $scope.projects.splice(i, 1);
          }
        }
      } else {
        $scope.project.$remove(function () {
          if ($location.path() === '/admin/edit-project/' + $scope.project._id) {
            $location.path('admin/projects-queue');
          } else {
            $location.path('projects');
          }
        });
      }
    };


    /**
     *
     *  Update an existing Project
     *
     */
    $scope.update = function (isValid, toggleId) {

      console.log('inside func $scope.update():::: logging var `$scope.project`', $scope.project);
      //console.log('update :::: isValid', isValid);
      //console.log('update :::: toggleId', toggleId);
      //$scope.error = null;
      //if (!isValid) {
      //  console.log('update :::: ground control to major tom', isValid);
      //  $scope.$broadcast('show-errors-check-validity', 'projectForm');
      //  return false;
      //}
      var project = $scope.project;
      //console.log('update 22222:::: project', project);
      project.$update(function (response) {
        if (response.$resolved) {
          if ($location.path() === '/admin/edit-project/' + project._id) {
            $location.path('/admin/edit-project/' + project._id);
            $scope.toggleEditFn(0);
          } else {
            $location.path('projects/' + project._id);
            $scope.toggleEditFn(0);
          }
          notify({
            message: 'Project updated successfully',
            classes: 'ng-notify-contact-success'
          })
        } else {
          notify({
            message: 'Something went wrong, and we didn\'t receive your message. We apologize.',
            classes: 'ng-notify-contact-failure'
          })
        }
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };


    /**
     *
     *
     */
    $scope.updateFeatured = function () {
      $scope.toggleEditFn(0);
      console.log('route:\napi/v1/projects/' + $scope.project._id + '/featured/' + $scope.project.featured);
      console.log('$scope.project:\n', $scope.project);
      $http.put('api/v1/projects/' + $scope.project._id + '/featured/' + $scope.project.featured, $scope.project)
      .then(function (resolved) {
        console.log('resolved:\n', resolved);
      });
    };
  

    /**
     * Find a list of Projects
     */
    $scope.find = function () {
      $scope.projects = Projects.query();
    };

    /**
     * Find existing Project
     */
    $scope.findOne = function () {

      Projects.get({ projectId: $stateParams.projectId },
        function (project) {
          $scope.project = project;
          // $scope.images = project.imageGallery;
          console.log(' ::: $scope.findOne()  :::  var `$scope.project`:', $scope.project);
          if (project.vimeoId) {
            $scope.vimeo = {
              video: $sce.trustAsResourceUrl('http://player.vimeo.com/video/' + project.vimeoId),
              width: $window.innerWidth / 1.75,
              height: $window.innerHeight / 1.75
            };
          }
          if (project.soundCloudId) {
            $scope.soundCloud = {
              audio: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + project.soundCloudId + '&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true',
              width: $window.innerWidth / 1.75,
              height: $window.innerHeight / 1.75
            };
          }
          if (project.imageGallery) {
            for (var i = 0; i < project.imageGallery.length; i++) {
              $scope.images.push(project.imageGallery[i]);
            }
          }
          if (project.fileUrls) {
            for (var i = 0; i < project.fileUrls.length; i++) {
              $scope.files.push(project.fileUrls[i]);
            }
          }
          getUserFavoriteStoriesFn($scope.user.favorites, $scope.project.id);
        });

    };

    $scope.goToProject = function(projectId) {
      console.log('here! | projectId: ', projectId);
    };

    // /**
    //  * Find existing User
    //  *
    //  * @param userIdToEdit {string} [optional] - if param exists, then function will use this as the userId for request
    //  */
    // $scope.adminFindOneUser = function(userIdToEdit) {
    //   console.log(':::: userIdToEdit :::: ', userIdToEdit);
    //   $scope.userToEdit = UserData.get({
    //     userId: userIdToEdit
    //   });
    // };


    $scope.completed = function () {
      var formField;
      for (formField in $scope.createProject) {
        if ($scope.createProject === null) {
          return $scope.completed = false;
        } else {
          $scope.completed = true;
        }
      }
    };


    //CKEDITOR.replace('story');
    //$scope.editorOptions = {
    //  language: 'en',
    //  uiColor: '#02211D'
    //};
    //CKEDITOR.replaceClass = 'ck-crazy';

    /**
     * Checks to see if a user is logged in before allowing a user to create a project
     * @type {function}
     * @params: none
     */

    $rootScope.previousState = '';
    $rootScope.currentState = '';
    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from) {
      $rootScope.previousState = from.name;
      $rootScope.currentState = to.name;
    });
    $scope.goBack = function () {
      if ($rootScope.previousState === 'listProjects') {
        $state.go($rootScope.previousState);
      } else {
        $state.go('admin');
      }
    };
    $scope.run = function ($rootScope, $state, Authentication) {
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !Authentication.isLoggedIn()) {
        }
        event.preventDefault();
      });
    };

    $scope.userLoggedin = function () {
      // get request to /users/me
      if ($location.path() === '/projects/create') {
        $http.get('/api/v1/users/me')
        .success(function (data) {
          if (data === null) {
            $rootScope.signInBeforeProject = true;
            $location.path('/authentication/signin');
          }
        });
      }
    }();

    /**
     * Favorite project function
     */

    $scope.$watchCollection('user.favorites',
      function (newVal, oldVal) {
        // console.log('PROJECTS CTRL :::::$scope.user.favorites BEFORE $watch\n', $scope.user.favorites, '\n');
        // console.log('PROJECTS CTRL watchUpdateFavorites newVal.length::::::\n', newVal.length, '\n\n');
        // console.log('PROJECTS CTRL watchUpdateFavorites::::::oldVal.length\n', oldVal.length);
        if ($scope.user.favorites && newVal.length !== oldVal.length) {
          $scope.user.favorites = newVal;
          // console.log('PROJECTS CTRL :::::$scope.user.favorites AFTER $watch\n', $scope.user.favorites, '\n');
        }
      }
    );


    //var removeItemFromArray = function(item) {
    //  var updatedFavProjects = $scope.user.favorites.indexOf(item);
    //  if (updatedFavProjects !== -1) {
    //    $scope.user.favorites.splice(updatedFavProjects, 1);
    //  }
    //};
    //
    //var addItemToArray = function(addedItem) {
    //  $scope.user.favorites.push(addedItem);
    //};

    //var getUserFavoriteStories = function (userFavoriteProjects, projectId) {
    //  userFavoriteProjects.forEach(function (userFavoriteProject) {
    //    if (userFavoriteProject === projectId) {
    //      $scope.isFavorite = true;
    //    }
    //  });
    //};

    var getUserFavoriteStoriesFn = function (userFavoriteProjects, projectId) {
      userFavoritesService.getUserFavoriteStories(userFavoriteProjects, projectId,
        function (err, data) {
          $scope.isFavorite = data;
        }
      );
    };

    $scope.toggleFavProjectFn = function () {
      userFavoritesService.toggleFavProject($scope.isFavorite, $scope.project,
        function (err, data) {
          $scope.isFavorite = data;
        });
    };


    /**
     * modal for leaving projects, will give user warning if leaving form
     *
     */

    $scope.preventRunning = true;
    $scope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        var state = {
          event: event,
          toState: toState,
          toParams: toParams,
          fromState: fromState,
          fromParams: fromParams
        };
        if (!$scope.preventRunning || $scope.override) {
          return
        } else {
          var template = '';
          $scope.items = [];

          if (fromState.url === '/projects/create' && toState.url !== "/signin?err") {
            event.preventDefault();
            $scope.items.toStateUrl = toState.url;
            template = '/modules/projects/client/directives/views/project-warning-modal.html';
            $scope.openModal('lg', template);
          }

        }
      });


    $scope.animationsEnabled = true;
    $scope.openModal = function (size, template, backdropClass, windowClass) {

      var modalInstance = $uibModal.open({
        templateUrl: template,
        controller: 'ModalController',
        animation: $scope.animationsEnabled,
        backdrop: 'static',
        backdropClass: backdropClass,
        windowClass: windowClass,
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });
      modalInstance.result.then(function (selectedItem) {
        $scope.preventRunning = false;
        return $location.path(selectedItem);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
      $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };
    };
  
  
  
    $scope.toggleEdit = false;
    $scope.toggleId = 0;
  
    $scope.toggleEditAdminPanel = function (editNum, isEdit, originalData) {
      
    };
    /**
     * admin panel editing
     */

    $scope.toggleEdit = false;
    $scope.toggleId = 0;

    $scope.toggleEditFn = function (editNum, isEdit, originalData) {
      if(isEdit === 'edit') {
        //originalData.value = $scope.project.storySummary;
        console.log('isEdit: ', isEdit);
        console.log('originalData: ', originalData);
        console.log('$scope.project.storySummary: ', $scope.project.storySummary);
      }
      if(isEdit === 'cancel') {
        $scope.project.story = originalData;
        console.log('isEdit: ', isEdit);
        console.log('originalData: ', originalData);
        console.log('$scope.project.storySummary: ', $scope.project.storySummary);
      }
      $scope.toggleEdit = !$scope.toggleEdit;
      $scope.toggleId = editNum;
    };

    /**
     * nlp
     **/
    $scope.nlpData = null;

    $scope.processNlpData = function () {
      $http.get('api/v1/nlp').success(function (nlpData) {
        console.log(nlpData);
        $scope.nlpData = nlpData;
      }).error(function () {
      });
    };


    $scope.sorts = [
      { category: 'sortOrder', name: 'Date Submitted', value: 'createdOn' },
      { category: 'sortOrder', name: 'Title', value: 'title' },
      { category: 'sortOrder', name: 'Author Name', value: 'user.lastName' },
      { category: 'sortOrder', name: 'Submission Status', value: 'status' }
    ];

    $scope.categorySorts = [
      { category: 'sortOrder', name: 'Essay', value: 'essay' },
      { category: 'sortOrder', name: 'Multimedia', value: 'multimedia' },
      { category: 'sortOrder', name: 'Video', value: 'video' },
      { category: 'sortOrder', name: 'Audio', value: 'audio' },
      { category: 'sortOrder', name: 'Photography', value: 'photography' },
      { category: 'sortOrder', name: 'This Was Here', value: 'this was here' }
    ];

    $scope.predicate = 'title';
    $scope.reverse = true;
    $scope.order = function (predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
      console.log('predicate:\n', predicate);
    };


    //todo refactor into service
    // Project Uploader Service logic

    var projectUpload = function (project, files) {
      $scope.uploading = true;

      files.forEach(function (file) {
        console.log('projectUpload func  ::: file type conditional check var ` file.type`:\n', file.type);
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
          imageUploader(project, file);
        }

        if (file.type === 'text/*' || file.type === 'application/pdf') {
          documentUploader(project, file);
        }

        if (file.type === '' || file.type === '') {
          multimediaUploader(project, file);
        }

      });

      $scope.uploading = false;
    };

    /**
     *
     * @param fileArray
     *
     * `fileArray` is which ever property the files belong to.
     * for example, if they are document files, then the function would be passed
     * `$scope.project.fileUrls` as the argument; if images, then `$scope.project.imageGallery`
     * or `$scope.project.imageGalleryThumbnailUrls`
     *
     */
    $scope.fileReaderNg = function (fileArray) {

      var fileReader = new FileReader();

      var files = fileArray;
      var file = fileArray[0];
      var selectedFile;
      // loop through files
      for (var i = 0; i < files.length; i++) {
        selectedFile = files[i];
      }

      // A callback, onloadend, is executed when the file has been read into memory, the data is then available via the result field.
      // fileReader.loadend = function (event) {
        // console.log('event.target.result:\n', event.target.result);
      // };

      // var newFile = fileReader.result;
      // var printEventType = function (event) {
        // console.log('got event: ' + event.type);
      // };

      // fileReader.onload = function (event) {
      //   var arrayBuffer = fileReader.result;
      // };
    };


    /**
     * upload files on create project submission
     * @param project
       * @param project._id
       * @param project.user
     * @param files {object}
     */
    $scope.uploadProjectFiles = function (project, files) {
      console.log('project\n', project);
      console.log('files\n', files);
      // if (files.length === 1) {
        $scope.uploading = true;
        var query = {
          files: files[0],
          project: project
        };
        console.log('query:::\n', query);
        $http.post('api/v1/projects/' + project._id + '/files', query)
        .then(function(response) {
          console.log('SUCCESS uploading files!: `response`:\n', response);
        })
        .catch(function(err) {
          console.log('ERROR uploading files: `err`:\n', err);
        });
      // }
    };

    /**
     * hits back end route that calls `getS3File()`
     *
     **/
    $scope.files = [];
    $scope.getFiles = function () {
      $http.get('/api/v1/projects/' + $scope.project._id + '/files/' + $scope.project.fileUrls, { cache: true })
      .then(function (err, files) {
        if (err) {
          console.log('ERROR IN PROJECTS CONTROLLER\nerr in getting FILES:\n', err, '\n\n');
          return;
        }
        $scope.files = files;
        console.log('file from `projects.controller.client.controller.js`:\n', image, '\n\n');
      });
    };

    $scope.showMap = function () {
      UtilsService.showMap();
    };


  }
]);




/**


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


 */
