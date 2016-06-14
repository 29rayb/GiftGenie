'use strict';

angular
  .module('App')
  .controller('StarredCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', 'StarSvc', '$stateParams', 'getUser', StarredCtrl])

function StarredCtrl($scope, $state, $auth, $http, $window, UserSvc, StarSvc, getUser, $stateParams){

  if(!$auth.isAuthenticated()){
    return $state.go('home');
  }

  $scope.star = () => {
    console.log('star in starred list')
  }

  $scope.search = () => {
    // var facebookId = .facebook;
    // console.log('facebookId', facebookId)
    StarSvc.get_friends()
    .then(function(){
      console.log("here are the friends we would get back");
    })
    .catch(function(err) {
      console.error(err, 'have no friends');
    });
  }
}
