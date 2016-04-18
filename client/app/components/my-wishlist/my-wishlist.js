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

  $scope.delete_item = function(){
    console.log('delete item')
  }
}