'use strict';

angular
.module('App')
.controller('NavbarCtrl', ['$scope', '$state', 'NavSvc', '$auth', NavbarCtrl]);

function NavbarCtrl($scope, $state, NavSvc, $auth){

  // $scope.fb_pro_pic = function(){
  //   NavSvc.get_fb_pro_pic(function(){
      
  //   });
  // }

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };


  $scope.my_wishlist = function(){
    console.log('Navbar directs to: My Wishlist.')
    $state.go('my-wishlist')
  }

  $scope.starred_lists = function(){
    console.log('Navbar directs to: Starred Lists.')
    $state.go('starred-lists')
  }

  $scope.logout = function(){
    console.log('Navbar triggers Logout.')
    $auth.logout();
    $state.go('home')
  }
}
