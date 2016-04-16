'use strict';

angular
  .module('App')
  .controller('NavbarCtrl', ['$scope', '$state', 'NavSvc', NavbarCtrl]);

function NavbarCtrl($scope, $state, NavSvc){

  $scope.signup = function(){
    console.log('signup')
  }

  $scope.login = function(){
    console.log('login')
  }
}