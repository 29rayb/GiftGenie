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

  $scope.goToWishList = () => {
    UserSvc.getProfile()
    .then((response) => {
      var facebookId = response.data.facebook;
      // var facebook_name = response.data.displayName;
      // var facebook_email = response.data.email;
      console.log('THIS IS THE UNIQUE FACEBOOK ID',facebookId)
      $state.go('my-wishlist', {id: facebookId})
    })
  }

  $scope.goToOthers = (user) => {
    UserSvc.getProfile()
      .then((response) => {
      var myId = response.data.facebook;
      console.log('MyId TRYING TO CHANGE PAGE', myId)
      $state.go('friend-wishlist', {id: myId, fid: user.id});
    })
  }

  // ui-sref="my-wishlist({id: {{user.id}}})"

  $scope.searchFriends = () => {
    var length = $rootScope.friendsLength
    $rootScope.userModel = [];
    UserSvc.getProfile()
      .then((res) => {
        console.log('@#%#$@!$#%@#!#!$', res)
        // works because both arrays have same length;
        for (var i = 0; i < length; i++){
          $rootScope.userModel[i] = {
            "name": res.data.friends[i].name,
            "id": res.data.friends[i].id
          };
        }
      })
  }

  // $scope.getFavorites = () => {

  // }

  // UserSvc.getProfile()
  // .then((res) => {
  //   console.log('!@#!@#!@#@#@!#@!#@', res)
  // })

  $scope.focused = () => {
    $scope.friendsContainer = true;
    $scope.searchFriends()
  }

  $scope.blurred = () => {
    $scope.friendsContainer = false;
  }

  // $scope.searchFriends();
}
