'use strict';

angular
.module('App')
.controller('NavbarCtrl', ['$scope', '$state', 'NavSvc', '$auth', NavbarCtrl]);

function NavbarCtrl($scope, $state, NavSvc, $auth){

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $scope.logout = function(){
    $auth.logout();
    $state.go('home')
  }
}
