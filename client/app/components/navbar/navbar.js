'use strict';

angular
  .module('App')
  .controller('NavbarCtrl', NavbarCtrl);

NavbarCtrl.$inject = ['$scope', '$state', '$auth', '$rootScope', 'UserSvc']

function NavbarCtrl($scope, $state, $auth, $rootScope, UserSvc){

  // need this for instances of refreshing
  if(localStorage.getItem('satellizer_token')){
    console.log('if refreshed')
    UserSvc.getProfile()
      .then((res) => {
        console.log('___________ !@#!@#@!#@#@! response after rrefreshed ', res)
        $rootScope.allMyFriends = res.data.friends
        console.log('RES DATA FRIENDS', res.data.friends)
        console.log('ROOTSCOPE ALL MY FRIENDS', $rootScope.allMyFriends)
        $rootScope.display_name = res.data.displayName;
        $rootScope.infaq = localStorage.removeItem('faq')
        // console.log($rootScope.allMyFriends)
      })
  } else {
    $rootScope.infaq = localStorage.getItem('faq')
  }


  $rootScope.settings = false;
  $rootScope.starred = false;
  $rootScope.followersPage = false;
  $rootScope.followingPage = false;


  $scope.isAuthenticated = () => {
    return $auth.isAuthenticated();
  };

  $scope.logout = () => {
    $rootScope.loggedIn = undefined;
    $rootScope.giftGenieLogin = undefined;
    localStorage.clear();
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
    // pro_pic is facebook id
    $state.go('my-wishlist', {id: $rootScope.pro_pic })
  }

  $scope.goToStarred = () => {
    $scope.goToWishList();
    $rootScope.starred = true;
  }

  $scope.goToOthers = (userObj) => {
    $scope.friendsContainer = false;
    // pro_pic is facebook id
    $state.go('friend-wishlist', {id: $rootScope.pro_pic, fid: userObj.id});
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
    // prevents $rootScope.user from being undefined;
    console.log('THIS IS $ROOTSCOPE', $rootScope)
    if ($rootScope.user !== undefined) {
      console.log('$rootScope.user is not undefined')
      $rootScope.user.friends = $rootScope.allMyFriends;
    }
    var myFriends = $rootScope.allMyFriends || $rootScope.user.friends
    console.log('after setting it to all my friends for friends who joined', myFriends)
    UserSvc.checkingFriendPrivacy(myFriends)
    .then((response) => {
      console.log(response)
      var publicFriends = response.data.publicFriends;
      var length = publicFriends.length;

      $rootScope.userModel = [];

      for (var i = 0; i < length; i++){
        $rootScope.userModel[i] = {
          "name": publicFriends[i].displayName,
          "id": publicFriends[i].facebook
        };
      }
      console.log('CHECK WHAT THIS IS', $rootScope.userModel)
    })
  }

  $scope.authenticate = function(provider, user) {
    localStorage.removeItem('faq')
    $auth.authenticate(provider, user)
      .then((res) =>{
        // is it a problem that when facebook login button clicked, he/she
        // doesn't have the id in the url?
      $state.go('my-wishlist', {id: $rootScope.facebook})
    }).catch((err) => {
        console.error('ERROR with Facebook Satellizer Auth', err);
    });
  }
}
