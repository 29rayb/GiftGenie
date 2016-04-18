'use strict';

angular
  .module('App')
  .controller('MyWishListCtrl', ['$scope', '$state', MyWishListCtrl])

function MyWishListCtrl($scope, $state){
  console.log('my wishlist')
}