'use strict';

// Admins controller
angular.module('admins').controller('AdminsController', ['$scope', 'd3', '$stateParams', '$location', 'Authentication', 'Projects', 'UserData', 'Contacts', 'AdminAuthService',
  function ($scope, d3, $stateParams, $location, Authentication, Projects, UserData, Contacts, AdminAuthService) {
    $scope.authentication = Authentication;
    $scope.isAdmin = AdminAuthService;

    //for dropdown

    $scope.colors = [{
      name: 'Red',
      hex: '#F21B1B'
    }, {
      name: 'Blue',
      hex: '#1B66F2'
    }, {
      name: 'Green',
      hex: '#07BA16'
    }];

    $scope.color = '';

    //
    //function run($rootScope, $state, Authentication) {
    //
    //	$rootScope.$on('$stateChangeStart',
    //		function(event, toState, toParams, fromState, fromParams) {
    //			if ( toState.authenticate && !Authentication.isLoggedIn() ) {
    //				$state.go( 'login' );
    //			}
    //			event.preventDefault();
    //		}
    //	)};


    var run = function ($rootScope, $state, Authentication) {
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !Authentication.isLoggedIn()) {
          $state.go('signin');
        }
        event.preventDefault();
      });

    };

    // If user is not an administrator then redirect back home
    if (!$scope.admin) $location.path('/');


    /**
     *
     * Projects Admin Functions
     *
     **/


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
          $location.path('projects');
        });
      }
    };

    // Update existing Project
    $scope.update = function () {
      var project = $scope.project;

      project.$update(function () {
        $location.path('projects/' + project._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Projects
    $scope.findProjects = function () {
      $scope.projects = Projects.query();
    };

    // Find existing Project
    $scope.findOneProject = function () {
      $scope.project = Projects.get({
        projectId: $stateParams.projectId
      });
    };


    /**
     *
     * Users Admin Functions
     *
     **/


      // Update a user profile
    $scope.updateUserProfile = function () {
      $scope.success = $scope.error = null;
      var user = new UserData($scope.user);

      user.$update(function (response) {
        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };


    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };


    //featured projects --- either a service injected into core or in core ctrl


    //
    // /**
    //  * Find existing Project and Contributor's user id
    //  */
    // $scope.adminFindOneProject = function () {
    //   // $scope.project = Projects.get({
    //   Projects.get({ projectId: $stateParams.projectId },
    //     function (project) {
    //       $scope.project = project;
    //       // console.log(' ::: $scope.findOne()  :::  var `$scope.project`:', $scope.project);
    //       console.log(' ::: $scope.findOne()  :::  var `$scope.project.user._id`:', $scope.project.user._id);
    //       // console.log(' ::: $scope.findOne()  :::  var `$scope.user._id`        :', $scope.user._id);
    //       if (project.vimeoId) {
    //         $scope.vimeo = {
    //           video: $sce.trustAsResourceUrl('http://player.vimeo.com/video/' + project.vimeoId),
    //           width: $window.innerWidth / 1.75,
    //           height: $window.innerHeight / 1.75
    //         };
    //       }
    //       if (project.soundCloudId) {
    //         $scope.soundCloud = {
    //           audio: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + project.soundCloudId + '&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true',
    //           width: $window.innerWidth / 1.75,
    //           height: $window.innerHeight / 1.75
    //         };
    //       }
    //       if (project.imageGallery) {
    //         for (var i = 0; i < project.imageGallery.length; i++) {
    //           $scope.images.push(project.imageGallery[i]);
    //         }
    //       }
    //       getUserFavoriteStoriesFn($scope.user.favorites, $scope.project.id);
    //     });
    //
    // };
    
  }
]);
