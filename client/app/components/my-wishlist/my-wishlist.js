'use strict';

angular
  .module('App')
  .controller('WishlistCtrl', WishlistCtrl)

WishlistCtrl.$inject = ['$scope', '$state', '$auth', '$http', '$window', '$rootScope', '$stateParams', 'UserSvc', 'getUser']

function WishlistCtrl($scope, $state, $auth, $http, $window, $rootScope, $stateParams, UserSvc, getUser) {

  // can eliminate this extra API call for my profile everytime by
  // using localstorage;
  // console.log('made an API call for my profile')

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
  $rootScope.followersCount = getUser.data.followers.length;
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


  if (allFavoritedBy.length === $rootScope.favoritedByArrLength){
    // console.log('NO need for an API call')
  } else {
    // should eliminate this extra api call;
    // console.log('API call to get favs')
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
      // console.log('SAME! No need for API Call.')
    } else  {
      UserSvc.showFollow(allFollowing)
        .then((response) => {
          var theFollowing = response.data;
          $rootScope.currentFollowingLength = theFollowing.length;
          // console.log(theFollowing, '<-------MADE API Call')
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

    if($rootScope.followersCount === $rootScope.currentFollowersLength){
      // console.log('No need for API call')
    } else {
      UserSvc.showFollow(allFollowers)
      .then((response) => {
        var theFollowers = response.data;
        $rootScope.currentFollowersLength = theFollowers.length;
        // console.log(theFollowers, '<-------MADE API Call')

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

  }

  /* ______________
  |              |
  |  Add Item:   |
  |______________| */

  $scope.add = (item, user) => {
    console.log('about to add items ITEM', item)
    console.log('about to add items USER', user)
    $scope.name = item.name;
    $scope.link = item.link;
    var userId = $scope.user._id;
    $scope.item.user = userId;

    UserSvc.add_new(item)
    .then(() => {
      // console.log('made API call to add items')
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
    var first_name = user.displayName.split(' ')[0]
    swal({
      title: first_name,
      html: true,
      text: "<b>You added a WiSH!</b> <div>Let your friends know so they can surprise you</div>",
      type: "success",
      timer: 2800
    })
    // shouldn't need this if done right;
    // window.location.reload(true)
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
  $scope.edit = (item, $index, $event) => {
    // console.log('about to edit items', $event)
    // timestamp available with $event;
    // if ($event.which === 27){
    //   console.log('exited out of edit modal')
    // }
    $rootScope.editItemIndex = $index;
    $scope.item = {};
    $scope.item.link = item.link;
    $scope.item.name = item.name;
    $scope.editItemId = item._id;
  }

  // when user exits out of edit modal without saving changes,
  // remove all inputs;
  $scope.removeInputs = ($event) => {
    console.log('out-ed without saving edits')
    $event.preventDefault();
    $scope.item = {};
  }

  $scope.save_changes = (item, editItemId, $event) => {
    console.log('saving changes')
    $scope.item.name = item.name;
    $scope.item.link = item.link;
    $scope.item.id = editItemId;
    UserSvc.save_changes(item)
    .then((res) => {
      console.log('trying to save edit', res)
      var itemAfterEdit = {
        name: res.data.name,
        link: res.data.link
      }
      $scope.items.splice($rootScope.editItemIndex, 1, itemAfterEdit)
      // $scope.item.link = res.data.link
      // $scope.item.name = res.data.name
      $('#edit').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      // remove inputs after changes are saved so when user opens
      // up add item modal, it doesn't show the saved changes there;
      $scope.removeInputs($event)
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
    // console.log('Made API call to delete items')
    $scope.items.splice($index, 1)
    UserSvc.delete_item(item, $index)
  }

  /* ______________
  |                |
  |  Star Wishlist:|
  |________________| */
  // $scope.star = function (user) {
  //   console.log('made API call to star wishlist')
  //   UserSvc.starPerson(user)
  // }



  /* ______________
  |              |
  |  Settings:   |
  |______________| */
  $scope.goToSettings = () => {
    $rootScope.settings = true;
    $rootScope.followersPage = false;
    $rootScope.followingPage = false;
    $rootScope.starred = false;

    $scope.makePrivate = () => {
      var loggedInUser = $rootScope.user;
      UserSvc.makePrivate(loggedInUser)
      .then(() => {
        console.log('making API call to make user Private');
      })
      .catch(() => {
        console.error('ERROR: Making user private.')
      })
      $scope.private = true;
      $scope.public = false;
    }

    $scope.makePublic = () => {
      var loggedInUser = $rootScope.user;
      UserSvc.makePublic(loggedInUser)
        .then(() => {
          console.log('making API call to make user public')
        })
        .catch(() => {
          console.error('ERROR: Making user public')
        })
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
    console.log('API call to save order of items in backend')
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
    // console.log('go to others clicked', otherUser)
    var myId = getUser.data.facebook
    var fid = otherUser.id || otherUser.fbookId;
    // code needed to remove the modal upon route change;
    $('#showFavBy').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $state.go('friend-wishlist', {id: myId, fid: fid});
  }

  /* _____________________
  |                       |
  |  Display starredLists |
  |_______________________| */

  // should put the counter in the localstorage to keep track of
  // length of the people I starred; but right now, saves extra API
  // call everytime I go to starred list;
  var counter = 0;
  if ($rootScope.favorites.length === getUser.data.favorites.length){
    if (counter === 0) {
        console.log('1st making API call to get Starred Friends')
          // need this API call to get Data in right format;
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
            counter++
          })
          .catch((err) => {
            console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
          });
    }
    else {
      // console.log('no need for API call to get Starred friends')
    }
  } else {
    console.log(' 2nd making API call to get Starred Friends')
          // need this API call to get Data in right format;
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

}
