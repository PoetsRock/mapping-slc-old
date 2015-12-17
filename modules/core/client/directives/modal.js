'use strict';

angular.module('core').directive('modalDirective', function() {
        return {
            restrict: 'E',
            link: function() {

            $uibModal.open({
              animation: true,
              //templateUrl: '/modules/projects/client/directives/views/project-warning-modal.html',
              templateUrl: template,
              controller: function ($scope, $modalInstance, $location) {
                $scope.stay = function (result) {
                  //$modalInstance.dismiss('cancel');
                  console.log('stay just a little bit longer, oh won\'t you stay');
                  $modalInstance.close(function (result) {
                    console.log('result: ', result);
                  });
                };
                $scope.leave = function () {
                  var preventRunning = true;
                  $scope.stay();
                  $location.path(toState);
                };
              },
              size: 'lg'
            });


          }
        };
    });
