'use strict';

angular
  .module('App')
  .controller('HomeCtrl', ['$scope', '$state', '$auth', HomeCtrl])

function HomeCtrl($scope, $state, $auth){
  console.log('In The Home Controller')

  $scope.authenticate = function(provider) {
    $auth.authenticate(provider)
    .then(function(res) {
      console.log(res, 'This is the auth response in Home controller.');
    })
    .catch(function(err){
      console.error(err, 'Inside the Home controller. ');
    });
  };
}
