
'use strict';

angular
  .module('App')
  .controller('HomeCtrl', ['$scope', '$state', '$auth', '$http', 'UserSvc', '$rootScope', HomeCtrl])

function HomeCtrl($scope, $state, $auth, $http, UserSvc, $rootScope){

  $rootScope.loggedIn = localStorage.getItem("satellizer_token")

  if (localStorage.getItem("satellizer_token")) {
    UserSvc.getProfile()
      .then((response) => {
        console.log('THIS IS THE RESPONSE', response)
        $rootScope.facebook = response.data.facebook;
        console.log('YOYOYOYOY', $rootScope.facebook)
        $rootScope.display_name = response.data.displayName;
        $rootScope.favoritesLength = response.data.favorites.length;
      })
  }

  $scope.authenticate = function(provider, user) {
    //$auth returns a promise. We'll wanna use that, so we have a '.then'. (This is what produces the 'token' object we see in console).
    //Satellizer stores this token for us automatically. (It's in local storage!) It is sent via the request.get in 'auth.js' route.
    // $rootScope.notLoggedIn = true;
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
            console.error('ERROR with getting the user info from facebook', err);
          });
      })
      .catch((err) => {
        console.error('ERROR with Facebook Satellizer Auth', err);
      });
  };

  // $rootScope.display_name = getUser.data.displayName;

}
