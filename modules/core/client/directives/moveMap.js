/**
 * Created by sbrown on 1/14/16.
 */
angular.module('core').directive('moveMap',function($document) {
    "use strict";
    return {
        restrict: 'A',
        link: function(scope, element, attr){
            scope.$on('CurrentStorty',function(event, data){

                if(data){
                    element.css({'position': 'absolute', 'left': '-19%'});
                }
            });
            scope.$on('closeMap',function(e,d){
                element.css({'position': 'absolute', 'left': '0'});
            })
        }

    };

});