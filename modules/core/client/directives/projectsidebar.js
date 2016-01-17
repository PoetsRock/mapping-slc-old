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
            var tempProjectIdActive = false;
            scope.hide = function () {
                console.log('hide me!!!');
                scope.show = !scope.show;
                scope.$emit('closeMap')
            };

            scope.$on('CurrentStory', function (event, data) {
                scope.project = data;
                scope.show = true;
                var tempProjectId = scope.project.projectId;
                if(tempProjectId === scope.project.projectId && tempProjectIdActive){
                    console.log('inside if!');
                    scope.hide();
                    tempProjectIdActive = !tempProjectIdActive;
                }
                tempProjectIdActive = !tempProjectIdActive;

                console.log('scope show',scope.show);
                //console.log('tempProjectId:\n', tempProjectId);
                //console.log('scope.project.projectId:\n', scope.project.projectId);



            });

        }
    };

});
