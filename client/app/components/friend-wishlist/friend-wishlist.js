'use strict';

angular
  .module('App')
  .controller('FriendlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', FriendlistCtrl])

  function FriendlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams) {
    console.log("hey")
  }