'use strict';

angular.module('users').controller('UserController', ['$scope', '$state', '$stateParams', 'Authentication', 'UserData', 'Users', 'ProfileImageService', 'Projects', '$http', '$resource', 'Newsletter',
    function ($scope, $state, $stateParams, Authentication, UserData, Users, ProfileImageService, Projects, $http, $resource, Newsletter) {
        $scope.authentication = Authentication;
        $scope.user = Authentication.user;
        //$scope.user.projects = [];
        $scope.userProjects = [];
        //$scope.getProjects = null;
        var associatedProjects = $scope.user.associatedProjects;
        var userProjects = [];


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

        //delete user
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

        // Find a list of Users
        $scope.find = function () {
            $scope.users = Users.query($scope.query);
            console.log('edit-profile: $$$$$$$$$$$$$$$$$scope.userSSS:::\n', $scope.users);
            console.log('$$$$$$$$$$$$$$$$$scope.query:::\n', $scope.query);
            ProfileImageService.getUploadedProfilePic();
        };

        // Find existing User
        $scope.findOne = function () {
            $scope.user = UserData.get({
                userId: $stateParams.userId || $scope.user.userId
            });
            console.log('$scope.users: ', $scope.users);
        };

        //Find existing project submissions by UserId
        $scope.findCurrentUserSubmissions = function () {


            $scope.getProjects = function (associatedProjects) {
                associatedProjects.forEach(function (associatedProject) {
                    userProjects.push(Projects.get({
                            projectId: associatedProject
                        })
                    );
                });

                console.log('userProjects inside of findCurrentUserSub fn:\n', userProjects);
                console.log('$scope.userProjects inside of findCurrentUserSub fn:\n', $scope.userProjects);
                $scope.userProjects = userProjects;
                return userProjects;
            };

            console.log('userProjects outsode of findCurrentUserSub fn:\n', userProjects);
            console.log('$scope.userProjects outsode of findCurrentUserSub fn:\n', $scope.userProjects);


            $scope.getProjects(associatedProjects);

        };



        /**
         * newsletter subscription form
         */

        $scope.newsletterSubscription = function (isValid) {
            $scope.error = null;
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
                return;
            }

            // Find a list of Users
            //$scope.users = Users.query($scope.subscribe.newsletter);


            $scope.users = Newsletter.query({email: $scope.subscribe.newsletter});


            //console.log('$$$$$$$$$scope.user:\n', $scope.user);
            console.log('$$$$$$$$$scope.userSSS:\n', $scope.users);

            //var email = $scope.subscribe.newsletter.toString();

            //$http.get('/api/v1/newsletter/' + $scope.subscribe.newsletter)
            //    .then(function (response) {
            //        console.log('response:\n', response);
            //    });

            //var Newsletter = function() {
            //    return $resource('/api/v1/newsletter/:email', {email: '@email'}, {
            //        update: {
            //            method: 'PUT'
            //        }
            //    });
            //};


            //var newsletterUser = Users.query(queryEmail, function (userData, err) {
            //    Users.query({email: $scope.subscribe.newsletter}, function (userData, err) {
            //        if (err) {
            //            console.log(err)
            //        } else {
            //            console.log('userData response', userData);
            //        }
            //    });
            //
            //});

            //Newsletter.put($scope.subscribe.newsletter,
            //    function (userData) {
            //        console.log('userData response', userData);
                //})
                //.then(function (response) {
                //    console.log('response:\n', response);
                //})
                //.catch(function (error) {
                //    console.log('error:\n', error);
                //});


            /**
             *
             EXAMPLE OF USING A RESOURCE OBJ, FROM PROJECTS CONTROLLER

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
             **/

            //get request to query db to see if email exists

            //if true, conditional that checks whether the associated user has already subscribed

            //if already subscribed, do nothing and notify user of this

            //else update the current user's document

            //else if email doesn't exist, call post method to create new user
        };

    }
]);
