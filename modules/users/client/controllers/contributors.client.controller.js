'use strict';


angular.module('users')
.config(function (LightboxProvider) {
  LightboxProvider.fullScreenMode = false;
})
.controller('ContributorController', ['$scope', '$animate', '$location', 'Authentication', 'GetContributors', '$stateParams', '$http', '$uibModal', '$window', 'Lightbox', 'UtilsService',
  function ($scope, $animate, $location, Authentication, GetContributors, $stateParams, $http, $uibModal, $window, Lightbox, UtilsService) {

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
      for (var i = 0; i < contribData.length; i++) {
        var tempData = {};
        tempData.url = contribData[i].profileImageURL;
        tempData.thumbUrl = contribData[i].profileImageThumbURL;
        tempData.caption = contribData[i].bio;
        $scope.images.push(tempData);
      }
    };

    var getAssociatedProjects = function (userId) {
      $http.get(`/api/v1/contributors/${userId}/projects?publishedOnly=true`)
      .then(function successCb(projects) {
        $scope.contributorProjects = projects.data;
      }, function errorCb(errorData) {
        console.log('errorData: ', errorData);
      });
    };


    $scope.getContributors = function () {
      GetContributors.contributors()
      .then(function (contributorsData) {
        $scope.contributors = contributorsData.data;
        getImages($scope.contributors);
      }, function errorCb(errorData) {
        console.log('errorData: ', errorData);
      });
    };


    $scope.findContributor = function () {
      $http.get(`/api/v1/contributors/${$stateParams.userId}`)
      .then(function (userData) {
        getAssociatedProjects(userData.data._id);
        $scope.contributor = userData.data;
      }, function errorCb(errorData) {
        console.log('errorData: ', errorData);
      });
    };


    $scope.changeView = function (view) {
      $location.path(view);
    };

  }
]);
