'use strict';

angular
.module('App')
.controller('WishlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', WishlistCtrl])

function WishlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams) {

  $scope.id = $stateParams.id;
  $rootScope.fbook = $stateParams.facebook;
  $rootScope.settings = false;
  $rootScope.starred = false;
  $rootScope.followersPage = false;
  $rootScope.followingPage = false;
  $scope.like_heart = false;
  $scope.favoriteWishlist = false;

  /* ______________
  |              |
  |  Auth Check: |
  |______________| */

  if (!$auth.isAuthenticated()) {
    return $state.go('home');
  }

  /* ________________
  |                  |
  |  Get User Info:  |
  |__________________| */

  UserSvc.getProfile()
  .then((response) => {
    $rootScope.user = response.data;
    $rootScope.id = response.data._id;
    $rootScope.birthday = response.data.birthday;
    $rootScope.display_name = response.data.displayName
    $rootScope.email = response.data.email
    $rootScope.pro_pic = response.data.facebook
    $rootScope.items = response.data.items;
    $rootScope.friends = response.data.friends[0].name;
    $rootScope.friendsLength = response.data.friends.length;
    $rootScope.favorites = response.data.favorites;
    $scope.followersCount = response.data.followers.length;
    $scope.followingCount = response.data.following.length;
    $rootScope.privacy = response.data.private;

    if ($rootScope.privacy == true) {
      $scope.public = false;
      $scope.private = true;
    } else if ($rootScope.privacy == false) {
      $scope.public = true;
      $scope.private = false;
    }

    $rootScope.followingArr = response.data.following;
    $rootScope.followersArr = response.data.followers;

    /* ________________
    |                  |
    |  Favorited By:   |
    |__________________| */
    $rootScope.favoritedByArr = response.data.favoritedBy;

    var allFavoritedBy = $rootScope.favoritedByArr;
    UserSvc.displayFaves(allFavoritedBy)
    .then((response) => {
      var allFavoritedBy = response.data;
      $rootScope.favoritedByModel = [];

      for (var i=0; i<allFavoritedBy.length; i++) {
        var eachFavoritedBy = allFavoritedBy[i];
        var name = eachFavoritedBy.displayName;

        $rootScope.favoritedByModel[i] = {
          "name": name
        }
      }
    })
  })
  .catch((err) => {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });


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

    UserSvc.showFollow(allFollowing)
    .then((response) => {
      var theFollowing = response.data;
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
    var favsLength = response.data.user.favorites.length;
    var favObj = response.data.favoritesData
    $scope.favsModel = [];
    for (var i = 0; i < favsLength; i++){
      // var favsName = favObj[i].displayName;
      // favsNameArr.push(favsName);
      // var favsPic = favObj[i].picture;
      // favsPicArr.push(favsPic);
      $scope.favsModel[i] = {
        "name": favObj[i].displayName,
        "id": favObj[i].facebook
      };
    }
  })
  .catch((err) => {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });


  /* ________________
  |                  |
  |  ???: |
  |__________________| */
  $scope.show_user_info = () => {
    $scope.clicked_card ? $scope.clicked_card = false : $scope.clicked_card = true;
  }

}
