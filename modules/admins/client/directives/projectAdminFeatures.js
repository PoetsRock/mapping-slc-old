'use strict';

angular.module('admins').directive('projectAdminFeatures', function () {
	return {
		restrict: 'EA',
		templateUrl: '/modules/admins/client/directives/views/project-admin-features.html',

		link: function ($scope) {
			console.log('inside directive projAdminFeatures, logging $scope.project:\n', $scope.project);
			if($scope.project.status === 'published'){
			}
		}
	};
});


