'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngTouch', 'ngSanitize',  'ngMessages', 'ngCookies', 'ui.router', 'ui.bootstrap', 'ui.utils', 'ngCkeditor', 'bootstrapLightbox', 'cgNotify', 'angular-loading-bar', 'videosharing-embed', 'ngFileUpload'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin');
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    if (!fromState.data || !fromState.data.ignoreState) {
      $state.previous = {
        state: fromState,
        params: fromParams,
        href: $state.href(fromState, fromParams)
      };
    }
  });
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('admins');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('chat');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('contacts');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

/**




console.log('#   __    __                            __     __                                            __       __\n#  /  |  /  |                          /  |   /  |                                          /  \     /  |\n#  $$ |  $$ | ______  __    __        _$$ |_  $$ |____   ______   ______   ______           $$  \   /$$ | ______   ______   ______   ______   ______\n#  $$ |__$$ |/      \\/  |  /  |      / $$   | $$      \\ /      \\ /      \\ /      \\          $$$  \\ /$$$ |/      \\ /      \\ /      \\ /      \\ /      \\\n#  $$    $$ /$$$$$$  $$ |  $$ |      $$$$$$/  $$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$  |         $$$$  /$$$$ |$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$  /$$$$$$  |\n#  $$$$$$$$ $$    $$ $$ |  $$ |        $$ | __$$ |  $$ $$    $$ $$ |  $$/$$    $$ |         $$ $$ $$/$$ |/    $$ $$ |  $$ $$ |  $$ $$    $$ $$ |  $$/\n#  $$ |  $$ $$$$$$$$/$$ \__$$ |        $$ |/  $$ |  $$ $$$$$$$$/$$ |     $$$$$$$$/ __       $$ |$$$/ $$ /$$$$$$$ $$ |__$$ $$ |__$$ $$$$$$$$/$$ |__\n#  $$ |  $$ $$       $$    $$ |        $$  $$/$$ |  $$ $$       $$ |     $$       /  |      $$ | $/  $$ $$    $$ $$    $$/$$    $$/$$       $$ /  |\n#  $$/   $$/ $$$$$$$/ $$$$$$$ |         $$$$/ $$/   $$/ $$$$$$$/$$/       $$$$$$$/$$/       $$/      $$/ $$$$$$$/$$$$$$$/ $$$$$$$/  $$$$$$$/$$/$$/\n#                    /  \__$$ |                                                   $/                             $$ |     $$ |\n#                    $$    $$/                                                                                   $$ |     $$ |\n#                     $$$$$$/                                                                                    $$/      $$/');




**/

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('projects');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

'use strict';

//Setting up route
angular.module('admins').config(['$stateProvider',
  function ($stateProvider) {
    // Projects state routing
    $stateProvider.
      state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view>',
        //data property is inherited by child states, so you can place something like this authenticate flag in the parent.
        data: {
          authenticate: true,
          data: {
            roles: ['admin', 'superUser']
          }
        }
      })
    //admin projects routes
      .state('admin.dashboard', {
        url: '/dashboard',
        templateUrl: 'modules/admins/client/views/admins.client.view.html',
        data: {
          authenticate: true,
          data: {
            roles: ['admin', 'superUser']
          }
        }
      })
      .state('admin.adminProjectsQueue', {
        url: '/projects-queue',
        templateUrl: 'modules/admins/client/views/projects/admin-projects-list.client.view.html'
      })
      .state('admin.adminEditProject', {
        url: '/edit-project/:projectId',
        templateUrl: 'modules/admins/client/views/projects/admin-view-project.client.view.html'
      })


    //admin contact form routes
      .state('admin.adminListMessages', {
        url: '/messages',
        templateUrl: 'modules/admins/client/views/messages/admin-list-messages.client.view.html'
      })
      .state('admin.adminViewMessage', {
        url: '/messages/:contactId',
        templateUrl: 'modules/admins/client/views/messages/admin-view-message.client.view.html'
      })


    //admin user routes
      .state('admin.adminListUsers', {
        url: '/list-users',
        templateUrl: 'modules/admins/client/views/users/admin-list-users.client.view.html'
      })
      .state('admin.adminViewUser', {
        url: '/users/:userId',
        templateUrl: 'modules/admins/client/views/users/admin-view-user.client.view.html'
      }).
      state('adminEditUser', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/admins/client/views/users/admin-edit-user.client.view.html'
      })
      .state('admin.createUser', {
        url: '/create-user',
        templateUrl: 'modules/users/client/views/create-user.client.view.html'
      });
  }

]);

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

		$scope.colorsArray = ["Red", "Green", "Blue"];



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

	}
]);

//'use strict';
//
////angular.module('admins').run(function($rootScope) {
////	angular.element(document).on('click', function(e) {
////		$rootScope.$broadcast('documentClicked', angular.element(e.target));
////	});
////});
//
//angular.module('admins').directive('dropdown', function($rootScope) {
//	return {
//		restrict: 'E',
//		templateUrl: '/modules/admins/directives/views/dropdown.html',
//		scope: {
//			placeholder: '@',
//			list: '=',
//			selected: '=',
//			property: '@'
//		},
//		link: function(scope) {
//			scope.listVisible = false;
//			scope.isPlaceholder = true;
//
//			scope.select = function (item) {
//				scope.isPlaceholder = false;
//				scope.selected = item;
//			};
//
//			scope.isSelected = function (item) {
//				return item[scope.property] === scope.selected[scope.property];
//			};
//
//			scope.show = function () {
//				scope.listVisible = true;
//			};
//
//			//$rootScope.$on('documentClicked', function(inner, target) {
//			//	console.log($(target[0]).is('.dropdown-display.clicked') || $(target[0]).parents('.dropdown-display.clicked').length > 0);
//			//	if (!$(target[0]).is('.dropdown-display.clicked') && !$(target[0]).parents('.dropdown-display.clicked').length > 0)
//			//		scope.$apply(function() {
//			//			scope.listVisible = false;
//			//		});
//			//});
//
//			$rootScope.on('documentClicked', function(inner, target) {
//				var parent = angular.element(target.parent()[0]);
//				if (!parent.hasClass('clicked')) {
//					scope.$apply(function () {
//						scope.listVisible = false;
//					});
//				}
//			});
//
//			scope.$watch('selected', function(value) {
//				scope.isPlaceholder = scope.selected[scope.property] === undefined;
//				scope.display = scope.selected[scope.property];
//			});
//		}
//	}
//})
//
//	.run(function($rootScope) {
//		angular.element(document).on('click', function(e) {
//			$rootScope.$broadcast('documentClicked', angular.element(e.target));
//		});
//	});
'use strict';

angular.module('admins').directive('projectAdminFeatures', function () {
	return {
		restrict: 'E',
		templateUrl: '/modules/admins/client/directives/views/project-admin-features.html',

		//require: 'ngModel',
		link: function (scope, element, attrs, modelCtrl) {
			if(scope.project.status === 'published'){
				console.log('pub be hooked, yo, up yeah up');
				//fire pub confirm modal and then publish project function
			}

		}

	};
});

'use strict';

angular.module('admins').directive('projectEditor', function() {
        return {
            restrict: 'E',
            templateUrl: '/modules/admins/client/directives/views/project-editor.html'
        };
    });

'use strict';

angular.module('admins').directive('projectMainTab', function () {
	return {
		restrict: 'E',
		templateUrl: '/modules/admins/client/directives/views/project-main-tab.html'
	};
});

'use strict';

angular.module('admins').directive('projectMultimedia', function () {
	return {
		restrict: 'E',
		templateUrl: '/modules/admins/client/directives/views/project-multimedia.html'
	};
});

'use strict';

angular.module('admins').directive('projectViewForm', function() {
        return {
            restrict: 'E',
            templateUrl: '/modules/admins/client/directives/views/project-view-form.html'
        };
    });

'use strict';

angular.module('admins').directive('userViewForm', function() {
        return {
            restrict: 'E',
            templateUrl: '/modules/admins/client/directives/views/user-view-form.html'
        };
    });

'use strict';

//Admins service used for communicating with the articles REST endpoints
angular.module('admins').factory('Admins', ['$resource',
  function ($resource) {
    return $resource('api/v1/admins/:adminId', {
      adminId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

'use strict';

// Configuring the Chat module
angular.module('chat').run(['Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Chat',
      state: 'chat'
    });
  }
]);

'use strict';

// Configure the 'chat' module routes
angular.module('chat').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        templateUrl: 'modules/chat/client/views/chat.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', '$location', 'Authentication', 'Socket',
  function ($scope, $location, Authentication, Socket) {
    // Create a messages array
    $scope.messages = [];

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // Make sure the Socket is connected
    if (!Socket.socket) {
      Socket.connect();
    }

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function (message) {
      $scope.messages.unshift(message);
    });

    // Create a controller method for sending messages
    $scope.sendMessage = function () {
      // Create a new message object
      var message = {
        text: this.messageText
      };

      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);

      // Clear the message text
      this.messageText = '';
    };

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('chatMessage');
    });
  }
]);

'use strict';

//Setting up route
angular.module('contacts').config(['$stateProvider',
    function ($stateProvider) {
        // Contacts state routing
        $stateProvider.
            state('createContact', {
                url: '/contact-us',
                templateUrl: 'modules/contacts/client/views/contact-us.client.view.html',
            })
            .state('editContact', {
                url: '/contacts/:contactId/edit',
                templateUrl: 'modules/contacts/client/views/edit-contact.client.view.html'
            })
            .state('aboutMappingSlc', {
                url: '/about-the-project',
                templateUrl: 'modules/contacts/client/views/about-mapping-slc.client.view.html'
            })
            .state('aboutUs', {
              url: '/about-us',
              templateUrl: 'modules/contacts/client/views/about-us.client.view.html'
            });
    }
]);

'use strict';

// Contacts controller
angular.module('contacts').controller('ContactsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Contacts', '$http', 'AdminAuthService', 'UtilsService', 'notify',
	function($scope, $stateParams, $location, Authentication, Contacts, $http, AdminAuthService, UtilsService, notify) {
		$scope.authentication = Authentication;
		$scope.isAdmin = AdminAuthService;

		//function to create a link on an entire row in a table
		$scope.viewMessage = function(contactId) {
			$location.path('admin/messages/' + contactId);
		};

		//provides logic for the css in the forms
		UtilsService.cssLayout();


		//todo  'moment' is not defined.  --> from grunt jslint
		// $scope.dateNow = moment();


		$scope.toggleSort = true;
		$scope.oneAtATime = true;

		// Create new Contact
		$scope.create = function() {
			// Create new Contact object
			var contact = new Contacts ({
				firstName: this.firstName,
				lastName: this.lastName,
				email: this.email,
				zip: this.zip,
				newsletter: this.newsletter,
				message: this.message
			});

			// Redirect after save
			contact.$save(function(response) {
				$location.path('/');

				// Clear form fields
				$scope.firstName = '';
				$scope.lastName = '';
				$scope.email = '';
				$scope.zip = '';
				$scope.newsletter = '';
				$scope.message = '';
        console.log('response:\n', response);
        if(response.$resolved) {
          notify({
            message: 'Thanks for the message!',
            classes: 'ng-notify-contact-success'
          })
        }else{
          notify({
            message: 'Something went wrong, and we didn\'t receive your message We apologize.',
            classes: 'ng-notify-contact-failure'
          })
        }
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Contact
		$scope.remove = function(contact) {
			if ( contact ) { 
				contact.$remove();

				for (var i in $scope.contacts) {
					if ($scope.contacts [i] === contact) {
						$scope.contacts.splice(i, 1);
					}
				}
			} else {
				$scope.contact.$remove(function() {
					$location.path('contacts');
				});
			}
		};

		// Update existing Contact
		$scope.update = function() {
			var contact = $scope.contact;

			contact.$update(function() {
				$location.path('contacts/' + contact._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Contacts
		$scope.find = function() {
			$scope.contacts = Contacts.query();
		};

		// Find existing Contact
		$scope.findOne = function() {
			$scope.contact = Contacts.get({ 
				contactId: $stateParams.contactId
			});
		};

		//get data from back end for display in table
		$http.get('/contacts').
			success(function(messageData){
				//console.log(messageData);
				$scope.messageData = messageData;

				$scope.sentToday = function(){
					//if(messageData.created === moment()){
					//	return moment().calendar(messageData.created);
					//}else{
						var today = moment().calendar(messageData.created);
						return today;
					//}
				};

			}).
			error(function(data, status){

			});

	}
]);



'use strict';

//Contacts service used to communicate Contacts REST endpoints
angular.module('contacts').factory('Contacts', ['$resource',
	function($resource) {
		return $resource('api/v1/contacts/:contactId', { contactId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

//'use strict';
//
//// Setting up route
//angular.module('core.admin.routes').config(['$stateProvider',
//  function ($stateProvider) {
//    $stateProvider
//      .state('admin', {
//        abstract: true,
//        url: '/admin',
//        template: '<ui-view/>',
//        data: {
//          roles: ['admin']
//        }
//      });
//  }
//]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('subscribeForm', {
      url: '/subscribe-form',
      templateUrl: 'modules/core/views/subscribe-form.client.view.html'
    })
    .state('uploads', {
      url: '/uploads',
      templateUrl: 'modules/core/views/file-upload.client.view.html'
    })
    .state('uploadFile', {
      url: '/uploads/:fileHash'
      //templateUrl: 'modules/users/views/create-user.client.view.html'
    });
  }
]);

'use strict';

// Controller that serves a random static map for secondary views
angular.module('core').controller('RandomMapController', ['$scope', '$stateParams', '$location', 'RandomMapService',
    function($scope, $stateParams, $location, RandomMapService) {

        $scope.staticMap = RandomMapService.getRandomMap();
        $scope.myFunction = function(){
            console.log('error loading that map!');
        };

    }
]);


'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ApiKeys', '$http', 'MarkerDataService', 'mapService', 'AdminAuthService', '$rootScope', '$location', '$sce', 'UtilsService',
  function ($scope, Authentication, ApiKeys, $http, MarkerDataService, mapService, AdminAuthService, $rootScope, $location, $sce, UtilsService) {

    $scope.authentication = Authentication;
    $scope.isAdmin = AdminAuthService;

    //for overlay
    $scope.featuredProjects = {};

    //provides logic for the css in the forms
    UtilsService.cssLayout();

    //menu functions
    $scope.trustAsHtml = $sce.trustAsHtml;
    $scope.goToProject = function (id) {
      $location.path('projects/' + id);
    };

    //placeholder for featured projects images
    //todo once admin module is built, create a function that makes photo1 and 2 dynamic rather than hard-coded
    $scope.photo0 = 'chris--bw-2.jpg';
    $scope.photo1 = 'as_thumb_150.jpg';
    $scope.photo2 = 'wli_thumb_150.jpg';
    $scope.photo3 = 'dw_thumb_150.jpg';
    $scope.photo4 = 'as_thumb_bw.png';

    $scope.projectMarker = null;
    $scope.markerData = null;

    /**
     * test for getting and setting cookies
     */

    /**
     *
     * Animation Functionality
     *
     **/

    $scope.overlayActive = true;
    $scope.menuOpen = false;
    //var changeMapFrom = null;
    $scope.shadeMap = false;

    $scope.toggleTest = function(){
      $scope.shadeMap = !$scope.shadeMap;
      console.log('$scope.shadeMap: ', $scope.shadeMap);
    };


    $scope.toggleOverlayFunction = function (source) {
      if ($scope.overlayActive && source === 'overlay') {
        $scope.overlayActive = !$scope.overlayActive;
        $scope.shadeMap = true;
      } else if ($scope.overlayActive && source === 'menu-closed') {
        $scope.overlayActive = false;
        $scope.menuOpen = true;
        $scope.shadeMap = true;
      } else if (!$scope.overlayActive && source === 'menu-closed' && !$scope.menuOpen) {
        $scope.menuOpen = !$scope.menuOpen;
        $scope.shadeMap = false;
      } else if (!$scope.overlayActive && source === 'home') {
        $scope.menuOpen = false;
        $scope.overlayActive = true;
        $scope.shadeMap = false;
      }
    };

    //atrribution toggle
    $scope.attributionFull = false;
    $scope.attributionText = '<div style="padding: 0 5px 0 2px"><a href="http://www.mapbox.com/about/maps/" target="_blank">Mapbox</a> & <a href="http://leafletjs.com/" target="_blank">Leaflet</a>, with map data by <a href="http://openstreetmap.org/copyright">OpenStreetMap©</a> | <a href="http://mapbox.com/map-feedback/" class="mapbox-improve-map">Improve this map</a></div>';

    /**
     *
     * Map Functionality
     *
     **/

    $scope.markers = true;
    $scope.filters = true;
    $scope.censusDataTractLayer = true;
    $scope.googlePlacesLayer = false;
    //$scope.toggleProjectDetails = false;
    $scope.sidebarToggle = false;


    //service that returns api keys
    ApiKeys.getApiKeys()
      .success(function (data) {
        mapFunction(data.mapboxKey, data.mapboxSecret);
      })
      .error(function (data, status) {
        alert('Failed to load Mapbox API key. Status: ' + status);
      });

    var popupIndex = 0;

//
// call map and add functionality
//


    var mapFunction = function (key, accessToken) {
      //creates a Mapbox Map
      L.mapbox.accessToken = accessToken;

      //'info' id is part of creating tooltip with absolute position
      var info = document.getElementById('info');

      var map = L.mapbox.map('map', null, {
          infoControl: false, attributionControl: false
        })
        .setView([40.7630772, -111.8689467], 12)
        .addControl(L.mapbox.geocoderControl('mapbox.places', { position: 'topright' }))
        .addControl( L.control.zoom({position: 'topright'}) );
        //.addControl(L.mapbox.Zoom({ position: 'topright' }));

      var grayMap = L.mapbox.tileLayer('poetsrock.b06189bb'),
        mainMap = L.mapbox.tileLayer('poetsrock.la999il2'),
        topoMap = L.mapbox.tileLayer('poetsrock.la97f747'),
        greenMap = L.mapbox.tileLayer('poetsrock.jdgpalp2'),
        landscape = L.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png'),
        comic = L.mapbox.tileLayer('poetsrock.23d30eb5'),
        watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png');

      var layers = {
        'Main Map': mainMap,
        'Topo Map': topoMap,
        'Green Map': greenMap,
        'Landscape': landscape,
        'Comically Yours': comic,
        'Gray Day': grayMap,
        'Watercolor': watercolor
      };

      mainMap.addTo(map);
      L.control.layers(layers).addTo(map);

      //var markers = new L.MarkerClusterGroup();
      //markers.addLayer(new L.Marker(getRandomLatLng(map)));
      //map.addLayer(markers);


      //service that returns project markers
      MarkerDataService.getMarkerData()
        .success(function (markerData) {
          //$scope.getProjectMarkers(markerData);
          $scope.addProjectMarkers(markerData);
        })
        .error(function (data, status) {
          alert('Failed to load project markers. Status: ' + status);
        });

      $scope.markerArray = [];

      //add markers from marker data
      $scope.addProjectMarkers = function (markerData) {
        $scope.markerData = markerData;
        var index = 0;


        //loop through markers array and return values for each property
        for (var prop in markerData) {

          $scope.projectMarker = L.mapbox.featureLayer({
              //var singleMarker = L.mapbox.featureLayer({
              // this feature is in the GeoJSON format: see geojson.org for full specs
              type: 'Feature',
              geometry: {
                type: 'Point',
                // coordinates here are in longitude, latitude order because
                // x, y is the standard for GeoJSON and many formats
                coordinates: [markerData[prop].lng, markerData[prop].lat]
              },
              properties: {
                // one can customize markers by adding simplestyle properties
                // https://www.mapbox.com/guides/an-open-platform/#simplestyle
                'marker-size': 'large',
                'marker-color': mapService.markerColorFn(markerData, prop),
                //'marker-color': '#00ff00',
                'marker-symbol': 'heart',
                projectId: markerData[prop]._id,
                summary: markerData[prop].storySummary,
                title: markerData[prop].title,
                mainImage: markerData[prop].mainImage,
                category: markerData[prop].category,
                mapImage: markerData[prop].mapImage,
                lat: markerData[prop].lat,
                lng: markerData[prop].lng,
                published: markerData[prop].created,
                leafletId: null,
                arrayIndexId: index
              }
            })
            //create toogle for marker event that toggles sidebar on marker click
            .on('click', function (e) {
              $scope.$apply(function () {
                $scope.storyEvent = e.target._geojson.properties;
              });
              map.panTo(e.layer.getLatLng()); //	center the map when a project marker is clicked
              popupMenuToggle(e);
              return $scope.projectMarker[prop];
            });

          $scope.projectMarker.addTo(map);
          $scope.markerArray.push($scope.projectMarker);
          index++;
        }
        return $scope.markerArray;
      };

      //style the polygon tracts
      var style = {
        'stroke': true,
        'clickable': true,
        'color': "#00D",
        'fillColor': "#00D",
        'weight': 1.0,
        'opacity': 0.2,
        'fillOpacity': 0.0,
        'className': ''  //String that sets custom class name on an element
      };
      var hoverStyle = {
        'color': "#00D",
        "fillOpacity": 0.5,
        'weight': 1.0,
        'opacity': 0.2,
        'className': ''  //String that sets custom class name on an element
      };

      var hoverOffset = new L.Point(30, -16);


      //create toggle/filter functionality for Census Tract Data

      $scope.toggleGooglePlacesData = function () {
        if ($scope.googlePlacesLayer) {
          map.removeLayer(googlePlacesMarkerLayer);
        } else {
          map.addLayer(googlePlacesMarkerLayer);
        }
      };

      map.on('click', function (e) {
        if ($scope.menuOpen) {
          $scope.sidebar.close();
          $scope.shadeMap = false;
        } else {
          console.log('map click!');
          $scope.overlayActive = false;
        }
      });

      $scope.getProjectMarkers = function (markerData) {
      };
    };

    var popupMenuToggle = function (e) {
      if (!$scope.menuOpen && popupIndex !== e.target._leaflet_id) {
        $scope.toggleOverlayFunction('menu-closed');
        //$scope.populateStorySummary($scope.projectDetails);
        $scope.sidebar.open('details');
        popupIndex = e.target._leaflet_id;
      } else if (!$scope.menuOpen && popupIndex === e.target._leaflet_id) {
        //$scope.populateStorySummary($scope.projectDetails);
      } else if ($scope.menuOpen && popupIndex !== e.target._leaflet_id) {
        //$scope.populateStorySummary($scope.projectDetails);
        $scope.sidebar.open('details');
        popupIndex = e.target._leaflet_id;
      } else if ($scope.menuOpen && popupIndex === e.target._leaflet_id) {
        $scope.sidebar.close();
        popupIndex = 0;
      }
    };
  }
]);

'use strict';

angular.module('core').controller('ModalController', ['$scope', '$uibModalInstance',
    function($scope, $uibModalInstance) {

            //$scope.items = items;
            //$scope.selected = {
            //    item: $scope.items[0]
            //};

            $scope.ok = function () {
                $uibModalInstance.close($scope.selected.item);
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
    }
]);

'use strict';

angular.module('core').directive('featuredProjects', function() {
        return {
            restrict: 'E',
            templateUrl: '/modules/core/client/directives/views/featured-projects.html'
        };
    });

'use strict';

angular.module('core').directive('footerDirective', ["UtilsService", function (UtilsService) {
  return {
    restrict: 'AE',
    //replace: true,
    priority: 0,
    templateUrl: '/modules/core/client/directives/views/footer-directive.html',
    controller: ["$scope", "$http", function ($scope, $http) {
      //provides logic for the css in the forms
      UtilsService.cssLayout();
      $scope.create = function () {
        $http({
          method: 'POST',
          url: '/api/v1/auth/signup/newsletter',
          data: {
            email: $scope.email
          }
        }).success(function (data) {
            console.log(data);
            if (data) {
              console.log('YO the DATA', data);
            }
          })
          .error(function (err) {
            console.log(err);
            if (err) {
              $scope.error_message = "Please try again!";
            }
          });

        $scope.email = '';
      }
    }]
  };
}]);

'use strict';

angular.module('core').directive('randomMapDirective', [
    function ($scope) {

        var staticMap = null;

        var maps = {
            'originalMap': 'poetsrock.55znsh8b',
            'grayMap': 'poetsrock.b06189bb',
            'mainMap': 'poetsrock.la999il2',
            'topoMap': 'poetsrock.la97f747',
            'greenMap': 'poetsrock.jdgpalp2',
            'funkyMap': 'poetsrock.23d30eb5'
        };

        /**
         lng: -111.784-999 , -112.0-060,
         lat: 40.845-674
         **/

        //array of
        var randomMap = [maps.originalMap, maps.grayMap, maps.mainMap, maps.topoMap, maps.greenMap, maps.funkyMap];

        var getRandomArbitrary = function (min, max) {
            return Math.random() * (max - min) + min;
        };

        var randomLat = function () {
            var randomLngInt = Math.floor(getRandomArbitrary(111, 113));
            if (randomLngInt === 111) {
                return '-111.' + Math.floor(getRandomArbitrary(7840, 9999));
            } else {
                var randomDecimal = Math.floor(getRandomArbitrary(100, 600));
                return '-112.0' + randomDecimal;
            }
        };

        var randomLng = function () {
            return '40.' + Math.floor(getRandomArbitrary(0, 9999));
        };

        var randomMapId = function () {
            return Math.floor(getRandomArbitrary(0, 7));
        };

        var randomZoom = function () {
            return Math.floor(getRandomArbitrary(10, 18));
        };

        return {
            template: '<div></div>',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {
                staticMap = 'http://api.tiles.mapbox.com/v4/' + randomMap[randomMapId()] + '/' + randomLat() + ',' + randomLng() + ',' + randomZoom() + '/' + '1280x720.png?access_token=pk.eyJ1IjoicG9ldHNyb2NrIiwiYSI6Imc1b245cjAifQ.vwb579x58Ma-CcnfQNamiw';
            }

        };

    }
]);

'use strict';

angular.module('core').directive('mainMenu', ["AdminAuthService", function(AdminAuthService) {
    return {
      restrict: 'EA',
      templateUrl: '/modules/core/client/directives/views/main-menu.html',

      controller: ["$scope", function($scope) {
        $scope.isAdmin = AdminAuthService.user;


        $scope.sidebar = L.control.sidebar('sidebar', {
          closeButton: true,
          position: 'left'
        }).addTo(map);

        $scope.sidebar.click = function() {
          if (L.DomUtil.hasClass(this, 'active')) {
            $scope.sidebar.close();
            console.log('here i am close');
          }
          else {
            $scope.sidebar.open(this.firstChild.hash.slice(1));
            console.log('here i am open');
          }
        };




          //if (child.firstChild.hash == '#' + id)
          //  L.DomUtil.addClass(child, 'active');
          //else if (L.DomUtil.hasClass(child, 'active'))
          //  L.DomUtil.removeClass(child, 'active');

          //
          //if (L.DomUtil.hasClass(this, 'active')) {
          //  $scope.sidebar.close();
          //  console.log('here i am close');
          //}
          //else {
          //  $scope.sidebar.open(this.firstChild.hash.slice(1));
          //  console.log('here i am open');
          //}


      }],

      link: function($scope) {
        //$scope.sidebar = L.control.sidebar('sidebar', {
        //  closeButton: true,
        //  position: 'left'
        //}).addTo(map);


      }

    };
}]);



//// add Admin link in menu if user is admin
//if ($scope.authentication.user.roles[0] === 'admin' || $scope.authentication.user.roles[0] === 'superAdmin')

'use strict';

angular.module('core').directive('mainPageOverlay', function() {
    return {
        restrict: 'AE',
        priority: 10,
        templateUrl:'/modules/core/client/directives/views/main-page-overlay.html'
    };
});

'use strict';

angular.module('core').directive('modalDirective', function() {
        return {
            restrict: 'E',
            link: function() {

            $uibModal.open({
              animation: true,
              templateUrl: '/modules/projects/client/directives/views/project-warning-modal.html',
              controller: function ($scope, $modalInstance, $location) {
                $scope.stay = function (result) {
                  //$modalInstance.dismiss('cancel');
                  console.log('stay just a little bit longer, oh won\'t you stay');
                  $modalInstance.close(function (result) {
                    console.log('result: ', result);
                  });
                };
                $scope.leave = function () {
                  var preventRunning = true;
                  $scope.stay();
                  $location.path(toState);
                };
              },
              size: 'lg'
            });


          }
        };
    });

'use strict';

angular.module('core').directive('secondaryMenuDirective', function() {

    return {

        restrict: 'E',
        templateUrl: '/modules/core/client/directives/views/secondary-menu-directive.html',

        controller: ["AdminAuthService", "$scope", function(AdminAuthService, $scope){
              $scope.isAdmin = AdminAuthService;
        }],

        link: function(scope) {

            scope.secondMenuOpened = false;
            scope.toggleSecondMenu = false;

        }
    }
});

'use strict';

angular.module('core').directive('secondaryPageDirective', function() {
    return {
        restrict: 'AE',
        //replace: true,
        priority: 0,
        templateUrl:'/modules/core/client/directives/views/secondary-page.html'
    };
});

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
}]);

'use strict';

angular.module('core').directive('signInDirective', function() {
        return {
          restrict: 'EA',
          templateUrl: '/modules/core/client/directives/views/sign-in-directive.html',
          controller: ["$scope", "Authentication", function($scope, Authentication) {
            $scope.user = Authentication.user;
            if ($scope.user === '') {
              return
            } else if(Authentication.user.profileImageFileName === 'default.png' || Authentication.user.profileImageFileName === '') {
              $scope.user.profileImage = 'modules/users/client/img/profile/default.png';
            } else if (Authentication.user.profileImageFileName !== '' ) {
              $scope.user.profileImage = 'modules/users/client/img/profile/uploads/uploaded-profile-image.jpg';
            }
            else {
              ProfileImageService.getUploadedProfilePic();
            }

          }]
        };

    });

/**
* Created by poetsrock on 3/11/15.
*/

'use strict';

angular.module('core').directive('submitProjectDirective', function() {
        return {
            restrict: 'E',
            templateUrl: '/modules/core/client/directives/views/submit-project-directive.html'
        };
    });

'use strict';

angular.module('core').service('ApiKeys', ['$http',
	function($http) {
		// ApiKeys service logic
		// ...
        this.getApiKeys = function(){
            return  $http.get('/api/v1/keys');
        };
        this.getTractData = function(){
            return  $http.get('api/v1/tractData');
        };
    }
]);

'use strict';

// Authentication service for user variables
angular.module('core').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

angular.module('core').service('CensusDataService', ['$http', 'ApiKeys',
    function ($http, ApiKeys) {

        //Census Data for Population Stats service logic

        var censusData = null;
        var censusDataKey = 'P0010001';
        var censusYear = [2000, 2010, 2011, 2012, 2013, 2014];
        var population = '';

        this.callCensusApi = function () {
            ApiKeys.getApiKeys()
                .success(function (data) {
                    censusData(data.censusKey);
                })
                .error(function (data, status) {
                    alert('Failed to load Mapbox API key. Status: ' + status);
                });

            censusData = function (censusKey){
                return $http.get('http://api.census.gov/data/' + censusYear[1] + '/sf1?get=' + population + '&for=tract:*&in=state:49+county:035&key=' + censusKey);
            }
        };
    }
]);


//'use strict';
//
//angular.module('core').factory('ErrorHandleService', ['$httpProvider',
//    function($httpProvider){
//    $httpProvider.interceptors.push(['$q',
//        function ($q) {
//            return {
//                responseError: function (rejection) {
//                    console.log(rejection);
//                    switch (rejection.status) {
//                        case 400:
//                            return '400';
//                        case 404:
//                            return '404';
//                    }
//
//                    return $q.reject(rejection);
//                },
//                'response': function(response){
//                    console.log(response);
//                    return response;
//                }
//            };
//        }
//    ])
//}
//]);
'use strict';

angular.module('core').service('FullScreenService', [,
    function() {

        this.fullScreen= function(){

            /**
             * Full-screen functionality
             */
            // Find the right method, call on correct element
            var launchFullscreen = function(element) {
                if(element.requestFullscreen) {
                    element.requestFullscreen();
                } else if(element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if(element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if(element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            };

            // Launch fullscreen for browsers that support it
            //launchFullscreen(document.documentElement); // the whole page
            //launchFullscreen(document.getElementById("videoElement")); // any individual element

            // Whack fullscreen
            var exitFullscreen = function(element) {
                if(document.exitFullscreen) {
                    document.exitFullscreen();
                } else if(document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if(document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            };

// Cancel fullscreen for browsers that support it!
//    exitFullscreen();


        };
    }
]);

'use strict';

angular.module('core').service('RandomMapService', [
    function () {
        
        var staticMap = null;
        
        var maps = {
            'mapbox': {
                'originalMap': 'poetsrock.j5o1g9on',
                'grayMap': 'poetsrock.b06189bb',
                'mainMap': 'poetsrock.la999il2',
                'topoMap': 'poetsrock.la97f747',
                'greenMap': 'poetsrock.jdgpalp2',
                'comic': 'poetsrock.23d30eb5',
                'fancyYouMap': 'poetsrock.m6b73kk7',
                'pencilMeInMap': 'poetsrock.m6b7f6mj'
            },
            'thunderforest': {
                'landscape': 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png'
            },
            'stamen': {
                'watercolor': 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png',
                'toner': 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
            }
        };
        
        var url = {
            'mapbox': 'http://api.tiles.mapbox.com/v4',
            'thunderforest': 'http://{s}.tile.thunderforest.com',
            'stamen': 'http://maps.stamen.com/m2i',
            'ngs': ''
        };
        
        //array of
        var randomMap = [
            ['mapbox', maps.mapbox.originalMap],
            ['mapbox', maps.mapbox.grayMap],
            ['mapbox', maps.mapbox.mainMap],
            ['mapbox', maps.mapbox.topoMap],
            ['mapbox', maps.mapbox.greenMap],
            ['mapbox', maps.mapbox.comic],
            ['mapbox', maps.mapbox.fancyYouMap],
            ['mapbox', maps.mapbox.pencilMeInMap],
            ['stamen', maps.stamen.watercolor],
            ['stamen', maps.stamen.toner],
            ['thunderforest', maps.thunderforest.landscape]
        ];
        
        var getRandomArbitrary = function (min, max) {
            return Math.random() * (max - min) + min;
        };
        
        var randomLat = function () {
            var randomLngInt = Math.floor(getRandomArbitrary(111, 113));
            if (randomLngInt === 111) {
                return '-111.' + Math.floor(getRandomArbitrary(7840, 9999));
            } else {
                var randomDecimal = Math.floor(getRandomArbitrary(100, 600));
                return '-112.0' + randomDecimal;
            }
        };
        
        var randomLng = function () {
            return '40.' + Math.floor(getRandomArbitrary(0, 9999));
        };

        var randomZoom = function () {
            return Math.floor(getRandomArbitrary(9, 16));
        };
        
        this.getRandomMap = function () {
            var randomNum = Math.floor(getRandomArbitrary(0, 10));
            var mapVendor = randomMap[randomNum][0];
            var randomMapId = randomMap[randomNum][1];

            if (mapVendor === 'mapbox') {
                return staticMap = {mapUrl: url.mapbox + '/' + randomMapId + '/' + randomLat() + ',' + randomLng() + ',' + randomZoom() + '/' + '1280x720.png?access_token=pk.eyJ1IjoicG9ldHNyb2NrIiwiYSI6Imc1b245cjAifQ.vwb579x58Ma-CcnfQNamiw'};
            //}else if (mapVendor === 'thunderforest') {
            //    return return staticMap = {mapUrl: url.thunderforest + '/' + randomMapId + '/'};
            } else if (mapVendor === 'stamen') {
                //return staticMap = {mapUrl: url.stamen + '/#watercolor' + '1280:720/' + randomZoom() + '/' + randomLat() + '/' + randomLng()};
                return staticMap = {mapUrl: 'http://maps.stamen.com/m2i/#watercolor/1280:720/14/40.8905/-112.0204'};
            } else {
                console.log('Error!\nrandomNum: ', randomNum, '\nmapVendor', mapVendor, '\nrandomMapId: ', randomMapId );
            }
        }
        
    }
]);
'use strict';

//Google Places API

angular.module('core').factory('googlePlacesService', ['$http',
	function ($http) {
		var googlePlacesMarker = null;
		var googlePlacesMarkerLayer = null;
		var googlePlacesMarkerArray = [];

		var googlePlacesData = function () {
			$http.get('/places').success(function (poiData) {

				var placeLength = poiData.results.length;
				for (var place = 0; place < placeLength; place++) {

					var mapLat = poiData.results[place].geometry.location.lat;
					var mapLng = poiData.results[place].geometry.location.lng;
					var mapTitle = poiData.results[place].name;

					googlePlacesMarker = L.marker([mapLat, mapLng]).toGeoJSON();

					googlePlacesMarkerArray.push(googlePlacesMarker);
				} //end of FOR loop

				googlePlacesMarkerLayer = L.geoJson(googlePlacesMarkerArray, {
					style: function (feature) {
						return {
							'title': mapTitle,
							'marker-size': 'large',
							//'marker-symbol': mapSymbol(),
							'marker-symbol': 'marker',
							'marker-color': '#00295A',
							'riseOnHover': true,
							'riseOffset': 250,
							'opacity': 0.5,
							'clickable': true
						}
					}
				})
			});
		};


	}
]);
'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

//'use strict';
//
//angular.module('core').service('mapFactory', [
//	function () {
//		// Various Services for Map Functionality
//		var color = '';
//		this.markerColorFn = function (markerData) {
//			if (markerData.category === 'video') {
//				color = '#ff0011';
//				//return color;
//			//} else if (markerData[prop].category === 'multimedia') {
//			//	return 'red';
//			//} else if (markerData[prop].category === 'essay') {
//			//	return 'blue';
//			//} else if (markerData[prop].category === 'literature') {
//			//	return 'green';
//			//} else if (markerData[prop].category === 'interview') {
//			//	return 'brown';
//			//} else if (markerData[prop].category === 'map') {
//			//	return 'yellow';
//			//} else if (markerData[prop].category === 'audio') {
//			//	return 'black';
//			} else {
//				color = '#00ff44';
//			}
//		};
//		return color;
//	}
//]);
'use strict';

angular.module('core').service('mapService', [
	function ($scope) {
		// Various Services for Map Functionality

		this.featuredProjects = function (markerData) {
			var featureProjectsArray = [];
			for (var prop in markerData) {
				var i = 0;
				if (i < 2 && markerData[prop].featured) {      //setup for loop to end after finding the first three featured projects
					var featuredProject = {
						thumb: markerData[prop].thumbnail,
						projectId: markerData[prop]._id,
						shortTitle: markerData[prop].shortTitle
					};
					featureProjectsArray.push(featuredProject);
				}
				i++;
			}
		};

		this.markerColorFn = function (markerData, prop) {
			if (markerData[prop].category === 'video') {
				return '#ff0011';
			} else if (markerData[prop].category === 'multimedia') {
				return '#ff0101';
			} else if (markerData[prop].category === 'essay') {
				return '#0015ff';
			} else if (markerData[prop].category === 'literature') {
				return '#15ff35';
			} else if (markerData[prop].category === 'interview') {
				return 'brown';
			} else if (markerData[prop].category === 'map') {
				return 'yellow';
			} else if (markerData[prop].category === 'audio') {
				return '#111111';
			} else {
				return '#00ff44';
			}
		};
	}
]);
'use strict';

angular.module('core').service('MarkerDataService', ['$http',
    function($http) {
        // Project Marker Data Service

        this.getMarkerData = function(){
            return  $http.get('/api/v1/markerData').
                success(function(projects){
                    //console.log('projects: \n', projects);
                    //for (var prop in projects) {
                    //    console.log('projects[prop].lng: \n', projects[prop].lng);
                    //}

                })
                .error(function(error){
                    console.log('marker data error: \n', error);
                });
        };
    }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

//'use strict';
//
//angular.module('core').directive('randomMapDirective', [
//  function ($scope) {
//
//    var staticMap = null;
//
//    var maps = {
//      'originalMap': 'poetsrock.55znsh8b',
//      'grayMap': 'poetsrock.b06189bb',
//      'mainMap': 'poetsrock.la999il2',
//      'topoMap': 'poetsrock.la97f747',
//      'greenMap': 'poetsrock.jdgpalp2',
//      'funkyMap': 'poetsrock.23d30eb5'
//    };
//
//    /**
//     lng: -111.784-999 , -112.0-060,
//     lat: 40.845-674
//     **/
//
//    //array of
//    var randomMap = [maps.originalMap, maps.grayMap, maps.mainMap, maps.topoMap, maps.greenMap, maps.funkyMap];
//
//    var getRandomArbitrary = function (min, max) {
//      return Math.random() * (max - min) + min;
//    };
//
//    var randomLat = function () {
//      var randomLngInt = Math.floor(getRandomArbitrary(111, 113));
//      if (randomLngInt === 111) {
//        return '-111.' + Math.floor(getRandomArbitrary(7840, 9999));
//      } else {
//        var randomDecimal = Math.floor(getRandomArbitrary(100, 600));
//        return '-112.0' + randomDecimal;
//      }
//    };
//
//    var randomLng = function () {
//      return '40.' + Math.floor(getRandomArbitrary(0, 9999));
//    };
//
//    var randomMapId = function () {
//      return Math.floor(getRandomArbitrary(0, 7));
//    };
//
//    var randomZoom = function () {
//      return Math.floor(getRandomArbitrary(10, 18));
//    };
//
//    return {
//      template: '<div></div>',
//      restrict: 'EA',
//      link: function postLink(scope, element, attrs) {
//        staticMap = 'http://api.tiles.mapbox.com/v4/' + randomMap[randomMapId()] + '/' + randomLat() + ',' + randomLng() + ',' + randomZoom() + '/' + '1280x720.png?access_token=pk.eyJ1IjoicG9ldHNyb2NrIiwiYSI6Imc1b245cjAifQ.vwb579x58Ma-CcnfQNamiw';
//      }
//
//    };
//
//    this.staticMap = function() {
//
//    };
//  }
//]);

'use strict';

//Google Places API

angular.module('core').factory('tractDataService', ['$scope', 'ApiKeys',
	function ($scope, ApiKeys) {

		var dataBoxStaticPopup = null,
			tractData = {},
			censusTractData = null;


		ApiKeys.getTractData()
			.success(function (tractData) {
				tractDataLayer(tractData);
			})
			.error(function (tractData) {
				alert('Failed to load tractData. Status: ' + status);
			});
		var tractDataLayer = function (tractData) {
			censusTractData = L.geoJson(tractData, {
					style: style,
					onEachFeature: function (feature, layer) {
						if (feature.properties) {
							var popupString = '<div class="popup">';
							for (var k in feature.properties) {
								var v = feature.properties[k];
								popupString += k + ': ' + v + '<br />';
							}
							popupString += '</div>';
							layer.bindPopup(popupString);
						}
						if (!(layer instanceof L.Point)) {
							layer.on('mouseover', function () {
								layer.setStyle(hoverStyle);
								//layer.setStyle(hoverOffset);
							});
							layer.on('mouseout', function () {
								layer.setStyle(style);
								//layer.setStyle(hoverOffset);
							});
						}

					}
				}
			);
		};

		$scope.dataBoxStaticPopupFn = function (dataBoxStaticPopup) {

			// Listen for individual marker clicks.
			dataBoxStaticPopup.on('mouseover', function (e) {
				// Force the popup closed.
				e.layer.closePopup();

				var feature = e.layer.feature;
				var content = '<div><strong>' + feature.properties.title + '</strong>' +
					'<p>' + feature.properties.description + '</p></div>';

				info.innerHTML = content;
			});

			function empty() {
				info.innerHTML = '<div><strong>Click a marker</strong></div>';
			}

			// Clear the tooltip when .map is clicked.
			map.on('move', empty);

			// Trigger empty contents when the script has loaded on the page.
			empty();

		};

//create toggle/filter functionality for Census Tract Data
		$scope.toggleCensusData = function () {
			if (!$scope.censusDataTractLayer) {
				map.removeLayer(censusTractData);
				map.removeLayer(dataBoxStaticPopup);
			} else {
				map.addLayer(censusTractData);
				map.addLayer(dataBoxStaticPopup);

			}
		};

	}
]);
'use strict';

// Underscore service
angular.module('core').factory('_', [
	function() {
		return window._;
	}
]);
'use strict';

angular.module('core').service('UtilsService', ['$http', '$window',
  function($http, $window) {


    //logic for css on the contact form

    this.cssLayout = function () {
      [].slice.call(document.querySelectorAll('input.input_field'))

        .forEach(function (inputEl) {
          // in case the input is already filled
          if (inputEl.value.trim() !== '') {
            classie.add(inputEl.parentNode, 'input-filled');
          }
          // events
          inputEl.addEventListener('focus', onInputFocus);
          inputEl.addEventListener('blur', onInputBlur);
        });

      function onInputFocus(ev) {
        classie.add(ev.target.parentNode, 'input-filled');
      }

      function onInputBlur(ev) {
        if (ev.target.value.trim() === '') {
          classie.remove(ev.target.parentNode, 'input-filled');
        }
      }
    };


  }
]);

'use strict';

//Setting up route
angular.module('projects').config(['$stateProvider',
  function ($stateProvider) {
    // Projects state routing
    $stateProvider.
    state('listProjects', {
      url: '/projects',
      templateUrl: 'modules/projects/client/views/list-projects.client.view.html'
    }).
    state('createProject', {
      url: '/projects/create',
      templateUrl: 'modules/projects/client/views/create-project.client.view.html'
    }).
    state('viewProject', {
      url: '/projects/:projectId',
      templateUrl: 'modules/projects/client/views/view-project.client.view.html'
    }).
    state('editProject', {
      url: '/projects/:projectId/edit',
      templateUrl: 'modules/projects/client/views/edit-project.client.view.html',
      data: {
        authenticate: true,
        roles: ['contributor', 'admin', 'superUser']
      }
    }).
    state('confirmCreateProject', {
      url: '/projects/:projectId/status',
      //data: {
      //  authenticate: true,
      //  roles: ['contributor', 'admin', 'superUser']
      //}
      templateUrl: 'modules/projects/client/views/project-for-submission.client.view.html'
    });
  }
]);

'use strict';

angular.module('projects').controller('ProjectsUploadController', ['$scope', '$timeout', '$window', 'Authentication', 'Upload', '$http',
  function ($scope, $timeout, $window, Authentication, Upload, $http) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;
    $scope.uploading = false;

    $scope.onFileSelect = function(files) {

      if (files.length > 0) {
        $scope.uploading = true;
        var filename = files[0].name;
        var type = files[0].type;
        var query = {
          filename: filename,
          type: type,
          user: $scope.user,
          project: $scope.project
        };
        var configObj = {cache: true};
        $http.post('api/v1/s3/upload/project', query, configObj)
          .success(function(result) {
            console.log('result v1\n', result);
            Upload.upload({
              url: result.url, //s3Url
              transformRequest: function(data, headersGetter) {
                var headers = headersGetter();
                delete headers.Authorization;
                console.log('data v1\n', data);
                return data;
              },
              fields: result.fields, //credentials
              method: 'POST',
              file: files[0]
            }).progress(function(evt) {

              console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));

            }).success(function(data, status, headers, config) {

              // file is uploaded successfully
              $scope.uploading = false;

              console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);

              // need to set image on front end
              if(data && data.s3Url) {
                console.log('data v2\n', data);
                $scope.user.profileImageURL = data.s3Url;
                $scope.imageURL = data.s3Url;
              }
              console.log('$scope.imageURL:\n', $scope.imageURL);
              //$http({
              //  url: '',
              //  method: 'PUT'
              //})
              //  .then(function(data) {
              //
              //  })
              //  .finally(function(data) {
              //
              //  });

              // and need to update mongodb


            }).error(function() {

            });

            if(result && result.s3Url) {
              console.log('result v2\n', result);
              $scope.user.profileImageURL = result.s3Url;
              $scope.imageURL = result.s3Url;
            }
          })
          .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.uploading = false;
          });

        //  .xhr(function(xhr) {
        //    $scope.abort = function() {
        //    xhr.abort();
        //    $scope.uploading = false;
        //  };
        //});

      }


    };


  }
]);

'use strict';

// Projects controller
angular.module('projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Projects', '$http', '$sce', 'ApiKeys', 'GeoCodeApi', '$rootScope', 'AdminAuthService', 'User', 'AdminUpdateUser', '$state', 'UtilsService', '$uibModal', '$window',
  function ($scope, $stateParams, $location, Authentication, Projects, $http, $sce, ApiKeys, GeoCodeApi, $rootScope, AdminAuthService, User, AdminUpdateUser, $state, UtilsService, $uibModal, $window) {
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

    $scope.trustAsHtml = $sce.trustAsHtml;

    console.log('$scope.user:\n', $scope.user);
    console.log('$scope.project:\n', $scope.project);

    $scope.init = function () {
      $scope.publishedProjects();
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
      AdminUpdateUser.get({userId: project.user._id},
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
      $http.get('/api/v1/keys').success(function (data) {
        var mapboxKey = data.mapboxKey;
        var mapboxSecret = data.mapboxSecret;
        var hereKey = data.hereKey;
        var hereSecret = data.hereSecret;

        GeoCodeApi.callGeoCodeApi(project, hereKey, hereSecret, saveProject)
          .success(function (data) {
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
    //PublishingService.getPublishedProjects().
    $scope.publishedProjects = function () {
      $http.get('/api/v1/projects/published').
      success(function (publishedProjects) {
        $scope.publishedProjects = publishedProjects;
      }).
      error(function (data, status) {

      });
    };


    //$rootScope.previousState = '';
    //$rootScope.currentState = '';
    //$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from) {
    //  $rootScope.previousState = from.name;
    //  $rootScope.currentState = to.name;
    //});
    //$scope.goBack = function () {
    //  if ($rootScope.previousState === 'listProjects') {
    //    $state.go($rootScope.previousState);
    //  } else {
    //    $state.go('admin');
    //  }
    //};
    //$scope.run = function ($rootScope, $state, Authentication) {
    //  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    //    if (toState.authenticate && !Authentication.isLoggedIn()) {
    //    }
    //    event.preventDefault();
    //  });
    //};
    //
    //$scope.userLoggedin = function () {
    //  // get request to /users/me
    //  if ($location.path() === '/projects/create') {
    //    $http.get('/api/v1/users/me')
    //      .success(function (data) {
    //        if (data === null) {
    //          $rootScope.signInBeforeProject = true;
    //          $location.path('/authentication/signin');
    //        }
    //      });
    //  }
    //}();

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
          console.log('location.path: ', 'projects/' + response._id + '/confirm');
          $location.path('projects/' + response._id + '/confirm');
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

    // Update existing Project
    $scope.update = function () {
      var project = $scope.project;
      project.$update(function () {
        if ($location.path() === '/admin/edit-project/' + project._id) {
          //return to view mode and call notify for success message
        } else {
          $location.path('projects/' + project._id);
        }
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };


    // Find a list of Projects
    $scope.find = function () {
      $scope.projects = Projects.query();
    };

    // Find existing Project
    $scope.findOne = function () {

      Projects.get({
        projectId: $stateParams.projectId
      }, function (project) {
        $scope.project = project;
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
        console.log('$scope.project:\n', $scope.project);
      });
    };

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

    ////CKEDITOR.replace('story');
    //$scope.editorOptions = {
    //  language: 'en',
    //  uiColor: '#02211D'
    //};
    //CKEDITOR.replaceClass = 'ck-crazy';

    //modal for leaving projects
    //Give user warning if leaving form

    //var preventRunning = false;
    //$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    //  if (preventRunning) {
    //    return;
    //  }
    //  if (fromState.url === '/projects/create' && toState.url !== '/projects/:projectId') {
    //    event.preventDefault();
    //
    //    $scope.animationsEnabled = true;
    //    $uibModal.open({
    //      animation: $scope.animationsEnabled,
    //      templateUrl: '/modules/projects/client/directives/views/project-warning-modal.html',
    //      controller: 'ModalController',
    //      size: 'lg'
    //    });
    //  }
    //});

    ////admin panel editing
    //$scope.toggleEdit = false;
    //$scope.toggleId = 0;
    //
    //$scope.toggleEditFn = function (editNum) {
    //  $scope.toggleEdit = !$scope.toggle;
    //  $scope.toggleId = editNum;
    //};

    /**
     * nlp
     **/
    //$scope.nlpData = null;
    //var getNlpData = function() {
    //	$http.get('/nlp').
    //		success(function (nlpData) {
    //			console.log(nlpData);
    //			$scope.nlpData = nlpData;
    //		}).
    //		error(function () {
    //		});
    //};


  }
]);


'use strict';

angular.module('projects').directive('projectStatusProjectEditor', function() {
        return {
          restrict: 'EA',
          templateUrl: 'modules/projects/client/directives/views/project-status-project-editor.html'
        };
    });

'use strict';

angular.module('projects').directive('projectStatusProjectInfo', function() {
        return {
          restrict: 'EA',
          templateUrl: 'modules/projects/client/directives/views/project-status-project-info.html'
        };
    });

'use strict';

angular.module('projects').directive('projectStatusUserBio', function() {
        return {
          restrict: 'EA',
          templateUrl: 'modules/projects/client/directives/views/project-status-user-bio.html'
        };
    });

'use strict';

angular.module('projects').directive('projectStatusUserInfo', function() {
        return {
          restrict: 'EA',
          templateUrl: 'modules/projects/client/directives/views/project-status-user-info.html'
        };
    });

'use strict';

angular.module('projects').directive('projectUploaderDirective', function () {
  return {
    restrict: 'AE',
    templateUrl:'/modules/projects/client/directives/views/projectUploader.html',
    controller: ["$scope", "$http", function($scope,$http) {


      // Project Uploader Service logic

      $scope.uploading = false;

      $scope.projectUpload = function (files) {

        if (files.length > 0) {
          $scope.uploading = true;
          var filename = files[0].name;
          var type = files[0].type;
          var query = {
            filename: filename,
            type: type,
            user: $scope.user,
            project: $scope.project
          };
          var configObj = {cache: true};
          $http.post('api/v1/s3/upload/project', query, configObj)
            .success(function (result) {
              console.log('result v1\n', result);
              Upload.upload({
                url: result.url, //s3Url
                transformRequest: function (data, headersGetter) {
                  var headers = headersGetter();
                  delete headers.Authorization;
                  console.log('data v1\n', data);
                  return data;
                },
                fields: result.fields, //credentials
                method: 'POST',
                file: files[0]
              }).progress(function (evt) {

                console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));

              }).success(function (data, status, headers, config) {

                // file is uploaded successfully
                $scope.uploading = false;

                console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);

                // need to set image on front end
                if (data && data.s3Url) {
                  console.log('data v2\n', data);
                  $scope.project.file = data.s3Url;
                }
                console.log('$scope.imageURL:\n', $scope.imageURL);


              }).error(function () {

              });

              if (result && result.s3Url) {
                console.log('result v2\n', result);
                $scope.user.profileImageURL = result.s3Url;
                $scope.imageURL = result.s3Url;
              }
            })
            .error(function (data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              $scope.uploading = false;
            });

          //  .xhr(function(xhr) {
          //    $scope.abort = function() {
          //    xhr.abort();
          //    $scope.uploading = false;
          //  };
          //});

        }

      }

    }]

  }
});

//'use strict';
//
//angular.module('projects').directive('staticMap', ['$scope',
//	function($scope) {
//		return {
//			template: '<div></div>',
//			restrict: 'E',
//			link: function postLink(scope, element, attrs) {
//
//				//create static map from lat and long
//
//				$scope.mapImage =
//					'http://api.tiles.mapbox.com/v4/{' +
//					data.mapboxKey + '/' +
//					this.geocode.long + ',' +
//					this.geocode.lat +
//					',10/' + //set the map zoom: default '10'
//					width + 'x' + height + '.png?access_token=' +
//					data.mapboxSecret;
//
//				//{name}-{label}+{color}({lon},{lat})
//				//var width = '100%';
//				//var height = 'auto';
//
//				element.text('this is the staticMap directive');
//			}
//		};
//	}
//]);
'use strict';

angular.module('projects').service('GeoCodeApi', ['$http',
  function ($http) {

    // Geocodeapi service logic

    this.callGeoCodeApi = function (project, key, secret, projectSaveCallback) {
      console.log('project:\n', project, '\nkey:\n', key, '\nsecret:\n', secret);
      if (!project || !project.state || !project.city || !project.zip || !project.street || !key || !secret) {
        projectSaveCallback();
        console.log('err, there\'s an error, yo.');
        return;
      }

      return $http.get('http://geocoder.cit.api.here.com/6.2/geocode.json' +
          '?state=' + project.state +
          '&city=' + project.city +
          '&postalcode=' + project.zip +
          '&street=' + project.street +
          '&gen=8' +
          '&app_id=' + key +
          '&app_code=' + secret)
        .success(function (geoData) {
          console.log('success:  modules/projects/client/services/geoCodeApi.client.service.js line 24');
          project.lat = geoData.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
          project.lng = geoData.Response.View[0].Result[0].Location.DisplayPosition.Longitude;

        }).error(function (data, status) {
          console.log('geocode error:\n', data, 'status:\n', status);
          //TODO: handle this gracefully
        });

    };
  }
]);

'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('Projects', ['$resource',
	function($resource) {
		return $resource('api/v1/projects/:projectId', {
			projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		}, {
			create: {
				method: 'POST'
			}
		}, {
			read: {
				method: 'GET'
			}
		}
		);
	}
]);

'use strict';

angular.module('projects').service('PublishingService', ['$http',
  function ($http) {

    this.getPublishedProjects = function () {
      console.log('publishing service');
      $http.get('/api/v1/projects/published');
      //.success(function (data) {
      //  console.log('published list data:\n', data);
      //  return data;
      //}).
      //error(function (data, error) {
      //  console.log('publishing error:\n', data, '\n', error);
      //});

    };

  }
]);

//'use strict';
//
//// Configuring the Articles module
//angular.module('users.admin').run(['Menus',
//  function (Menus) {
//    Menus.addSubMenuItem('topbar', 'admin', {
//      title: 'Manage Users',
//      state: 'admin.users'
//    });
//  }
//]);

//'use strict';
//
//// Setting up route
//angular.module('users.admin.routes').config(['$stateProvider',
//  function ($stateProvider) {
//    $stateProvider
//      .state('admin.users', {
//        url: '/users',
//        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
//        controller: 'UserListController'
//      })
//      .state('admin.user', {
//        url: '/users/:userId',
//        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
//        controller: 'UserController',
//        resolve: {
//          userResolve: ['$stateParams', function ($stateParams) {
//            return AdminUpdateUser.get({
//              userId: $stateParams.userId
//            });
//          }]
//        }
//      })
//      .state('admin.user-edit', {
//        url: '/users/:userId/edit',
//        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
//        controller: 'UserController',
//        resolve: {
//          userResolve: ['$stateParams', function ($stateParams) {
//            return AdminUpdateUser.get({
//              userId: $stateParams.userId
//            });
//          }]
//        }
//      });
//  }
//]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ])
  }
])


/**
    // todo Lightbox

    // set a custom template
    LightboxProvider.templateUrl = '/modules/users/client/directives/views/lightbox.html';

    // our images array is not in the default format, so we have to write this
    // custom method
    LightboxProvider.getImageUrl = function (imageUrl) {
      return imageUrl;
    };

    // set the caption of each image as its text color
    LightboxProvider.getImageCaption = function (imageUrl) {
      return '#' + imageUrl.match(/00\/(\w+)/)[1];
    };

    // increase the maximum display height of the image
    LightboxProvider.calculateImageDimensionLimits = function (dimensions) {
      return {
        'maxWidth': dimensions.windowWidth >= 768 ? // default
        dimensions.windowWidth - 92 :
        dimensions.windowWidth - 52,
        'maxHeight': 1600                           // custom
      };
    };

    // the modal height calculation has to be changed since our custom template is
    // taller than the default template
    LightboxProvider.calculateModalDimensions = function (dimensions) {
      var width = Math.max(400, dimensions.imageDisplayWidth + 32);

      if (width >= dimensions.windowWidth - 20 || dimensions.windowWidth < 768) {
        width = 'auto';
      }

      return {
        'width': width,    // default
        'height': 'auto'   // custom
      };
    };

 **/


.config(["LightboxProvider", function (LightboxProvider) {

  //set a custom template
  LightboxProvider.templateUrl = '/modules/users/client/views/lightbox.html';

//// set the caption of each image as its text color
//  LightboxProvider.getImageCaption = function (imageUrl) {
//    return '#' + imageUrl.match(/00\/(\w+)/)[1];
//  };

  // increase the maximum display height of the image
  LightboxProvider.calculateImageDimensionLimits = function (dimensions) {
    return {
      'maxWidth': dimensions.windowWidth >= 768 ? // default
      dimensions.windowWidth - 92 :
      dimensions.windowWidth - 52,
      'maxHeight': 1600                           // custom
    };
  };

  // the modal height calculation has to be changed since our custom template is
  // taller than the default template
  LightboxProvider.calculateModalDimensions = function (dimensions) {
    var width = Math.max(400, dimensions.imageDisplayWidth + 32);

    if (width >= dimensions.windowWidth - 20 || dimensions.windowWidth < 768) {
      width = 'auto';
    }

    return {
      'width': width,                             // default
      'height': 'auto'                            // custom
    };
  };

}]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          authenticate: true,
          roles: ['user', 'unregistered', 'registered', 'contributor', 'admin', 'superUser']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.favorites', {
        url: '/favorites',
        templateUrl: 'modules/users/client/views/settings/favorites.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      })
      .state('contributors', {
        url: '/contributors',
        templateUrl: 'modules/users/client/views/contributors/contributors.client.list.html'
      })
      .state('contributor', {
        url: '/contributors/:userId',
        templateUrl: 'modules/users/client/views/contributors/contributors.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'AdminUpdateUser',
  function ($scope, $filter, AdminUpdateUser) {
    AdminUpdateUser.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

//'use strict';
//
//angular.module('users.admin').controller('UserController', ['$scope', '$state', '$stateParams', 'Authentication', 'userResolve',
//  function ($scope, $state, $stateParams, Authentication, userResolve) {
//    $scope.authentication = Authentication;
//    //$scope.user = userResolve;
//
//    $scope.remove = function (user) {
//      if (confirm('Are you sure you want to delete this user?')) {
//        if (user) {
//          user.$remove();
//
//          $scope.users.splice($scope.users.indexOf(user), 1);
//        } else {
//          $scope.user.$remove(function () {
//            $state.go('admin.users');
//          });
//        }
//      }
//    };
//
//    $scope.update = function (isValid) {
//      if (!isValid) {
//        $scope.$broadcast('show-errors-check-validity', 'userForm');
//
//        return false;
//      }
//
//      var user = $scope.user;
//
//      user.$update(function () {
//        $state.go('admin.user', {
//          userId: user._id
//        });
//      }, function (errorResponse) {
//        $scope.error = errorResponse.data.message;
//      });
//    };
//
//  }
//]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', '$uibModal',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator, $uibModal) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/v1/auth/signup', $scope.credentials)
        .success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/v1/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };

    $scope.goToSignUp = function ($state) {
      $state.go('signup');
    };


    // Reroutes from sign in to sign up on modal
    $scope.modalOpenSignUp = function () {
      var isSwitched = false;
      $uibModal.open({
        templateUrl: function () {
          if (!isSwitched) {
            isSwitched = false;
            return 'modules/users/client/views/authentication/signup.client.view.html';

          } else {
            return 'modules/users/client/views/authentication/signin.client.view.html';

          }
        },
        size: 'lg',
        backdropClass: 'sign-in-modal-background',
        windowClass: 'sign-in-modal-background',
        backdrop: false,
        controller: function ($scope) {

        }

      }).then(function () {

        console.log('Success!!!!!');
      });
    };

  }
]);

'use strict';


angular.module('users').controller('ContributorController', ['$scope', '$animate', '$location', 'Authentication', 'GetContributors', '$stateParams', '$http', '$uibModal', '$window', 'Lightbox', 'UtilsService', 'User', 'Projects',
  function ($scope, $animate, $location, Authentication, GetContributors, $stateParams, $http, $uibModal, $window, Lightbox, UtilsService, User, Projects) {

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

    var getContribData = function() {
      GetContributors.contributors()
        .success(function (contributorsData) {
          getImages(contributorsData);
          $scope.contributors = contributorsData;
          return $scope.images;
        }).
      error(function (errorData) {
        console.log('errorData: ', errorData);
      });
    };

    var getImages = function (contribData) {
      for(var i = 0; i < contribData.length; i++ ) {
        var tempData = {};
        tempData.url = contribData[i].profileImageURL;
        tempData.thumbUrl = contribData[i].profileImageThumbURL;
        tempData.caption = contribData[i].bio;
        $scope.images.push(tempData);
      }

    };

    $scope.findContributor = function() {
      User.get({userId: $stateParams.userId},
        function(userData) {
          getAssociatedProjects(userData);
          $scope.contributor = userData;
      });
    };

    var getAssociatedProjects = function(userObj) {
      for (var i = 0; i < userObj.associatedProjects.length; i++) {
        Projects.get({projectId: userObj.associatedProjects[i]},
        function(projectObj){
          $scope.contributorProjects.push(projectObj);
        })
      }
    };


    $scope.changeView = function (view) {
      $location.path(view);
    };

  }
]);

'use strict';

// Projects controller
angular.module('users').controller('GalleryController', ['$scope', '$stateParams', '$location', 'Authentication', '$http', '$uibModal',
    function ($scope, $stateParams, $location, Authentication, $http, $uibModal) {

        //Give user warning if leaving form
        var preventRunning = false;
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (preventRunning) {
                return;
            }
            if (fromState.url === '/projects/create' && toState.url !== '/projects/:projectId') {
                event.preventDefault();

                $uibModal.open({
                    templateUrl: '/modules/projects/directives/views/modal.html',
                    controller: function ($scope, $modalInstance) {
                        $scope.closeMe = function () {
                            $modalInstance.dismiss(function (reason) {
                                console.log(reason);
                            });
                        };
                        $scope.leave = function () {
                            preventRunning = true;
                            $scope.closeMe();
                            $location.path(toState);
                        };
                    },
                    size: 'lg'
                });
            }

        });



    }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/v1/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/v1/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/v1/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'Upload', '$http', 'ProfileImageService',
  function ($scope, $timeout, $window, Authentication, Upload, $http, ProfileImageService) {

    $scope.init = function () {
      ProfileImageService.getUploadedProfilePic();
    };

    //// Create a new cache with a capacity of 10
    //var lruCache = $cacheFactory('lruCache', { capacity: 10 });

    $scope.user = Authentication.user;
    $scope.uploading = false;
    var upload = null;

    /**
     *
     * @param requestType {string} - the requestType specifies what type of files are being uploaded...
     *    for example, 'profile-image' is passed in when the content is for a user's profile image.
     * @param files {object} a Blob that contains the file(s) to upload
     */
      //$scope.onFileSelect = function (files, requestType) {
    $scope.onFileSelect = function (files) {
      //if (files.length > 0) {
      $scope.uploading = true;

      console.log('files:\n', files[0]);
      console.log('files:\n', files[0].File);

      var fileType = files[0].type;
      if (fileType === 'image/jpeg') {
        fileType = '.jpg'
      } else if (fileType === 'image/png') {
        fileType = '.png'
      }
      var fileName = '';
      //hard coded for now ... later will refactor to take multiple use cases
      var requestType = 'profile-image';

      if (requestType === 'profile-image') {
        fileName = {
          origFileName: files[0].name.replace(/\s/g, '_'), //substitute all whitespace with underscores
          fileName: 'uploaded-profile-image' + fileType
        };
      }

      var query = {
        user: $scope.user,
        fileName: fileName.fileName,
        origFileName: fileName.origFileName,
        type: files[0].type
      };

      console.log('fileType:\n', fileType);
      console.log('query:\n', query);

      $http.post('api/v1/s3/upload/media/photo', query)
        .then(function (result) {

          console.log('result:\n', result);
          console.log('result.data:\n', result.data);
          console.log('result.status:\n', result.status);
          console.log('result.config:\n', result.config);

          /**
           Specify the file and optional data to be sent to the server.
           Each field including nested objects will be sent as a form data multipart.
           Samples:

           {pic: file, username: username}
           {files: files, otherInfo: {id: id, person: person,...}} multiple files (html5)
           {profiles: {[{pic: file1, username: username1}, {pic: file2, username: username2}]} nested array multiple files (html5)
           {file: file, info: Upload.json({id: id, name: name, ...})} send fields as json string
           {file: file, info: Upload.jsonBlob({id: id, name: name, ...})} send fields as json blob
           {picFile: Upload.rename(file, 'profile.jpg'), title: title} send file with picFile key and profile.jpg file name
         **/


            //upload to back end
          upload = Upload.upload({
              url: result.config.url, //s3Url
              //transformRequest: function (data, headersGetter) {
              //  var headers = headersGetter();
              //  delete headers.Authorization;
              //  console.log('data v1\n', data);
              //  return data;
              //},
              //info: Upload.jsonBlob({id: id, name: name}),
              file: files[0],
              //data: {
              //  file: files,
              //  picFile: Upload.rename(files, 'uploaded-profile-image.jpg')
              //},
              //fields: result.fields, //credentials
              method: 'POST'
            })
            .then(function (resp) {
              // file is uploaded successfully
              console.log('resp:\n', resp);
              var s3Result = xmlToJSON.parseString(resp.data);   // parse
              console.log('file ' + resp.config.data.file.name + 'is uploaded successfully. Response: ' + s3Result);
              console.log('status: ', resp.status);
              $scope.uploading = false;
              ProfileImageService.getUploadedProfilePic();
            }, function (resp) {
              // handle error
            }, function (evt) {
              //var s3Result = xmlToJSON.parseString(resp.data);
              console.log('evt:\n', evt);
              // progress notify
              console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + evt.config.data.file.name);
            });
          //upload.catch(errorCallback);
          //upload.finally(callback, notifyCallback);


          //  .progress(function (evt) {
          //    console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total));
          //  })
          //  .success(function (data, status, headers, config) {
          //    var s3Result = xmlToJSON.parseString(data);   // parse
          //    console.log('status: ', status);
          //    console.log('The file ' + config.file.name + ' is uploaded successfully.\nResponse:\n', s3Result);
          //    $scope.uploading = false;
          //    ProfileImageService.getUploadedProfilePic();
          //  })
          //  .error(function () {
          //
          //  });
          //})
          //.error(function (data, status, headers, config) {
          //  // called asynchronously if an error occurs
          //  // or server returns response with an error status.
          //  $scope.uploading = false;
          //});
        });
      //.catch(err)
      //.finally(callback, notifyCallback);
    };
    //};


    /* cancel/abort the upload in progress. */
    $scope.abort = function () {
      console.log('abort!!!');
      upload.abort();
      $scope.uploading = false;
    };


  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'UserData', '$stateParams', 'Authentication', 'AdminAuthService', 'UtilsService',
  function ($scope, $http, $location, Users, UserData, $stateParams, Authentication, AdminAuthService, UtilsService) {
    $scope.user = Authentication.user;
    $scope.isAdmin = AdminAuthService;

    // Provides logic for the css in the forms
    UtilsService.cssLayout();


    // user fn to update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };


    // admin fn to update existing User
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userAdminForm');
        return false;
      }

      var userToEdit = $scope.userToEdit;

      userToEdit.$update(function () {
        $location.path('users/' + user._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };


    $scope.toggleEdit = false;
    $scope.toggleId = 0;

    $scope.toggleEditFn = function(editNum) {
      $scope.toggleEdit = !$scope.toggle;
      $scope.toggleId = editNum;
    };

    //runs a query to return user ID for admin panel editing
    $scope.find = function () {
      $scope.users = Users.query();
    };

    // Find a list of Users
    $scope.find = function() {
      $scope.users = Users.query($scope.query);
    };

    // Find existing User
    $scope.findOne = function() {
      console.log('$stateParams.userId', $stateParams.userId);
      $scope.userToEdit = UserData.get({
        userId: $stateParams.userId
      });
      console.log('$scope.userToEdit: ', $scope.userToEdit);
    };


  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

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

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/v1/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('UserController', ['$scope', '$state', '$stateParams', 'Authentication', 'UserData', 'Users', 'ProfileImageService',
  function ($scope, $state, $stateParams, Authentication, UserData, Users, ProfileImageService) {
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };


    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      //probably need to create new User instance before being able to use `user.$update()`
      //also need to better understand `$state.go()`
      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };


    // Find a list of Users
    $scope.find = function() {
      $scope.users = Users.query($scope.query);
      ProfileImageService.getUploadedProfilePic();
    };

    // Find existing User
    $scope.findOne = function() {
      $scope.user = UserData.get({
        userId: $stateParams.userId
      });
      console.log('$scope.users: ', $scope.users);
    };

  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.unshift(function (password) {
          var result = PasswordValidator.getResult(password);
          var strengthIdx = 0;

          // Strength Meter - visual indicator for users
          var strengthMeter = [
            { color: "danger", progress: "20" },
            { color: "warning", progress: "40"},
            { color: "info", progress: "60"},
            { color: "primary", progress: "80"},
            { color: "success", progress: "100"}
          ];
          var strengthMax = strengthMeter.length;

          if (result.errors.length < strengthMeter.length) {
            strengthIdx = strengthMeter.length - result.errors.length - 1;
          }

          scope.strengthColor = strengthMeter[strengthIdx].color;
          scope.strengthProgress = strengthMeter[strengthIdx].progress;

          if (result.errors.length) {
            scope.popoverMsg = PasswordValidator.getPopoverMsg();
            scope.passwordErrors = result.errors;
            modelCtrl.$setValidity('strength', false);
            return undefined;
          } else {
            scope.popoverMsg = '';
            modelCtrl.$setValidity('strength', true);
            return password;
          }
        });
      }
    };
}]);

'use strict';

angular.module('users')
  .directive("passwordVerify", function() {
    return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, modelCtrl) {
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || modelCtrl.$viewValue) {
            combined = scope.passwordVerify + '_' + modelCtrl.$viewValue;
          }
          return combined;
        }, function(value) {
          if (value) {
            modelCtrl.$parsers.unshift(function(viewValue) {
              var origin = scope.passwordVerify;
              if (origin !== viewValue) {
                modelCtrl.$setValidity("passwordVerify", false);
                return undefined;
              } else {
                modelCtrl.$setValidity("passwordVerify", true);
                return viewValue;
              }
            });
          }
        });
     }
    };
});

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// retrieve all contributors' and admins' profile data from users.model

angular.module('users').service('GetContributors', ['$http',
	function($http) {
		this.contributors = function(){
			return $http.get('/api/v1/contributors');
		};
	}
]);

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

'use strict';

// Authentication service for user variables
angular.module('users').factory('AdminAuthService', ['$window', 'Authentication',
	function($window, Authentication) {

		if(Authentication.user !== '') {

			var isAdmin = {
				user: $window.user.roles[0]
			};
			console.log('isAdmin.user', isAdmin.user);
			return isAdmin;

		} else {

			isAdmin = {
				user: 'notAdmin'
			};
			console.log('!isAdmin.user', isAdmin.user);
			return isAdmin;
		}
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = "Please enter a passphrase or password with at least 8 characters, and which contains at least one number, one lowercase character, upppercase, and special characters.";
        return popoverMsg;
      }
    };
  }
]);

    'use strict';

angular.module('users').service('SubscribeService', [
    function ($scope, $location, Projects, $stateParams) {


    //search database for e-mail address--if found, update newsletter subscription field; else, create new user

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
        $scope.find = function () {
            $scope.projects = Projects.query();
        };

        // Find existing Project
        $scope.findOne = function () {
            $scope.project = Projects.get({
                projectId: $stateParams.projectId
            });
        };

        $scope.completed = function () {
            var formField;
            for (formField in $scope.createProject) {
                if ($scope.createProject === null) {
                    $scope.completed = false;
                    return $scope.completed;
                } else {
                    $scope.completed = true;
                }
            }
        };




        // Create new Project
        $scope.create = function () {

            // Create new Project object
            var project = new Projects({
                created: this.created,
                createdBy: this.createdBy,
                street: this.street,
                city: this.city,
                state: this.state,
                zip: this.zip,
                story: this.story,
                title: this.title
            });

            var saveProject = function () {
                project.$save(function (response) {
                    $location.path('projects/' + response._id);
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
        };


    }
]);

'use strict';

// retrieve user's profile data from users.model

angular.module('users').factory( 'UserData', ['$resource',
	function($resource) {
		return $resource('/api/v1/users/:userId', {userId: '@_id'}, {
			update: {
				method: 'PUT'
			}
		});

	}
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('/api/v1/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('users').factory('User', ['$resource', 'AdminAuthService',
  function ($resource, AdminAuthService) {
    if (AdminAuthService.user === 'admin') {
      return $resource('api/v1/user/:userId', {userId: '@_id'}, {
        update: {
          method: 'PUT'
        }
      }, {
        create: {
          method: 'POST'
        }
      }, {
        read: {
          method: 'GET'
        }
      });
    } else {
      return $resource('api/v1/users/:userId', {userId: '@_id'}, {
        update: {
          method: 'GET'
        }
      });
    }
  }
]);

angular.module('users').factory('AdminUpdateUser', ['$resource', 'AdminAuthService',
  function ($resource, AdminAuthService) {
    if (AdminAuthService.user === 'admin') {
      return $resource('api/v1/users/:userId', {userId: '@_id'}, {
        update: {
          method: 'PUT'
        }
      }, {
        create: {
          method: 'POST'
        }
      }, {
        read: {
          method: 'GET'
        }
      });
    } else {
      return 'error - user is not admin'
    }
  }
]);
