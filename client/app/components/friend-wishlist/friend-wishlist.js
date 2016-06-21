'use strict';

angular
.module('App')
.controller('FriendlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', 'getUser', FriendlistCtrl])

function FriendlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams, getUser) {

  var favoritesIdArr = getUser.data.favorites;

  $rootScope.display_name = getUser.data.displayName
  // $scope.like_heart = false;

  var likedItemsArr = getUser.data.liked
  var friendId = $stateParams.fid;

  UserSvc.friendProfile(friendId)
  .then((response) => {
    // console.log(response.data, "response")
    $scope.user = response.data.user;
    $scope.id = response.data.user._id;
    $scope.birthday = response.data.user.birthday;
    $scope.display_name = response.data.user.displayName
    $scope.email = response.data.user.email
    $scope.pro_pic = response.data.user.facebook
    $scope.items = response.data.items;
    $scope.friendsLengthh = response.data.user.friends.length;
    $scope.allFriendFriends = response.data.user.friends;

    var friendItems = response.data.user.items;
    var allTheLikedItemsArr= [];
    for (var i = 0; i < friendItems.length; i++){
      var each_likeable_item = friendItems[i];
      if (likedItemsArr.indexOf(each_likeable_item) > -1 ) {
        allTheLikedItemsArr.push(i)
        // console.log('!@#!@#!@#!@321', allTheLikedItemsArr)
        $rootScope.like_heart =  allTheLikedItemsArr;
      }
    }

    var friendFavId = response.data.user._id;
    if (favoritesIdArr.indexOf(friendFavId) > -1){
      $rootScope.yellowStar = 'star_btn';
    }

    var friendFriendArray = [];
    for (var i=0; i<response.data.user.friends.length; i++) {
      var friendFriendName = response.data.user.friends[i].name;
      friendFriendArray.push(friendFriendName);
    }

    $scope.friends = friendFriendArray;
    $scope.friendsLength = friendFriendArray.length;
  })
  .catch((err) => {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });

  $scope.like_item = (item, $index) => {
    // console.log('this is the like item', item)
    console.log('this is the INDEXXXXXX item', $index)

    if ($rootScope.like_heart.indexOf($index) > -1){
      console.log('this index is already liked in the front end')
      console.log('before slicing ',$rootScope.like_heart)
      delete $rootScope.like_heart[$index]
      // $rootScope.like_heart.slice($index, 1);
      console.log('after slicing', $rootScope.like_heart)
    } else {
      $rootScope.like_heart.push($index)
      console.log('item liked and added to array to be colored on front end')
    }

    console.log('!!!!!!!@!@!@!@!@!@!@!',$rootScope.like_heart)

    UserSvc.likeItem(item)
      .then((res) => {
        // console.log('response from item being liked', res);
      })
      .catch((err) => {
        console.log('error from item being liked', err)
      })
    }



  $scope.star = function (user) {
    if ($rootScope.yellowStar === undefined){
      $rootScope.yellowStar = 'star_btn'
    } else {
      $rootScope.yellowStar = undefined
    }
    // console.log('this is the user you are favoriting', user)
    UserSvc.starPerson(user)
  }
}
