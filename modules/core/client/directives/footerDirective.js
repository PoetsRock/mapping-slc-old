'use strict';

angular.module('core').directive('footerDirective', function(UtilsService) {
    return {
        restrict: 'AE',
        //replace: true,
        priority: 0,
        templateUrl:'/modules/core/client/directives/views/footer-directive.html',
        controller: function($scope,$http) {
            //provides logic for the css in the forms
            UtilsService.cssLayout();
            $scope.create = function () {
                $http({
                    method:'POST',
                    url:'/api/signup',
                    data:{
                        email:$scope.email
                    }
                }).success(function(data){
                    console.log(data);
                    if ('YO the DATA' ,data) {

                    }
                })
                    .error(function(err){
                        console.log(err);
                        if (err) {
                            $scope.error_message = "Please try again!";
                        }
                    });

                $scope.email = '';
            }
        }
    };
});
