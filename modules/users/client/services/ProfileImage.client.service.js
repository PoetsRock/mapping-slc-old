'use strict';

// retrieve user's profile image

angular.module('users').service('ProfileImageService', ['$http', 'Authentication',
	function($http, Authentication) {

    var user = Authentication.user;

		this.getUploadedProfilePic = function() {
			var configObj = {cache: true};

      if(user.profileImageFileName === 'uploaded-profile-image.png') {
        console.log('uploaded-profile-image.png:\n', user.profileImageFileName);
        user.profileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.png';
      }
      else if (user.profileImageFileName === 'uploaded-profile-image.jpg') {
        console.log('uploaded-profile-image.jpg:\n', user.profileImageFileName);
        user.profileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.jpg';
      }
			else if(user.profileImageFileName !== 'default.png' && user.profileImageFileName !== '') {
        console.log('user.profileImageFileName !== && user.profileImageFileName !== :\n', user.profileImageFileName);
				//get request with cache lookup
				$http.get('api/v1/users/' + user._id + '/media/uploadedProfileImage/' +  user.profileImageFileName, configObj)
					.then(function(profilePic, err){
						if(err){
							console.log('profile photo error', err);
							user.profileImage = 'modules/users/client/img/profile/default.png';
						} else {
							user.profileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.jpg';
						}
					});
			} else {
        console.log('else:\n', user.profileImageFileName);
				//get request with cache lookup
				user.profileImage = 'modules/users/client/img/profile/default.png';
			}
		};


	}
]);
