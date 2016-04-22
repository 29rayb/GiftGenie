'use strict';

angular
  .module('App')
  .controller('StarredListsCtrl', ['$scope', '$state', '$stateParams', StarredListsCtrl])

function StarredListsCtrl($scope, $state, $stateParams){

  $scope.unstar = function($index){
    console.log('unstar wishlist');
    var wishlist_to_unstar = $scope.items[$index];
    console.log('wishlist to unstar', wishlist_to_unstar);
    $scope.items.splice($index, 1)

    // API.unstar_wishlist({ name: wishlist_to_unstar.name }, function (success) {
    //   $scope.items.splice($index, 1);
    // });
  }
}