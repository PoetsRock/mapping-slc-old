/**
 * Created by sbrown on 1/14/16.
 */
angular.module('core').directive('moveMap',function() {
    "use strict";
    return {
        restrict: 'A',
        link: function(scope, element){
            scope.$on('CurrentStory',function(event, data){

                if(data){
                    element.css({'position': 'absolute', 'left': '-19%'});
                }
            });
            scope.$on('closeMap',function(){
                element.css({'position': 'absolute', 'left': '0'});
            })
        }

    };

});