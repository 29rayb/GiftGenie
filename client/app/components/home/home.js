'use strict';

angular
.module('App')
.controller('HomeCtrl', ['$scope', '$state', '$auth', '$http', 'UserSvc', HomeCtrl])

function HomeCtrl($scope, $state, $auth, $http, UserSvc){
  console.log('In The Home Controller')

  $scope.authenticate = function(provider, user) {
    //$auth returns a promise. We'll wanna use that, so we have a '.then'. (This is what produces the 'token' object we see in console).
    //Satellizer stores this token for us automatically. (It's in local storage!) It is sent via the request.get in 'auth.js' route.
    var facebook = 5;
    $auth.authenticate(provider, user)
      .then(function(res) {
        // console.log(res, 'This is the auth response in Home Ctlr.');
        var token = res.data;
        // console.log(token, "This is our token. We're inside Home Ctlr.")
      UserSvc.getProfile()
        .then(function(response) {
          console.log("This is the UNIQUE ID", response.data._id);
          var facebook = response.data._id;
          $state.go('my-wishlist', {id: facebook})
        })
        .catch(function(err) {
          console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
        });
    })
    .catch(function(err){
      console.error(err, 'Inside the Home Ctrl, we have an error!');
    });
  };

}
