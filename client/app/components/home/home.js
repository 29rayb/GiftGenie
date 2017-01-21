'use strict';

angular
.module('App')
.controller('HomeCtrl', HomeCtrl)

HomeCtrl.$inject = ['$scope', '$rootScope', '$state', '$auth', '$http', 'UserSvc']

function HomeCtrl($scope, $rootScope, $state, $auth, $http, UserSvc){

  $rootScope.loggedIn = localStorage.getItem("satellizer_token");
  $rootScope.giftGenieLogin = localStorage.getItem('giftGenieLogin');

  $scope.authenticate = function(provider, user) {
    $auth.authenticate(provider, user)
    .then((res) =>{
      console.log(res)
      $rootScope.allMyFriends = res.data.user;
      var storingIdentifier = res.data.user;
      localStorage.setItem('giftGenieLogin', JSON.stringify(storingIdentifier));

      UserSvc.getProfile()
      .then(function(res){
        $rootScope.pro_pic = res.data.facebook;
        $state.go('my-wishlist', {id: $rootScope.pro_pic})
      });

      }).catch((err) => {
        console.error('ERROR with Facebook Satellizer Auth', err);
      });
    };
  }
