'use strict';

angular
.module('App')
.controller('FriendlistCtrl', FriendlistCtrl)

FriendlistCtrl.$inject = ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', 'getUser', 'getFriend']

function FriendlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams, getUser, getFriend) {

  $scope.followersPage = false;
  $scope.followingPage = false;

  /* _______________________
  |                         |
  |  Logged In User's Data: |
  |_________________________| */

  $rootScope.user = getUser.data
  var favoritesIdArr = getUser.data.favorites;
  var followingFriendIdArr = getUser.data.following;
  var likedItemsArr = getUser.data.liked;
  $rootScope.display_name = getUser.data.displayName;

  /* _______________
  |                 |
  |  Friend's Data: |
  |_________________| */

  $scope.user = getFriend.data;
  $scope.id = getFriend.data._id;
  $scope.items = getFriend.data.items;
  $rootScope.friendFollowers = getFriend.data.followers;
  $rootScope.friendFollowing = getFriend.data.following;
  $scope.display_name = getFriend.data.displayName
  $scope.email = getFriend.data.email
  $scope.pro_pic = getFriend.data.facebook
  // throws an cannot get length of undefined error;
  $scope.following = getFriend.data.following.length;


  $scope.followers = getFriend.data.followers.length;

  $scope.birthday = getFriend.data.birthday;
  if ($scope.birthday == undefined){
    $scope.birthday = ' N/A '
  }

  var friendFavId = getFriend.data._id;
  if (favoritesIdArr.indexOf(friendFavId) > -1){
    $rootScope.yellowStar = 'star_btn';
    $scope.favWishList = true;
  }

  if(followingFriendIdArr.indexOf($scope.id) > -1 ){
    console.log("TRUEEEE");
    $rootScope.follow = true;
  } else {
    console.log("FALSE");
    $rootScope.follow = false;
  }

  var friendFriendArray = [];
  var friendsIdArr = []
  for (var i=0; i<getFriend.data.friends.length; i++) {
    var friendFriendName = getFriend.data.friends[i].name;
    var friendId = getFriend.data.friends[i].id;
    friendFriendArray.push(friendFriendName);
    friendsIdArr.push(friendId);
  }

  $scope.friends = friendFriendArray;
  $scope.friendsLength = friendFriendArray.length;

  /* ____________________________________________________
  |                                                      |
  |  Display if logged in user has liked friend's items: |
  |______________________________________________________| */
  var friendItems = getFriend.data.items;
  var allTheLikedItemsArr= [];
  for (var i = 0; i < friendItems.length; i++){
    var each_likeable_item = friendItems[i]._id;
    if (likedItemsArr.indexOf(each_likeable_item) > -1 ) {
      allTheLikedItemsArr.push(i)
      $scope.like_heart =  allTheLikedItemsArr;
    }
  }

  /* ______________
  |                |
  |  Favorited By: |
  |________________| */

  $rootScope.friendFavoritedByArr = getFriend.data.favoritedBy;
  $rootScope.favoritedByLength = getFriend.data.favoritedBy.length;

  var allFriendFavoritedBy = $rootScope.friendFavoritedByArr;
  UserSvc.displayFaves(allFriendFavoritedBy)
  .then((response) => {
    var allFriendFavoritedBy = response.data;
    $rootScope.favoritedByModel = [];

    for (var i=0; i<allFriendFavoritedBy.length; i++) {
      var eachFriendFavoritedBy = allFriendFavoritedBy[i];
      var name = eachFriendFavoritedBy.displayName;
      var fbookId = eachFriendFavoritedBy.facebook;

      $rootScope.favoritedByModel[i] = {
        "name": name,
        "fbookId": fbookId
      }
    }
  })
  .catch((err) => {
  });

  /* ___________________
  |                     |
  |  Like Friend Items: |
  |_____________________| */
  $scope.like_item = (item, $index) => {
    if ($scope.like_heart != undefined && $scope.like_heart.indexOf($index) > -1 ) {
      console.log('------------> SCENARIO #1 - UNLIKING');
      var theIndex = $index;
      var parsed = parseInt($index);
      var arrayToRemoveFrom = $scope.like_heart;
      arrayToRemoveFrom.splice(arrayToRemoveFrom.indexOf(parsed), 1)
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
    })
    .catch((err) => {
    })
  }

  /* _______________________
  |                         |
  |  Star Friends Wishlist: |
  |_________________________| */

  $scope.star = (user) => {
    $scope.favWishList ? $scope.favWishList = false : $scope.favWishList = 'is_favoriting'

    if ($rootScope.yellowStar === undefined){
      $rootScope.yellowStar = 'star_btn'
    } else {
      $rootScope.yellowStar = undefined
    }
    UserSvc.starPerson(user)
    window.location.reload(true)
  }

  /* _______________
  |                 |
  |  Follow Friend: |
  |_________________| */

  $scope.followUser = (user) => {
    var tmpFriendId = user._id;

    if (followingFriendIdArr.indexOf(tmpFriendId) > -1){
      followingFriendIdArr.pop(tmpFriendId)
      $scope.unfollow = false;
      window.location.reload()
    } else {
      followingFriendIdArr.push(tmpFriendId)
      window.location.reload()
    }
    UserSvc.followPerson(user)
  }

  /* _________________________
  |                           |
  |  Follow/Unfollow Buttons: |
  |___________________________| */

  $scope.unfollowBtnShow = () => {
    $rootScope.follow = false;
    $rootScope.unfollow = true;
  }

  $scope.followBtnShow = () => {
    $rootScope.follow = true;
    $rootScope.unfollow = false;
  }

  /* ________________
  |                  |
  |  View followers: |
  |__________________| */

  $scope.goToFollowers = () => {
    $scope.followersPage = true;
    $scope.followingPage = false;
    var allFollowers = $rootScope.friendFollowers;

    UserSvc.showFollow(allFollowers)
    .then((response) => {
      var theFollowers = response.data;
      $scope.followersModel = [];

      for (var i=0; i<theFollowers.length; i++) {
        var eachFollower = theFollowers[i];
        var name = eachFollower.displayName;
        var id = eachFollower.facebook;

        $scope.followersModel[i] = {
          "name": name,
          "id": id
        }
      }
    })
  }

  /* ________________
  |                  |
  |  View following: |
  |__________________| */

  $scope.goToFollowing = () => {
    $scope.followingPage = true;
    $scope.followersPage = false;
    var allFollowing = $rootScope.friendFollowing;

    UserSvc.showFollow(allFollowing)
    .then((response) => {
      var theFollowing = response.data;
      $scope.followingModel = [];

      for (var i=0; i<theFollowing.length; i++) {
        var eachFollowing = theFollowing[i];
        var name = eachFollowing.displayName;
        var id = eachFollowing.facebook;

        $scope.followingModel[i] = {
          "name": name,
          "id": id
        }
      }
    })
  }



  /* ______________________
  |                        |
  |  View friend wishlist: |
  |________________________| */
  $scope.goToOthers = (otherUser) => {
    // console.log('go to others clicked', otherUser)

    if (otherUser.fbookId == $rootScope.user.facebook ){
      console.log('clicked on me, should go to my own page with NO hearts');
      $('#showFavBy').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      $state.go('my-wishlist', {id: $rootScope.user.facebook});
      return;
    }


    var myId = getUser.data.facebook
    var fid = otherUser.id || otherUser.fbookId;
    // code needed to remove the modal upon route change;
    $('#showFavBy').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $state.go('friend-wishlist', {id: myId, fid: fid});
  }

}
