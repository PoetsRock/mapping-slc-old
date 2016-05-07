'use strict';

angular.module('editor').directive('wysiwyg', function () {
  return {
    restrict: 'EA',
    templateUrl: '/modules/editor/client/directives/views/text-editor.html',
    controller: function($scope, $stateParams, $location, Authentication, Projects, UserData, AdminAuthService) {
      
      $scope.authentication = Authentication;
      $scope.isAdmin = AdminAuthService;      
      $scope.projectText = '';
      

      // $scope.toggleWysiwyg = function() {
      //   $scope.showWysiwyg = !$scope.showWysiwyg;
      // };

      $scope.initialize = function(initControls) {
        $scope.initControls = initControls;
        $scope.showWysiwyg = false;
        console.log('$scop.showWysiwyg: ', $scope.showWysiwyg);
        $scope.deleteAll = function() {
          initControls.getEditor()('html.set', '');
        };
      };

      // $scope.titleOptions = {
      //   placeholderText: 'Add a Title',
      //   charCounterCount: false,
      //   toolbarInline: true,
      //   events: {
      //     'froalaEditor.initialized': function() {
      //       console.log('initialized');
      //     }
      //   }
      // };





    }
  };
});
