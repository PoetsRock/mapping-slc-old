'use strict';

angular.module('core').directive('mainMenu', function(AdminAuthService) {
    return {
      restrict: 'EA',
      templateUrl: '/modules/core/client/directives/views/main-menu.html',

      controller: function($scope) {
        $scope.isAdmin = AdminAuthService.user;


        $scope.sidebar = L.control.sidebar('sidebar', {
          closeButton: true,
          position: 'left'
        }).addTo(map);

        $scope.sidebar.click = function() {
          if (L.DomUtil.hasClass(this, 'active')) {
            $scope.sidebar.close();
            console.log('here i am close');
          }
          else {
            $scope.sidebar.open(this.firstChild.hash.slice(1));
            console.log('here i am open');
          }
        };




          //if (child.firstChild.hash == '#' + id)
          //  L.DomUtil.addClass(child, 'active');
          //else if (L.DomUtil.hasClass(child, 'active'))
          //  L.DomUtil.removeClass(child, 'active');

          //
          //if (L.DomUtil.hasClass(this, 'active')) {
          //  $scope.sidebar.close();
          //  console.log('here i am close');
          //}
          //else {
          //  $scope.sidebar.open(this.firstChild.hash.slice(1));
          //  console.log('here i am open');
          //}


      },

      link: function($scope) {
        //$scope.sidebar = L.control.sidebar('sidebar', {
        //  closeButton: true,
        //  position: 'left'
        //}).addTo(map);


      }

    };
});



//// add Admin link in menu if user is admin
//if ($scope.authentication.user.roles[0] === 'admin' || $scope.authentication.user.roles[0] === 'superAdmin')
