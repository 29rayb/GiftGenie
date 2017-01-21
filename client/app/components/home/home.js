'use strict';

angular
.module('App')
.controller('HomeCtrl', HomeCtrl)

HomeCtrl.$inject = ['$scope', '$rootScope', '$state', '$auth', '$http', 'UserSvc']

function HomeCtrl($scope, $rootScope, $state, $auth, $http, UserSvc){

  $rootScope.loggedIn = localStorage.getItem("satellizer_token");

  $scope.authenticate = function(provider, user) {
    $auth.authenticate(provider, user)
    .then((res) =>{
      console.log("IN..............................");
      console.log(res)
      $rootScope.allMyFriends = res.data.user;

      var storingIdentifier = res.data.user;
      localStorage.setItem('giftGenieLogin', JSON.stringify(storingIdentifier));

      $rootScope.giftGenieLogin = localStorage.getItem('giftGenieLogin');
      console.log($rootScope.giftGenieLogin, "HEYYYYYYY");

      // is it a problem that when facebook login button clicked, he/she
      // doesn't have the id in the url?
      $state.go('my-wishlist', {id: $rootScope.pro_pic})
    }).catch((err) => {
      console.error('ERROR with Facebook Satellizer Auth', err);
    });
  };
}
