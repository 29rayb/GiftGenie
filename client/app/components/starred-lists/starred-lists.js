'use strict';

angular
  .module('App')
  .controller('StarredListsCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', 'StarSvc', '$stateParams', StarredListsCtrl])

function StarredListsCtrl($scope, $state, $auth, $http, $window, UserSvc, StarSvc, $stateParams){
  console.log('In Starred Controller.')

  if(!$auth.isAuthenticated()){
    return $state.go('home');
  }

  $scope.search = function(user, user_id){
    console.log(user, 'heres the user');
    var user_id = user.facebook;
    console.log(user_id, "HERES WHAT WE NEED");
    console.log($scope, "SCOPE");
    $scope.friends = [];
    
    StarSvc.get_friends(user, user_id)
    .then(function(user, user_id, data){
      console.log(user, "USER");
      console.log(data, "DATA");
      $scope.user.friends = data.friends;
      console.log(user, "here are the friends we would get back");
      console.log('WTF');
    })
    .catch(function(err) {
      console.error(err, 'Inside the Starred Ctrl, we have an error!');
    });
  }


  // $scope.unstar = function($index){
  //   console.log('unstar wishlist');
  //   var wishlist_to_unstar = $scope.items[$index];
  //   console.log('wishlist to unstar', wishlist_to_unstar);
  //   $scope.items.splice($index, 1)
  //
  //   // API.unstar_wishlist({ name: wishlist_to_unstar.name }, function (success) {
  //   //   $scope.items.splice($index, 1);
  //   // });
  // }
}
