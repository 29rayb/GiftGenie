'use strict';

angular
  .module('App')
  .controller('NavbarCtrl', ['$scope', '$state', 'NavSvc', '$auth', NavbarCtrl]);

function NavbarCtrl($scope, $state, NavSvc, $auth){

  $scope.my_wishlist = function(){
    console.log('my wishlist')
    $state.go('my-wishlist')
  }

  $scope.starred_lists = function(){
    console.log('starred lists')
    $state.go('starred-lists')
  }

  $scope.logout = function(){
    console.log('logout')
    $auth.logout();
    $state.go('home')
  }
}
