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

    //   $http.post('/auth/facebook')
    // .then(function(response){
    //   console.log(response)
    // }, function(err){
    //   console.log(err)
    // })

  // $http.get('/users/me')
  // .then(function(res) {
  //   $scope.user = res.data;
  //   console.log('This is the response from retrieving the logged in user info!', res);
  //   var $loggedInUser = res.data._id;
  //   console.log($loggedInUser, 'Here is it!');
  // }, function(err) {
  //   console.error(err);
  // });

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

  $scope.star = function(){
    console.log('starred this person');
  }


}


// 'use strict';
//
// angular.module('App')
// .controller('MyWishListCtrl', function($scope, $auth, $state, $http) {
//
//   if(!$auth.isAuthenticated()){
//     return $state.go('home');
//   }
//

//
//
//   $http.get('/users/me')
//   .then(function(res) {
//     $scope.user = res.data;
//     console.log('res:', res);
//   }, function(err) {
//     console.error(err);
//   });
// });

// 'use strict';
//
// angular
// .module('App')
// .controller('MyWishListCtrl', ['$scope', '$state', '$auth', '$http', MyWishListCtrl])
//
// function MyWishListCtrl($scope, $state, $auth, $http, $rootScope, UserService, $window) {
//   console.log('Hitting the Wishlist Controller.')
//
//   //This statement checks if the person is logged in.
//   if(!$auth.isAuthenticated()){
//     console.log("NOT AUTHENTICATED.");
//     return $state.go('home');
//   }
//
//   getUserInfo();
//
//   function getUserInfo() {
//     console.log("Inside get user info function.");
//     $http.get('/users/me')
//       .then(function (response) {
//         $scope.user = {}
//         var theUser = response.data;
//         console.log($scope.user, "this is scope.user");
//         console.log(theUser, "theUser");
//       })
//       .catch(function (response) {
//         console.log("getUserInfo error", response);
//       })
//   }
//
//
//   // function getUserInfo() {
//   //   console.log("Inside get user info function.");
//   //   $scope.user = {}
//   //   console.log($scope.user, "$scope.user");
//   //   // var $user = $scope.user._id;
//   //   UserService.theirMongoId()
//   //   .then(function(res){
//   //     console.log("FUCKING INSIDE IT MAN");
//   //   })
//   // $scope.getUserMongoId = function() {
//   //   console.log($user, "$user");
//   // }
//   // }
//
//
//
//
//   // setToken();
//   // $scope.setToken = function(token, user) {
//   //   .then(function(res) {
//   //     var storedToken = res.data;
//   //     console.log("We've stored the token in local storage.");
//   //   })
//   //   .catch(function(err){
//   //     console.error(err, 'Token NOT stored. ');
//   //   });
//   // };
//
//   // Calling the function to locate our user:
//   // getUserInfo();
//   // console.log("Reached user info function.");
//   //
//   // function getUserInfo() {
//   //   $http.get('/users')
//   //   .then(function (response) {
//   //     $scope.user = response.data;
//   //     console.log("THE USER INFO IS:", $scope.user);
//   //   })
//   //   .catch(function (response) {
//   //     console.log("getUserInfo error", response);
//   //   })
//   // }
//   //
//
//
//
//
//   // $http.get('/users/me')
//   // .then(function(res) {
//   //   var loggedInUser = {};
//   //   res.data = $rootScope.loggedInUser;
//   //   console.log(loggedInUser, "HEER RES.DATA");
//   //   this._id = identifier;
//   //   console.log(identifier, "IDNETIFIER");
//   //   // $scope.user = res.data;
//   //   // console.log('This is the response from retrieving the logged in user info!', res);
//   //   // var $loggedInUser = res.data._id;
//   //   // console.log($loggedInUser, 'Here is it!');
//   //   return $http.get('/user/' + _id);
//   // }, function(err) {
//   //   console.error(err);
//   // });
//
//   $scope.add_new = function(){
//     console.log('add new item')
//   }
//
//   $scope.edit = function(){
//     console.log('edit item')
//   }
//
//   $scope.delete = function($index){
//     console.log('delete', $index);
//     var item_to_delete = $scope.items[$index];
//     console.log('item to delete', item_to_delete);
//     $scope.items.splice($index, 1);
//   }
// }
