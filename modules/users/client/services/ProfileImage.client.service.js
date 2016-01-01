'use strict';

// retrieve user's profile image

angular.module('users').service('ProfileImageService', ['$http', 'Authentication',
	function($http, Authentication) {
		//console.log('uploader working for profilePic Service');


		//this.getUploadedProfilePic = function() {
		//		var user = Authentication.user;
		//		var configObj = {cache: true, responseType: 'arraybuffer'};
		//		var userProfileImage = '';
    //
		//	$http.get('api/v1/users/' + user._id + '/media/' +  user.profileImageFileName, configObj)
		//		.then(function successCallback(successCallback) {
		//			console.log('profilePic', successCallback);
		//			console.log('profilePic.data', successCallback.data);
		//			console.log('successCallback.data.object.data', successCallback.data.object.data);
		//			return userProfileImage = successCallback.data.object.data;
		//			//return userProfileImage = fileReader.readAsDataURL(imageAsBuffer);
    //
		//			//return userProfileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.jpg';
		//		}, function errorCallback(errorCallback) {
		//			console.log('profile photo error', errorCallback);
		//			return userProfileImage = 'modules/users/client/img/profile/default.png';
		//		});

    var user = Authentication.user;

    this.getUploadedProfilePic = function() {
      var configObj = {cache: true};

			$http.get('api/v1/users/' + user._id + '/media/uploadedProfileImage/' +  user.profileImageFileName, configObj)
				.then(function successCallback(successCallback) {
					console.log('profilePic', successCallback);
					user.profileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.jpg';
				}, function errorCallback(errorCallback) {
					console.log('profile photo error', errorCallback);
					user.profileImage = 'modules/users/client/img/profile/default.png';
				});

      //else if(user.profileImageFileName === 'uploaded-profile-image.png') {
       // console.log('uploaded-profile-image.png:\n', user.profileImageFileName);
       // user.profileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.png';
      //}
      //else if (user.profileImageFileName === 'uploaded-profile-image.jpg') {
       // console.log('uploaded-profile-image.jpg:\n', user.profileImageFileName);
       // user.profileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.jpg';
      //}
			//else if(user.profileImageFileName !== 'default.png' && user.profileImageFileName !== '') {
       // console.log('user.profileImageFileName !== && user.profileImageFileName !== :\n', user.profileImageFileName);
			//	//get request with cache lookup
			//
			//} else {
       // console.log('else:\n', user.profileImageFileName);
			//	//get request with cache lookup
			//	user.profileImage = 'modules/users/client/img/profile/default.png';
			//}
		};


	}
]);
