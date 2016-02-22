'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', '$http', '$sce', 'ApiKeys', 'GeoCodeApi', '$rootScope', 'AdminAuthService', 'User', 'AdminUpdateUser', '$state', 'UtilsService', '$uibModal', '$window', '$log', 'notify', '$document', 'publishedProjectsService', 'userFavoritesService', 'UserData',
  function ($scope, $stateParams, $location, Authentication, Projects, $http, $sce, ApiKeys, GeoCodeApi, $rootScope, AdminAuthService, User, AdminUpdateUser, $state, UtilsService, $uibModal, $window, $log, notify, $document, publishedProjectsService, userFavoritesService, UserData) {
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
    $scope.override = false;
    $scope.isFavorite = false;
    $scope.trustAsHtml = $sce.trustAsHtml;
    //$scope.publishedProjects;
    $scope.project = {};


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

    /**
     * called when $scope.project.status updates
     */
    $scope.projectStatusChanged = function () {
      if ($scope.project.status === 'published') {
        $scope.publishProject();
        $scope.toggleEdit = false;
      } else {
        $scope.update();
        $scope.toggleEdit = false;
      }
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
      // console.log('publishUser ::::  $resource::\n', $resource);
      console.log('publishUser ::::  project.user._id:: ', project.user._id);
      AdminUpdateUser.get({ userId: project.user._id },
        function (userData, getResponseHeader) {
          userData.associatedProjects.push(project._id);
          if (userData.roles[0] !== 'admin' || userData.roles[0] !== 'superUser') {
            userData.roles[0] = 'contributor';
          }
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
      console.log('project ctrl', project);
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
          $scope.override = true;
          $location.path('projects/' + response._id + '/status');
          // Clear form fields
          $scope.street = '';
          $scope.city = '';
          $scope.state = '';
          $scope.zip = '';
          $scope.story = '';
          $scope.title = '';
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
      // $scope.project = Projects.get({
      Projects.get({ projectId: $stateParams.projectId },
        function (project) {
        $scope.project = project;
          console.log(' ::: $scope.findOne()  :::  var `$scope.project`:', $scope.project);
          // console.log(' ::: $scope.findOne()  :::  var `$scope.project.user._id`:', $scope.project.user._id);
          // console.log(' ::: $scope.findOne()  :::  var `$scope.user._id`        :', $scope.user._id);
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
        getUserFavoriteStoriesFn($scope.user.favorites, $scope.project.id);
      });

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


    /**
     * admin panel editing
     */

    $scope.toggleEdit = false;
    $scope.toggleId = 0;

    $scope.toggleEditFn = function (editNum) {
      console.log('$scope.toggleEditFn  var `editNum`:', editNum);
      $scope.toggleEdit = !$scope.toggle;
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


  }

]);

