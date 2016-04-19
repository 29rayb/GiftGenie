'use strict';

angular
  .module('App')
  .controller('MyWishListCtrl', ['$scope', '$state', '$auth', '$http', MyWishListCtrl])

function MyWishListCtrl($scope, $state, $auth, $http){
  console.log('my wishlist')
  $scope.items = [];

  if(!$auth.isAuthenticated()){
    return $state.go('home');
  }

  $http.get('/users/me')
  .then(function(res) {
    $scope.user = res.data;
    console.log('This is the response from retrieving the logged in user info!', res);
    var $loggedInUser = res.data._id;
    console.log($loggedInUser, 'Here is it!');
  }, function(err) {
    console.error(err);
  });

  $scope.add_new = function(item){
    console.log('item', item)
    $scope.name = item.name;
    $scope.link = item.link;
    $scope.items.push({
      name: $scope.name,
      link: $scope.link
    })
    $scope.item.name = '';
    $scope.item.link = '';
    console.log('add new item')
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
}
