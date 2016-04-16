'use strict';

angular.module('core').service('UtilsService', ['$http', '$window', '$filter', '$location', 'AdminUpdateUser',
  function ($http, $window, $filter, $location, AdminUpdateUser) {

    this.showMap = function() {
      $location.path('/');
      scope.toggleOverlayFunction('overlay');
    };

    //logic for css on the contact form
    this.cssLayout = function () {
      [].slice.call(document.querySelectorAll('input.input_field'))

        .forEach(function (inputEl) {
          // in case the input is already filled
          if (inputEl.value.trim() !== '') {
            classie.add(inputEl.parentNode, 'input-filled');
          }
          // events
          inputEl.addEventListener('focus', onInputFocus);
          inputEl.addEventListener('blur', onInputBlur);
        });

      function onInputFocus(ev) {
        classie.add(ev.target.parentNode, 'input-filled');
      }

      function onInputBlur(ev) {
        if (ev.target.value.trim() === '') {
          classie.remove(ev.target.parentNode, 'input-filled');
        }
      }
    };


    this.pagination = function () {
      AdminUpdateUser.query(function (data) {
        $scope.users = data;
        $scope.buildPager();
      });

      $scope.buildPager = function () {
        $scope.pagedItems = [];
        $scope.itemsPerPage = 15;
        $scope.currentPage = 1;
        $scope.figureOutItemsToDisplay();
      };

      $scope.figureOutItemsToDisplay = function () {
        $scope.filteredItems = $filter('filter')($scope.users, {
          $: $scope.search
        });
        $scope.filterLength = $scope.filteredItems.length;
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = begin + $scope.itemsPerPage;
        $scope.pagedItems = $scope.filteredItems.slice(begin, end);
      };

      $scope.pageChanged = function () {
        $scope.figureOutItemsToDisplay();
      };

    }
  }
]);
