
'use strict';

angular
  .module('App')
  .controller('HomeCtrl', ['$scope', '$state', '$auth', '$http', 'UserSvc', '$rootScope', HomeCtrl])

function HomeCtrl($scope, $state, $auth, $http, UserSvc, $rootScope){

  $rootScope.loggedIn = localStorage.getItem("satellizer_token")
  console.log('!@#!@#!@#12', $rootScope.loggedIn  )

  $scope.authenticate = function(provider, user) {
    //$auth returns a promise. We'll wanna use that, so we have a '.then'. (This is what produces the 'token' object we see in console).
    //Satellizer stores this token for us automatically. (It's in local storage!) It is sent via the request.get in 'auth.js' route.
    // $rootScope.notLoggedIn = true;
    $auth.authenticate(provider, user)
      .then((res) => {
        // var token = 'xxx'
        // localStorage.setItem("notLoggedIn", token);
          // $rootScope.notLoggedIn = true;
          // console.log('INSIDE', $scope.loggedIn)
        // console.log(res, 'This is the auth response in Home Ctlr.');
        // var token = res.data;
        // console.log(token, "This is our token. We're inside Home Ctlr.")
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

  // $rootScope.display_name = getUser.data.displayName;

}
