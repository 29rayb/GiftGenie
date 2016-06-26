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
  // $scope.notFollowing = true;

  // console.log('is this the id in the url', $scope.id)

  if (!$auth.isAuthenticated()) {
    return $state.go('home');
  }

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
    console.log($rootScope.privacy, '<--------------- CURRENT PRIVATE SETTING.(false=public, true=private)');

    if ($rootScope.privacy == true) {
      $scope.public = false;
      $scope.private = true;
    } else if ($rootScope.privacy == false) {
      $scope.public = true;
      $scope.private = false;
    }

    $rootScope.followersModel = [];
    $rootScope.followingModel = [];

    $scope.followingArr = response.data.following;
    for( var i = 0; i< $scope.followingCount; i++){
      $rootScope.followingModel[i] = {
        "name": response.data.friends[i].name,
        "id": response.data.friends[i].id
      }
    }

    $scope.followersArr = response.data.following;
    for( var i = 0; i< $scope.followersCount; i++){
      $rootScope.followersModel[i] = {
        "name": response.data.friends[i].name,
        "id": response.data.friends[i].id
      }
    }

  })
  .catch((err) => {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });

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

  $scope.like_item = (item) => {
    UserSvc.likeItem(item)
  }

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
      // shouldn't need this if done right;
      window.location.reload(true)
    })
    .catch(() => {
      console.error('saving method doesnt work')
    })
  }

  $scope.delete = (item, $index) => {
    $scope.items.splice($index, 1)
    UserSvc.delete_item(item, $index)
  }

  $scope.star = function (user) {
    // console.log('this is the user you are favoriting', user)
    UserSvc.starPerson(user)
  }

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

  // $scope.backToWlist = () => {
  //   $scope.settings = false;
  //   $scope.followersPage = false;
  //   $scope.followingPage = false;
  // }

  $scope.sort_list = () => {
    var newOrder = $scope.items
    console.log('updated order array', newOrder)
    UserSvc.saveOrder(newOrder)
  }

  $scope.sortableOptions = {
    update: function(e, ui){ $scope.sort_list() },
    axis: 'y'
  };


  $scope.goToFollowing = () => {
    $rootScope.followingPage = true;
    $rootScope.followersPage = false;
    $rootScope.settings = false;
    $rootScope.starred = false;;
  }

  $scope.goToFollowers = () => {
    $rootScope.followersPage = true;
    $rootScope.followingPage = false;
    $rootScope.settings = false;
    $rootScope.starred = false;
  }

  $scope.goToStarred = () => {
    $rootScope.starred = true;
    $rootScope.followersPage = false;
    $rootScope.followingPage = false;
    $rootScope.settings = false;
  }

  $scope.goToOthers = (otherUser) => {
    console.log('yolo', otherUser)
    UserSvc.getProfile()
    .then((response) => {
      var myId = response.data.facebook;
      // var fid = otherUser.id;
      // console.log('MyId TRYING TO CHANGE PAGE', myId)
      $state.go('friend-wishlist', {id: myId, fid: otherUser.id});
    })
  }

  UserSvc.showFavoritesData()
  .then((response) => {
    var favsLength = response.data.user.favorites.length;
    var favObj = response.data.favoritesData
    // console.log(favObj)
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
    // console.log($scope.favsModel)
  })
  .catch((err) => {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });


  $scope.show_user_info = () => {
    $scope.clicked_card ? $scope.clicked_card = false : $scope.clicked_card = true;
  }

}
