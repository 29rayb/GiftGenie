'use strict';

angular
  .module('App')
  .controller('MyWishListCtrl', ['$scope', '$state', MyWishListCtrl])

function MyWishListCtrl($scope, $state){
  console.log('my wishlist')

  $scope.add_new = function(){
    console.log('add new item')
  }

  $scope.edit_item = function(){
    console.log('edit item')
  }

  $scope.delete = function($index){
    console.log('delete', $index);
    var item_to_delete = $scope.items[$index];
    console.log('item to delete', item_to_delete);
    $scope.items.splice($index, 1);

    // API.delete_item({ name: item_to_delete.name }, function (success) {
    //   $scope.items.splice($index, 1);
    // });
  }
}