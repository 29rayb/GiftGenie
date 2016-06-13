'use strict';

angular
  .module('App')
  .controller('StarredCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', 'StarSvc', '$stateParams', StarredCtrl])

function StarredCtrl($scope, $state, $auth, $http, $window, UserSvc, StarSvc, $stateParams){

  if(!$auth.isAuthenticated()){
    return $state.go('home');
  }

  $scope.star = () => {
    console.log('star in starred list')
  }

  $scope.search = () => {
    // console.log(user, 'heres the user');
    // StarSvc.get_friends(user)
    // .then(function(user){
    //   console.log(user, "here are the friends we would get back");
    //   console.log('WTF');
    // })
    // .catch(function(err) {
    //   console.error(err, 'Inside the Starred Ctrl, we have an error!');
    // });
  }
}
