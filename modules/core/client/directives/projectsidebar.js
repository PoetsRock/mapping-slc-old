/**
 * Created by sbrown on 1/13/16.
 */
angular.module('core').directive('featureSideBar',function($document){
    "use strict";
    return {
        restrict: 'EA',
        templateUrl: '/modules/core/client/directives/views/projects-sidebar.html',
        scope: true,
        link: function (scope, element, attr) {
            scope.show = false;

            scope.hide = function () {
                scope.show = !scope.show;
                scope.$emit('closeMap')
            };

            function identical(array) {
                for(var i = 0; i < array.length - 1; i++) {
                    if(array[i] != array[i+1]) {
                        return false;
                    }
                }
                return true;
            }
            scope.eyedees = [];
            scope.$on('CurrentStory', function (event, data) {

                scope.project = data;
                scope.eyedees.push(scope.project.projectId);


                if (scope.eyedees.length == 1) {
                    scope.show = true;
                }
                if (scope.eyedees.length > 1) {
                    if (identical(scope.eyedees)){
                        scope.hide();
                        scope.eyedees = [];
                    }
                    else {
                        scope.show = true;
                        scope.eyedees = [];
                    }

                }

            });

        }
    };

});
