'use strict';

// Authentication service for user variables
angular.module('users').factory('AdminAuthService', ['$window', 'Authentication',
	function($window, Authentication) {

		if(Authentication.user !== '') {

			var isAdmin = {
				user: $window.user.roles[0]
			};
			//console.log('isAdmin.user', isAdmin.user);
			return isAdmin;

		} else {

			isAdmin = {
				user: 'notAdmin'
			};
			//console.log('!isAdmin.user', isAdmin.user);
			return isAdmin;
		}
	}
]);
