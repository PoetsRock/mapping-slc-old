'use strict';

angular.module('core').directive('footerDirective', function(UtilsService) {
    return {
        restrict: 'AE',
        //replace: true,
        priority: 0,
        templateUrl:'/modules/core/client/directives/views/footer-directive.html',
        controller: function() {
            //provides logic for the css in the forms
            UtilsService.cssLayout();
        }
    };
});
