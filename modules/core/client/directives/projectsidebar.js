/**
 * Created by sbrown on 1/13/16.
 */
angular.module('core').directive('featureSideBar',function(){
    "use strict";
    return {
        restrict:'EA',
        templateUrl:'/modules/core/client/directives/views/projects-sidebar.html',
        scope:{
            title: '@',
            description:'@',
            image:'@'
        },
        link: function(scope,element,attr){
          scope.$on('CurrentStorty',function(event,data){
              scope.project = data;
              console.log('Here is my data!!!!!', data);
              scope.showHide= function(){
                  if(scope.project){
                      return true;
                  }
                  return false;
              };
          })
        }
    }


});
