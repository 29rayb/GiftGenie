'use strict';

angular
  .module('App')
  .controller('NavbarCtrl', ['$scope', '$state', 'NavSvc', '$auth', 'UserSvc', '$rootScope', NavbarCtrl]);

function NavbarCtrl($scope, $state, NavSvc, $auth, UserSvc, $rootScope){

  // var token = 'in faq'
  // $rootScope.infaq = localStorage.setItem('faq', token)
  // console.log('!@#!@#!@#!@#!@#@!3', $rootScope.infaq)

  if (!localStorage.getItem('satellizer_token')){
    $rootScope.infaq = localStorage.getItem('faq')
    // $rootScope.infaq = true;
    console.log('!@#!@#!@#!@#!@#@!3', $rootScope.infaq)
  } else {
    $rootScope.infaq = localStorage.removeItem('faq')
    console.log('$rootScope.infaq', $rootScope.infaq)
  }

  $scope.isAuthenticated = () => {
    return $auth.isAuthenticated();
  };
  $scope.logout = () => {
    $rootScope.loggedIn = undefined;
    $auth.logout();
    $state.go('home')
  }

  $scope.backToHome = () => {
    // $scope.infaqqqq = false;
    // localStorage.setItem('faq', undefined)
    localStorage.removeItem('faq')
    // localStorage.setItem('faq', undefined)
    // $scope.infaq = undefined;
    $rootScope.infaq = null;
    console.log('!@#!@#!@#!@#!@#!@#@!#!@#!@#', $rootScope.infaq)
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

  $scope.focused = () => {
    $scope.friendsContainer = true;
    $scope.searchFriends()
  }

  $scope.blurred = () => {
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
