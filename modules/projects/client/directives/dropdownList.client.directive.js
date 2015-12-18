//'use strict';
//
//angular.module('projects').directive('dropdownList', function($rootScope) {
//  return {
//    restrict: 'E',
//    templateUrl: 'modules/projects/client/directives/views/dropdown-list.html',
//    scope: {
//      placeholder: '@',
//      list: '=',
//      selected: '=',
//      property: '@'
//    },
//    link: function(scope) {
//      scope.listVisible = false;
//      scope.isPlaceholder = true;
//
//      scope.select = function(item) {
//        scope.isPlaceholder = false;
//        scope.selected = item;
//      };
//
//      scope.isSelected = function(item) {
//        return item[scope.property] === scope.selected[scope.property];
//      };
//
//      scope.show = function() {
//        scope.listVisible = true;
//      };
//
//      $rootScope.$on('documentClicked', function(inner, target) {
//
//        var parent = angular.element(target.parent()[0]);
//    if (!(target.hasClass('dropdown-display') && target.hasClass('clicked-add')) && !(parent.hasClass('dropdown-display') && parent.hasClass('clicked-add'))) {
//
//          scope.$apply(function() {
//            scope.listVisible = false;
//          });
//        }
//
//      //  var parent = angular.element(target.parent()[0]);
//      //  if (!parent.hasClass('clicked')) {
//      //    scope.$apply(function () {
//      //      scope.listVisible = false;
//      //    });
//      //  }
//
//
//      });
//
//      scope.$watch('selected', function(value) {
//        //scope.isPlaceholder = scope.selected[scope.property] === undefined;
//        //scope.display = scope.selected[scope.property];
//      });
//    }
//  }
//});
