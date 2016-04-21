'use strict';

angular
.module('App')
.controller('HomeCtrl', ['$scope', '$state', '$auth', '$http', HomeCtrl])

function HomeCtrl($scope, $state, $auth, $http){
  console.log('In The Home Controller')

  $scope.authenticate = function(provider, user) {
    //$auth returns a promise. We'll wanna use that, so we have a '.then'. (This is what produces the 'token' object we see in console).
    //Satellizer stores this token for us automatically. (It's in local storage!) It is sent via the request.get in 'auth.js' route.
    $auth.authenticate(provider, user)
      .then(function(res) {
        console.log(res, 'This is the auth response in Home Ctlr.');
        var token = res.data;
        console.log(token, "This is our token. We're inside Home Ctlr.")
        $state.go('my-wishlist')
      })
      .catch(function(err){
        console.error(err, 'Inside the Home Ctrl, we have an error!');
      });
  };

}
