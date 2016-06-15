'use strict';

angular
  .module('App')
  .controller('NavbarCtrl', ['$scope', '$state', 'NavSvc', '$auth', NavbarCtrl]);

function NavbarCtrl($scope, $state, NavSvc, $auth){
  $scope.friendsContainer = false;

  $scope.friendsContainer = false;

  $scope.isAuthenticated = () => {
    return $auth.isAuthenticated();
  };
  $scope.logout = () => {
    $auth.logout();
    $state.go('home')
  }

  $scope.searchFriends = () => {

    $scope.friendsContainer = true;
    console.log('friendsContainer', $scope.friendsContainer)
  }

}
