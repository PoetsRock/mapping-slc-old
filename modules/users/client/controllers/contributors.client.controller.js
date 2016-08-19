'use strict';


angular.module('users').controller('ContributorController', ['$scope', '$animate', '$location', 'Authentication', 'GetContributors', '$stateParams', '$http', '$uibModal', '$window', 'Lightbox', 'UtilsService', 'Users', 'Projects',
  function ($scope, $animate, $location, Authentication, GetContributors, $stateParams, $http, $uibModal, $window, Lightbox, UtilsService, Users, Projects) {

    $scope.contributors = null;
    $scope.contributor = {};
    $scope.contributorProjects = [];
    $scope.contribData = {};

    //provides logic for the css in the forms
    UtilsService.cssLayout();

    /**
     * Lightbox
     */
    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.images, index);
    };

    $scope.images = [];
    var getImages = function (contribData) {
      console.log('getImages Function `contribData`:\n', contribData);
      for (var i = 0; i < contribData.length; i++) {
        var tempData = {};
        tempData.url = contribData[i].profileImageURL;
        tempData.thumbUrl = contribData[i].profileImageThumbURL;
        tempData.caption = contribData[i].bio;
        $scope.images.push(tempData);
      }
      console.log('getImages Function `$scope.images`:\n', $scope.images);
    };

    $scope.getContributors = function () {
      GetContributors.contributors()
      .then(function (contributorsData) {
        $scope.contributors = contributorsData.data;
        getImages($scope.contributors);
        console.log('getContributors Fn `$scope.contributors`:\n', $scope.contributors);
      }).catch(function (errorData) {
        console.log('errorData: ', errorData);
      });
    };


    $scope.findContributor = function () {
      $http.get(`/api/v1/contributors/${$stateParams.userId}`)
      .then(function (userData) {
        $scope.contributor = userData.data;
        getAssociatedProjects(userData.data);
      });
    };

    var getAssociatedProjects = function (userObj) {
      for (var i = 0; i < userObj.associatedProjects.length; i++) {
        Projects.get({projectId: userObj.associatedProjects[i]},
          function (projectObj) {
            $scope.contributorProjects.push(projectObj);
          });
      }
    };


    $scope.changeView = function (view) {
      $location.path(view);
    };

  }
]);
