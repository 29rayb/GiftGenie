'use strict';

angular
.module('App')
.controller('MyWishListCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'Account', '$rootScope', MyWishListCtrl])

function MyWishListCtrl($scope, $state, $auth, $http, $window, Account, $rootScope){
  console.log('In My Wishlist Controller.')

  $scope.items = [];

  if(!$auth.isAuthenticated()){
    return $state.go('home');
  }

    Account.getProfile()
    .then(function(response) {
      $rootScope.user = response.data;
      console.log($rootScope.user, "This is the data from GET request.");
      console.log("Hey babe. #lovey-dovey");
    })
    .catch(function(err) {
      console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
    });


  $scope.add_new = function(item){
    Account.add_new($rootScope.user)
    .then(function() {
      console.log('Inside add new method. Item:', item)
      $scope.name = item.name;
      $scope.link = item.link;
      $scope.items.push({
        name: $scope.name,
        link: $scope.link
      })
      $scope.item.name = '';
      $scope.item.link = '';
      console.log('Added new items')
    })
    .catch(function(err) {
      console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
    });
  }

  $scope.edit = function(item){
    console.log('item to edit', item)
    $scope.item.name = item.name;
    $scope.item.link = item.link;
    console.log('edit item')
  }
  $scope.save_changes = function(item){
    console.log('item to save changes', item)
    $scope.item.name = item.name;
    $scope.item.link= item.link;
    $scope.add_new(item);
    $scope.delete();
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

  $scope.star = function(){
    console.log('starred this person');
  }


}
