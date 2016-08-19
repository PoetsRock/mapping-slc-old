'use strict';

angular.module('admins').directive('projectAdminFeatures', function () {
  return {
    restrict: 'EA',
    templateUrl: '/modules/admins/client/directives/views/project-admin-features.html',
    controller: function ($scope) {

      $scope.featuredProjects = [
        { category: 'sortOrder', name: 'Not Featured', value: 'false' },
        { category: 'sortOrder', name: 'Featured', value: 'true' },
      ];

      $scope.statusSorts = [
        { category: 'sortOrder', name: 'Received', value: 'received' },
        { category: 'sortOrder', name: 'Pending', value: 'pending' },
        { category: 'sortOrder', name: 'Rejected', value: 'rejected' },
        { category: 'sortOrder', name: 'Soft Rejection', value: 'soft_rejection' },
        { category: 'sortOrder', name: 'Revise', value: 'revise' },
        { category: 'sortOrder', name: 'Pulled by User', value: 'userPulled' },
        { category: 'sortOrder', name: 'Pulled by Admin', value: 'adminPull' },
        { category: 'sortOrder', name: 'Accepted', value: 'accepted' },
        { category: 'sortOrder', name: 'Published', value: 'published' },
      ];

      $scope.adminCategorySorts = [
        { category: 'sortOrder', name: 'Essay', value: 'essay' },
        { category: 'sortOrder', name: 'Multimedia', value: 'multimedia' },
        { category: 'sortOrder', name: 'Video', value: 'video' },
        { category: 'sortOrder', name: 'Audio', value: 'audio' },
        { category: 'sortOrder', name: 'Photography', value: 'photography' },
        { category: 'sortOrder', name: 'This Was Here', value: 'this-was-here' }
      ];

    },
  };
});


