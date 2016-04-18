'use strict';

angular
  .module('App')
  .controller('MyWishListCtrl', ['$scope', '$state', '$auth', '$http', MyWishListCtrl])

function MyWishListCtrl($scope, $state, $auth, $http){
  console.log('my wishlist')

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

  $scope.add_new = function(){
    console.log('add new item')
  }

  $scope.edit = function(){
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
