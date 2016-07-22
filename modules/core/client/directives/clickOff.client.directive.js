'use strict';

angular.module('core').directive('clickOff', ['$document', function ($document) {
  return {
    restrict: 'EA',
  
    link: function postLink(scope, element, attrs) {
      // console.log('here! 1');
      
      scope.onClick = function (event) {
        // console.log('here! 2 `event`:\n', event);
        var isChild = $(element).has(event.target).length > 0;
        var isSelf = element[0] === event.target;
        var isInside = isChild || isSelf;
        if (!isInside) {
          scope.$apply(attrs.clickOff);
        }
      
      };
      scope.$watch(attrs.isActive, function(newValue, oldValue) {
        // console.log('here! 3');
        // console.log('`newValue:\n', newValue);
        // console.log('`oldValue:\n', oldValue);
        
        if(newValue !== oldValue && newValue) {
          $document.bind('click', onClick);
        } else if(newValue !== oldValue && !newValue) {
          $document.unbind('click', onClick)
        }
        
      });
    }
  }
  
}]);


/*
 
 http://stackoverflow.com/questions/20186438/angular-click-outside-of-an-element-event
 
 Very nice approach, though it's worth mentioning I had to set the onClick function on the scope to make it work for two instances of the directive. – Steven Ryssaert Apr 30 '15 at 18:48
 	 	
 Nice solution, I just needed to remove jQuery dependency, instead of: var isChild = $(element).has(event.target).length > 0; you may use: var isChild = element[0].contains(event.target);
 

 */