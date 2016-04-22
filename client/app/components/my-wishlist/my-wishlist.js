'use strict';

angular
.module('App')
.controller('MyWishListCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', MyWishListCtrl])

function MyWishListCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams){
  console.log('In My Wishlist Controller.')

  console.log('starred lists');
  console.log('THESE ARE THE STATEPARMS', $stateParams)
  $scope.id = $stateParams.facebook;

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

  $scope.add = function(item){
    $scope.name = item.name;
    $scope.link = item.link;
    $scope.items.push({
      name: $scope.name,
      link: $scope.link
    })

    UserSvc.add_new(item)
    .then(function() {
      console.log('Inside add new method. Item:', item)

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
    // need to add this when the backend is done, or else
    // when user clicks on button to add, and clicks on x,
    // then tries to add a new item, user will see the info
    // for previously clicked edit item
    //   $scope.item.name = '';
    //   $scope.item.link = '';
  }
  $scope.save_changes = function(item){
    console.log('item to save changes', item)
    $scope.item.name = item.name;
    $scope.item.link= item.link;
    $scope.add_new(item);
    $scope.delete();
    console.log('edit item')
  }

  $scope.star = function(){
    console.log('starred this person');
  }
}
