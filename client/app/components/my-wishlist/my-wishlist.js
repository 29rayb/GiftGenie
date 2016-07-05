'use strict';

angular
  .module('App')
  .controller('WishlistCtrl', WishlistCtrl)

WishlistCtrl.$inject = ['$scope', '$state', '$auth', '$http', '$window', '$rootScope', '$stateParams', 'UserSvc', 'getUser']

function WishlistCtrl($scope, $state, $auth, $http, $window, $rootScope, $stateParams, UserSvc, getUser) {

  if (!$auth.isAuthenticated()) {
    return $state.go('home');
  }

  $scope.like_heart = false;
  $scope.favoriteWishlist = false;

  $rootScope.user = getUser.data
  $rootScope.id = getUser.data._id;
  $rootScope.birthday = getUser.data.birthday;
  if ($rootScope.birthday == undefined){
    $rootScope.birthday = ' N/A '
  }
  $rootScope.display_name = getUser.data.displayName
  $rootScope.email = getUser.data.email
  $rootScope.pro_pic = getUser.data.facebook
  $rootScope.items = getUser.data.items;
  $rootScope.friendsLength = getUser.data.friends.length;
  $rootScope.favorites = getUser.data.favorites;
  $scope.followersCount = getUser.data.followers.length;
  $rootScope.followingCount = getUser.data.following.length;
  $rootScope.followingArr = getUser.data.following;
  $rootScope.followersArr = getUser.data.followers;
  $rootScope.privacy = getUser.data.private;

  if ($rootScope.privacy == true) {
    $scope.public = false;
    $scope.private = true;
  } else if ($rootScope.privacy == false) {
    $scope.public = true;
    $scope.private = false;
  }

  $rootScope.favoritedByArr = getUser.data.favoritedBy;
  $rootScope.favoritedByLength = getUser.data.favoritedBy.length;

  var allFavoritedBy = $rootScope.favoritedByArr;



  if (allFavoritedBy.length !== $rootScope.favoritedByArr.length){
    console.log('getting the favorited By')
    UserSvc.displayFaves(allFavoritedBy)
      .then((res) => {
        var allFavoritedBy = res.data;
        $rootScope.favoritedByModel = [];

        for (var i=0; i<allFavoritedBy.length; i++) {
          var eachFavoritedBy = allFavoritedBy[i];
          var name = eachFavoritedBy.displayName;
          var fbookId = eachFavoritedBy.facebook;

          $rootScope.favoritedByModel[i] = {
            "name": name,
            "fbookId": fbookId
          }
        }
      })
      .catch((err) => {
        console.error(err, 'Error getting the favorited by array!');
      });
  }

  /* ________________
  |                  |
  |  View following: |
  |__________________| */

  $scope.goToFollowing = () => {
    $rootScope.followingPage = true;
    $rootScope.followersPage = false;
    $rootScope.settings = false;
    $rootScope.starred = false;

    var allFollowing = $rootScope.followingArr;

    if($rootScope.followingCount === $rootScope.currentFollowingLength) {
      console.log('SAME! No need for API Call.')
    } else  {
      UserSvc.showFollow(allFollowing)
        .then((response) => {
          var theFollowing = response.data;
          $rootScope.currentFollowingLength = theFollowing.length;
          console.log(theFollowing, '<-------MADE API Call')
          $rootScope.followingModel = [];

          for (var i=0; i<theFollowing.length; i++) {
            var eachFollowing = theFollowing[i];
            var name = eachFollowing.displayName;
            var id = eachFollowing.facebook;

            $rootScope.followingModel[i] = {
              "name": name,
              "id": id
            }
          }
        })
      }
    }

  /* ________________
  |                  |
  |  View followers: |
  |__________________| */

  $scope.goToFollowers = () => {
    $rootScope.followersPage = true;
    $rootScope.followingPage = false;
    $rootScope.settings = false;
    $rootScope.starred = false;

    var allFollowers = $rootScope.followersArr;

    UserSvc.showFollow(allFollowers)
    .then((response) => {
      var theFollowers = response.data;
      $rootScope.followersModel = [];

      for (var i=0; i<theFollowers.length; i++) {
        var eachFollower = theFollowers[i];
        var name = eachFollower.displayName;
        var id = eachFollower.facebook;

        $rootScope.followersModel[i] = {
          "name": name,
          "id": id
        }
      }
    })
  }

  /* ______________
  |              |
  |  Add Item:   |
  |______________| */

  $scope.add = (item, user) => {
    $scope.name = item.name;
    $scope.link = item.link;
    var userId = $scope.user._id;
    $scope.item.user = userId;

    UserSvc.add_new(item)
    .then(() => {
      $scope.items.push({
        name: $scope.name,
        link: $scope.link,
        user: userId
      })
      $scope.item.name = '';
      $scope.item.link = '';
    })
    .catch((err) => {
      console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
    });
    swal({
      title: "Good job!",
      text: "You added the item!",
      type: "success",
      timer: 2000
    })
    // shouldn't need this if done right;
    window.location.reload(true)
  }

  /* ______________
  |              |
  |  Like Item:  |
  |______________| */
  $scope.like_item = (item) => {
    UserSvc.likeItem(item)
  }

  /* ______________
  |              |
  |  Edit Item:  |
  |______________| */
  $scope.edit = (item) => {
    $scope.item = {};
    $scope.item.link = item.link;
    $scope.item.name = item.name;
    $scope.editItemId = item._id;
  }

  $scope.save_changes = (item, editItemId) => {
    $scope.item.name = item.name;
    $scope.item.link = item.link;
    $scope.item.id = editItemId;
    UserSvc.save_changes(item)
    .then(() => {
      window.location.reload(true)
    })
    .catch(() => {
      console.error('saving method doesnt work')
    })
  }

  /* ______________
  |              |
  |  Delete Item:|
  |______________| */
  $scope.delete = (item, $index) => {
    $scope.items.splice($index, 1)
    UserSvc.delete_item(item, $index)
  }

  /* ______________
  |                |
  |  Star Wishlist:|
  |________________| */
  $scope.star = function (user) {

    UserSvc.starPerson(user)
  }



  /* ______________
  |              |
  |  Settings:   |
  |______________| */
  $scope.goToSettings = () => {
    console.log('Inside Settings.');
    $rootScope.settings = true;
    $rootScope.followersPage = false;
    $rootScope.followingPage = false;
    $rootScope.starred = false;

    $scope.makePrivate = () => {
      console.log('making Private');
      var loggedInUser = $rootScope.user;
      UserSvc.makePrivate(loggedInUser)
      .then(() => {
        console.log('User now private.');
      })
      .catch(() => {
        console.error('Making private method has an error.')
      })
      $scope.private = true;
      $scope.public = false;
    }

    $scope.makePublic = () => {
      console.log('making Public');
      var loggedInUser = $rootScope.user;
      UserSvc.makePublic(loggedInUser)
      $scope.private = false;
      $scope.public = true;
    }
  }

  /* ________________
  |                  |
  |  Re-order Items: |
  |__________________| */
  $scope.sort_list = () => {
    var newOrder = $scope.items
    console.log('updated order array', newOrder)
    UserSvc.saveOrder(newOrder)
  }

  $scope.sortableOptions = {
    update: function(e, ui){ $scope.sort_list() },
    axis: 'y'
  };

  /* ________________
  |                  |
  |  View starred:   |
  |__________________| */
  $scope.goToStarred = () => {
    $rootScope.starred = true;
    $rootScope.followersPage = false;
    $rootScope.followingPage = false;
    $rootScope.settings = false;
  }


  /* ______________________
  |                        |
  |  View friend wishlist: |
  |________________________| */
  $scope.goToOthers = (otherUser) => {
    console.log('Going to a users page yo --> They are:', otherUser)
    UserSvc.getProfile()
    .then((response) => {
      var myId = response.data.facebook;
      var fid = otherUser.id;
      $state.go('friend-wishlist', {id: myId, fid: otherUser.id});
    })
  }

  /* __________________
  |                    |
  |  Display favorites |
  |____________________| */
  UserSvc.showFavoritesData()
  .then((response) => {
    var favsLength = response.data.favorites.length;
    var favObj = response.data.favorites;
    $scope.favsModel = [];
    for (var i = 0; i < favsLength; i++){
      $scope.favsModel[i] = {
        "name": favObj[i].displayName,
        "id": favObj[i].facebook
      };
    }
    // console.log('this is how many ppl you have starred', $scope.favsModel.length);
    $rootScope.starredLength = $scope.favsModel.length;
  })
  .catch((err) => {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });
}
