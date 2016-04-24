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
    $rootScope.id = response.data._id;
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

  $scope.add = function(item, user){
    $scope.name = item.name;
    $scope.link = item.link;
    var userId = $scope.user._id;
    $scope.item.user = userId;

    UserSvc.add_new(item)
    .then(function() {
      console.log('Inside Add_New method in Ctrl. Item:', item)
      $scope.items.push({
        name: $scope.name,
        link: $scope.link,
        user: userId
      })
      $scope.item.name = '';
      $scope.item.link = '';
      console.log('Added new items.')
    })
    .catch(function(err) {
      console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
    });
  }

  $scope.edit = function(item){
    $scope.item = {};
    $scope.item.name = item.name;
    $scope.item.link = item.link;
    $scope.editItemId = item._id;
    console.log($scope.editItemId, "Edit this Item.");
  }

  $scope.save_changes = function(item, editItemId){
    console.log('newly editted item for saving', item)
    $scope.item.name = item.name;
    $scope.item.link = item.link;
    $scope.item.id = editItemId;
    console.log($scope.item.id, "Yup, this item id.");
    UserSvc.save_changes(item)
    .then(function() {
      console.log('Inside edit method. Item:', item)
      console.log("HOW TO SAVE CHANGES ON FRONTEND?????");
    })
  }

  $scope.delete = function(item, $index){
    UserSvc.delete_item(item, $index)
    .then(function(){
      var item_to_delete = $scope.items[$index];
      console.log('item to delete', item_to_delete);
      $scope.items.splice($index, 1);
    })
  }

  $scope.star = function(){
    console.log('starred this person');
  }

}
