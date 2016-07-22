'use strict';


angular.module('users').controller('ContributorController', ['$scope', '$animate', '$location', 'Authentication', 'GetContributors', '$stateParams', '$http', '$uibModal', '$window', 'Lightbox', 'UtilsService', 'Users', 'Projects',
  function ($scope, $animate, $location, Authentication, GetContributors, $stateParams, $http, $uibModal, $window, Lightbox, UtilsService, Users, Projects) {

    $scope.contributors = null;
    $scope.contributor = {};
    $scope.contributorProjects = [];
    $scope.contribData = {};
    $scope.images = [];

    //provides logic for the css in the forms
    UtilsService.cssLayout();

    /**
     * Lightbox
     */
    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.images, index);
    };

    $scope.init = function () {
      getContribData();
    };

    var getContribData = function () {
      GetContributors.contributors()
        .success(function (contributorsData) {
          getImages(contributorsData);
          $scope.contributors = contributorsData;
          return $scope.images;
        }).error(function (errorData) {
        console.log('errorData: ', errorData);
      });
    };

    var getImages = function (contribData) {
      for (var i = 0; i < contribData.length; i++) {
        var tempData = {};
        tempData.url = contribData[i].profileImageURL;
        tempData.thumbUrl = contribData[i].profileImageThumbURL;
        tempData.caption = contribData[i].bio;
        $scope.images.push(tempData);
      }

    };

    $scope.findContributor = function () {
      console.log('$scope.findContributor() invoked');
      console.log('$stateParams:\n', $stateParams);
      console.log('$stateParams.userId: ', $stateParams.userId);
      $http.get(`/api/v1/contributors/${$stateParams.userId}`);
      // Users.query({ userId: $stateParams.userId },
      //   function (userData) {
      //     console.log('userData:\n', userData);
      //     getAssociatedProjects(userData);
      //     $scope.contributor = userData;
      //   });
    };

    var getAssociatedProjects = function (userObj) {
      for (var i = 0; i < userObj.associatedProjects.length; i++) {
        Projects.get({ projectId: userObj.associatedProjects[i] },
          function (projectObj) {
            $scope.contributorProjects.push(projectObj);
          })
      }
    };


    $scope.changeView = function (view) {
      $location.path(view);
    };

  }
]);
