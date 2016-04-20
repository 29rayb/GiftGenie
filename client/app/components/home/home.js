'use strict';

angular
.module('App')
.controller('HomeCtrl', ['$scope', '$state', '$auth', HomeCtrl])

function HomeCtrl($scope, $state, $auth){
  console.log('In The Home Controller')

  $scope.authenticate = function(provider, user) {
    console.log(provider, "THIS IS THE PROVIDER");
    console.log(user, "THIS IS THE USER");
    
    $auth.authenticate(provider, user)
    .then(function(res) {
      console.log('This is the auth response in Home Ctlr.');
      var token = res.data;
      console.log(token, "This is our token. We're inside Home Ctlr.");
      $window.localStorage.currentUser = JSON.stringify(response.data.user);
      $rootScope.currentUser = JSON.parse($window.localStorage.currentUser)

      .catch(function(response) {
        console.log(response.data);
      });

      $state.go('my-wishlist')
    })
    .catch(function(err){
      console.error(err, 'Inside the Home Ctrl, we have an error!');
    });
  };










}
