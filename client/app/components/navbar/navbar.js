'use strict';

angular
  .module('App')
  .controller('NavbarCtrl', ['$scope', '$state', 'NavSvc', '$auth', NavbarCtrl]);

function NavbarCtrl($scope, $state, NavSvc, $auth){
  $scope.isAuthenticated = () => {
    return $auth.isAuthenticated();
  };
  $scope.logout = () => {
    $auth.logout();
    $state.go('home')
  }
}
