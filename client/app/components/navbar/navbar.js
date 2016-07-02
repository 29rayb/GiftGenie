'use strict';

angular
  .module('App')
  .controller('NavbarCtrl', NavbarCtrl);

NavbarCtrl.$inject = ['$scope', '$state', '$auth', '$rootScope', 'UserSvc']

function NavbarCtrl($scope, $state, $auth, $rootScope, UserSvc){

  $rootScope.settings = false;
  $rootScope.starred = false;
  $rootScope.followersPage = false;
  $rootScope.followingPage = false;

  if (!localStorage.getItem('satellizer_token')){
    $rootScope.infaq = localStorage.getItem('faq')
  } else {
    $rootScope.infaq = localStorage.removeItem('faq')
  }

  $scope.isAuthenticated = () => {
    return $auth.isAuthenticated();
  };

  $scope.logout = () => {
    $rootScope.loggedIn = undefined;
    $scope.friendsContainer = false;
    $auth.logout();
    $scope.backToHome();
    $state.go('home')
  }

  $scope.backToHome = () => {
    localStorage.removeItem('faq')
    $rootScope.infaq = null;
  }

  $scope.goToWishList = () => {
    $rootScope.settings = false;
    $rootScope.starred = false;
    $rootScope.followersPage = false;
    $rootScope.followingPage = false;
    $state.go('my-wishlist', {id: $rootScope.facebook })
  }

  $scope.goToStarred = () => {
    $scope.goToWishList();
    $rootScope.starred = true;
  }

  $scope.goToOthers = (userObj) => {
    $scope.friendsContainer = false;
    $state.go('friend-wishlist', {id: $rootScope.facebook, fid: userObj.id});
  }

  $scope.focused = () => {
    $scope.friendsContainer = true;
    $scope.searchFriends()
  }

  $scope.hoverIn = () => {
    $scope.friendsContainer = true;
  }

  $scope.hoverOut = () => {
    $scope.friendsContainer = false;
  }

  $scope.searchFriends = () => {
    UserSvc.checkingFriendPrivacy($rootScope.user.friends)
    .then((response) => {
      var publicFriends = response.data.publicFriends;
      var length = publicFriends.length;

      $rootScope.userModel = [];

      for (var i = 0; i < length; i++){
        $rootScope.userModel[i] = {
          "name": publicFriends[i].displayName,
          "id": publicFriends[i].facebook
        };
      }
    })
  }

  $scope.authenticate = function(provider, user) {
    localStorage.removeItem('faq')
    $auth.authenticate(provider, user)
      .then((res) =>{
      $state.go('my-wishlist', {id: $rootScope.facebook})
    })
  }

}
