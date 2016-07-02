'use strict';

angular
  .module('App')
  .controller('NavbarCtrl', NavbarCtrl);

NavbarCtrl.$inject = ['$scope', '$state', '$auth', '$rootScope', 'UserSvc']

function NavbarCtrl($scope, $state, $auth, $rootScope, UserSvc){

  if (!localStorage.getItem('satellizer_token')){
    $rootScope.infaq = localStorage.getItem('faq')
  } else {
    $rootScope.infaq = localStorage.removeItem('faq')
  }

  $scope.isAuthenticated = () => {
    return $auth.isAuthenticated();
  };

  $scope.logout = () => {
    // $rootScope.loggedIn = undefined;
    $auth.logout();
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
    $scope.goToWishList()
    UserSvc.getProfile()
    .then((response) => {
      var facebookId = response.data.facebook;
      $rootScope.settings = false;
      $rootScope.starred = true;
      $rootScope.followersPage = false;
      $rootScope.followingPage = false;
      $state.go('my-wishlist', {id: facebookId})
    })
  }

  $scope.goToOthers = (user) => {
    console.log('CLICKING ON LI ELEMENT');
    UserSvc.getProfile()
    .then((response) => {
      var myId = response.data.facebook;
      console.log('MyId TRYING TO CHANGE PAGE', myId)
      $scope.friendsContainer = false;
      $state.go('friend-wishlist', {id: myId, fid: user.id});
    })
  }

  // ui-sref="my-wishlist({id: {{user.id}}})"

  $scope.searchFriends = () => {
    UserSvc.getProfile()
    .then((response) => {
      // console.log(response, 'response ');
      var alternative = response.data.friends;
      $rootScope.alternate = alternative;
      var userMates = $rootScope.alternate || $rootScope.user.friends;

      UserSvc.checkingFriendPrivacy(userMates)
      .then((response) => {
        // console.log(response, 'RESPONSE FROM PRIVACY SETTINGS CHECK!!!!!!!!!!!!!');
        var res = response.data.publicFriends;
        var length = res.length;
        // console.log(length, 'length');

        $rootScope.userModel = [];

        for (var i = 0; i < length; i++){
          $rootScope.userModel[i] = {
            "name": res[i].displayName,
            "id": res[i].facebook
          };
        }
        // console.log($rootScope.userModel, 'HERE!!!!!!!!');
      })
    })
  }

  $scope.focused = () => {
    $scope.friendsContainer = true;
    $scope.searchFriends()
  }

  // $scope.blurred = () => {
  //   console.log('outside friends container')
  //   $scope.friendsContainer = false;
  // }

  $scope.hoverIn = () => {
    $scope.friendsContainer = true;
  }

  $scope.hoverOut = () => {
    $scope.friendsContainer = false;
  }


  $scope.authenticate = function(provider, user) {
    //$auth returns a promise. We'll wanna use that, so we have a '.then'. (This is what produces the 'token' object we see in console).
    //Satellizer stores this token for us automatically. (It's in local storage!) It is sent via the request.get in 'auth.js' route.
    localStorage.removeItem('faq')
    $rootScope.notLoggedIn = true;
    $auth.authenticate(provider, user)
    .then((res) => {
      UserSvc.getProfile()
      // this has to be done before state.go because facebook_email is needed but
      // after auth.authenticate because you are pressing the login with facebook button
      .then((response) => {
        var facebookId = response.data.facebook;
        // var facebook_name = response.data.displayName;
        // var facebook_email = response.data.email;
        // console.log('THIS IS THE UNIQUE FACEBOOK ID',facebookId)
        $state.go('my-wishlist', {id: facebookId})
      })
      .catch((err) => {
        console.error(err, 'Inside UserSvc After Auth.authenticate, we have an error!');
      });
    })
    .catch((err) => {
      console.error('Inside the Home Ctrl, we have an error!', err);
    });
  };


}
