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
            scope.$on('CurrentStorty', function (event, data) {
                scope.project = data;
                scope.show = true;
                console.log('Project DATA: ' ,data);
                //var tempName = event.name;
                scope.hide = function () {
                    scope.show = !scope.show;
                    scope.$emit('closeMap')
                };



            });

        }
    };

});
