'use strict';

angular.module('core').factory('confirmModalService', ['$mdDialog', function ($mdDialog) {
    var status = '  ';
    return {
        showConfirm: function (ev, state) {
            console.log('here :: `ev`:\n', ev);
            console.log('here :: `state`:\n', state);
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Warning!')
                .textContent('You will lose all the information if you leave this page. Please confirm that you want to leave. ')
                .ariaLabel('Do you want to leave?')
                .targetEvent(ev)
                .ok('Yes, leave this page')
                .cancel('No, stay on this page');

            // $mdDialog.show(confirm).then(function() {
            //   status = 'You decided to get rid of your debt.';
            // }, function() {
            //   status = 'You decided to keep your debt.';
            // });
        }
    }
}]);
