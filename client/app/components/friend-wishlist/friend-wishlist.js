'use strict';

angular
.module('App')
.controller('FriendlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', 'getUser', FriendlistCtrl])

function FriendlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams, getUser) {

  console.log('getUSER@#$^#$@!{#@)$#%#@)%@$%$', getUser.data.favorites)

  var favoritesIdArr = getUser.data.favorites;

  $rootScope.display_name = getUser.data.displayName
  $scope.like_heart = false;

  var likedItemsArr = getUser.data.liked
  console.log('likedItemsArr', likedItemsArr)

  // console.log($stateParams, 'state params');
  var friendId = $stateParams.fid;

  UserSvc.friendProfile(friendId)
  .then((response) => {
    console.log(response.data, "response")
    $scope.user = response.data.user;
    $scope.id = response.data.user._id;
    $scope.birthday = response.data.user.birthday;
    $scope.display_name = response.data.user.displayName
    $scope.email = response.data.user.email
    $scope.pro_pic = response.data.user.facebook
    $scope.items = response.data.items;
    $scope.friendsLengthh = response.data.user.friends.length;
    $scope.allFriendFriends = response.data.user.friends;
    var friendFavId = response.data.user._id;
    if (favoritesIdArr.indexOf(friendFavId) > -1){
      $scope.yellowStar = 'star_btn';
    }

    var friendFriendArray = [];
    for (var i=0; i<response.data.user.friends.length; i++) {
      var friendFriendName = response.data.user.friends[i].name;
      friendFriendArray.push(friendFriendName);
    }

    console.log(likedItemsArr)
    for (var i = 0; i < likedItemsArr.length; i++){
      // likedItemsArr[i].addClass("liked_item");
    }


    $scope.friends = friendFriendArray;
    $scope.friendsLength = friendFriendArray.length;
  })
  .catch((err) => {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });

  // $scope.alreadyLiked = true;

  $scope.like_item = (item) => {
    UserSvc.likeItem(item)
      .then((res) => {
        console.log('response from item being liked', res);
      })
      .catch((err) => {
        console.log('error from item being liked', err)
      })
    }



  $scope.star = function (user) {
    console.log(user, 'user')

    // console.log('this is the user you are favoriting', user)
    UserSvc.starPerson(user)
  }
}
