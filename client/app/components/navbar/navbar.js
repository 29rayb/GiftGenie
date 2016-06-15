'use strict';

angular
  .module('App')
  .controller('NavbarCtrl', ['$scope', '$state', 'NavSvc', '$auth', 'UserSvc', '$rootScope', NavbarCtrl]);

function NavbarCtrl($scope, $state, NavSvc, $auth, UserSvc, $rootScope){

  $scope.isAuthenticated = () => {
    return $auth.isAuthenticated();
  };
  $scope.logout = () => {
    $auth.logout();
    $state.go('home')
  }

  $scope.searchFriends = () => {
    var length = $rootScope.friendsLength
    $scope.userModel = [];
    UserSvc.getProfile()
      .then((res) => {
        for (var i = 0; i < length; i++){
          $scope.userModel[i] = {
            "name": res.data.friends[i].name,
            "id": res.data.friends[i].id
          };
        }
        console.log('userModel', $scope.userModel)
      })
  }

  $scope.focused = () => {
    $scope.friendsContainer = true;
    $scope.searchFriends()
  }

  $scope.blurred = () => {
    $scope.friendsContainer = false;
  }

}
