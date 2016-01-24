angular.module('core').directive('moveMap',function($document) {
  "use strict";
  return {
    restrict: 'A',
    link: function(scope, element, attr){
      scope.$on('CurrentStory',function(event, data){

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
