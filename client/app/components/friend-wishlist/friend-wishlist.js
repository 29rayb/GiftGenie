'use strict';

angular
.module('App')
.controller('FriendlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', 'getUser', FriendlistCtrl])

function FriendlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams, getUser) {

  var favoritesIdArr = getUser.data.favorites;
  var followingFriendIdArr = getUser.data.following;
  $rootScope.display_name = getUser.data.displayName
  var friendId = $stateParams.fid;


  var likedItemsArr = getUser.data.liked;
  console.log(likedItemsArr, 'THIS IS THE LIKED ITEMS BEFORE WITHIN FRIEND PROFILE.*****');

  UserSvc.friendProfile(friendId)
  .then((response) => {
    console.log(response.data, "Response from GetFriend Profile service call.")
    $scope.user = response.data.user;
    $scope.id = response.data.user._id;
    $scope.birthday = response.data.user.birthday;
    console.log('!@#!@#!@#!@', $scope.birthday)
    if ($scope.birthday == undefined){
      $scope.birthday = ' N/A '
    }
    $scope.display_name = response.data.user.displayName
    $scope.email = response.data.user.email
    $scope.pro_pic = response.data.user.facebook
    $scope.items = response.data.items;
    $scope.friendsLengthh = response.data.user.friends.length;
    $scope.allFriendFriends = response.data.user.friends;
    $scope.following = response.data.user.following.length;
    $scope.followers = response.data.user.followers.length;

    var friendItems = response.data.user.items;
    console.log('******All of the friends items.');
    var allTheLikedItemsArr= [];
    for (var i = 0; i < friendItems.length; i++){
      var each_likeable_item = friendItems[i];
      if (likedItemsArr.indexOf(each_likeable_item) > -1 ) {
        allTheLikedItemsArr.push(i)
        $scope.like_heart =  allTheLikedItemsArr;
      }
    }

    var friendFavId = response.data.user._id;
    if (favoritesIdArr.indexOf(friendFavId) > -1){
      $rootScope.yellowStar = 'star_btn';
    }

    if(followingFriendIdArr.indexOf($scope.id) > -1 ){
      console.log('you are following this person')
      $rootScope.follow = true;
    } else {
      console.log('you are not following this person')
      $rootScope.follow = false;
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
    console.log('heart clicked')
    $scope.clicked ? $scope.clicked = false : $scope.clicked = true;
    // console.log($scope.like_heart, '<----------- value of $rootScope.like_heart outside if statement.');

    if ($scope.like_heart != undefined && $scope.like_heart.indexOf($index) > -1 ) {
      // console.log('------------------------> SCENARIO #1 - UNLIKING');
      var theIndex = $index;
      var parsed = parseInt($index);
      var arrayToRemoveFrom = $scope.like_heart;
      // console.log(arrayToRemoveFrom, 'BEFORE DELETING.');
      // console.log(arrayToRemoveFrom.length, 'LENGTH BEFORE');
      arrayToRemoveFrom.splice(arrayToRemoveFrom.indexOf(parsed), 1)
      // console.log(arrayToRemoveFrom, 'AFTER DELETING.');
      // console.log(arrayToRemoveFrom.length, 'LENGTH AFTER');
    } else if ($scope.like_heart == undefined ){
      // console.log('------------------------> SCENARIO #2 - LIKING (WHEN ITS THE FIRST LIKE.)');
      $scope.like_heart = [];
      $scope.like_heart.push($index)
      // console.log('after pushing index into like_heart',$scope.like_heart)
    } else if ($scope.like_heart != undefined ) {
      // console.log('------------------------> SCENARIO #3 - LIKING (WHEN ALREADY SOME LIKED.)');
      $scope.like_heart.push($index)
      // console.log('after pushing index into like_heart',$scope.like_heart)
    }

  UserSvc.likeItem(item)
  .then((res) => {
    console.log('response from item being liked', res);
  })
  .catch((err) => {
    console.log('error from item being liked', err)
  })
}

$scope.star = (user) => {
  if ($rootScope.yellowStar === undefined){
    $rootScope.yellowStar = 'star_btn'
  } else {
    $rootScope.yellowStar = undefined
  }
  // console.log('this is the user you are favoriting', user)
  UserSvc.starPerson(user)
}

$scope.followUser = (user) => {
  console.log('user', user._id)
  var tmpFriendId = user._id
  if (followingFriendIdArr.indexOf(tmpFriendId) > -1){
    followingFriendIdArr.pop(tmpFriendId)
    $scope.unfollow = false;
  } else {
    followingFriendIdArr.push(tmpFriendId)
    console.log('you are following this person')
    // need to fix this;
    window.location.reload()
    // $scope.unfollow = true;
    // $scope.follow = false;
  }
  console.log(followingFriendIdArr)
  UserSvc.followPerson(user)
}


$scope.unfollowBtnShow = () => {
  console.log('should show RED unfollow button & hide following button')
  $rootScope.follow = false;
  $rootScope.unfollow = true;
}

$scope.followBtnShow = () => {
  console.log('should show follow button only')
  $rootScope.follow = true;
  $rootScope.unfollow = false;
}

// need to pass in params so can make api call to backend for individual friend data;
$scope.goToFollowing = () => {
  $state.go('following')
}

$scope.goToFollowers = () => {
  $state.go('followers')
}


}