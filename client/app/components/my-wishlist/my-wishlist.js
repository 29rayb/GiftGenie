'use strict';

angular
.module('App')
.controller('MyWishListCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', MyWishListCtrl])

function MyWishListCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope){
  console.log('In My Wishlist Controller.')

  // $scope.items = [];

  if(!$auth.isAuthenticated()){
    return $state.go('home');
  }

  UserSvc.getProfile()
    .then(function(response) {
      $rootScope.user = response.data;
      $rootScope.display_name = response.data.displayName
      $rootScope.email = response.data.email
      $rootScope.pro_pic = response.data.facebook
      $rootScope.items = response.data.items;
      console.log($rootScope.user, "This is the data from GET request.");
      console.log("Hey babe. #lovey-dovey");
    })
  .catch(function(err) {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });

  // UserSvc.getPhotos()
  //   console.log('yuguygyfyut')
  //   .then(function(response) {
  //     console.log('THIS IS THE GET PHOTOS RESPONSE', response)
  //     console.log('THIS IS THE GET PHOTOS RESPONSE', response.data)
  //   })
  //   .catch(function(err) {
  //     console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  //   });



  $scope.add = function(item){
    UserSvc.add_new(item)
    .then(function() {
      console.log('Inside add new method. Item:', item)
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

  // $scope.delete = function($index){
  //   UserSvc.delete_item($index)
  //   .then(function() {
  //     console.log('delete', $index);
  //     var item_to_delete = $scope.items[$index];
  //     console.log('item to delete', item_to_delete);
  //     $scope.items.splice($index, 1);
  //   })
  //   .catch(function(err) {
  //     console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  //   });
  //   // API.delete_item({ name: item_to_delete.name }, function (success) {
  //   //   $scope.items.splice($index, 1);
  //   // });
  // }

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

//RAY:
  // $scope.delete = function($index){
  //   UserSvc.delete_item($index)
  //     .then(function(){
  //       console.log('delete', $index);
  //       var item_to_delete = $scope.items[$index];
  //       console.log('item to delete', item_to_delete);
  //       $scope.items.splice($index, 1);
  //     })
  //
  //   // API.delete_item({ name: item_to_delete.name }, function (success) {
  //   //   $scope.items.splice($index, 1);
  //   // });
  // }

  $scope.star = function(){
    console.log('starred this person');
  }


}
