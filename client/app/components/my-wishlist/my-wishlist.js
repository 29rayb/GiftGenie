'use strict';

angular
  .module('App')
  .controller('WishlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', WishlistCtrl])

function WishlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams) {
    // console.log('THESE ARE THE STATEPARMS', $stateParams.id)

    $scope.id = $stateParams.id;
    $rootScope.fbook = $stateParams.facebook;
    $scope.settings = false;
    $scope.like_heart = false;
    $scope.favoriteWishlist = false;

    // console.log('is this the id in the url', $scope.id)

    if (!$auth.isAuthenticated()) {
      return $state.go('home');
    }

    UserSvc.getProfile()
      .then((response) => {
        console.log(response.data, "response")
          $rootScope.user = response.data;
          $rootScope.id = response.data._id;
          $rootScope.birthday = response.data.birthday;
          $rootScope.display_name = response.data.displayName
          $rootScope.email = response.data.email
          $rootScope.pro_pic = response.data.facebook
          // console.log('THIS IS THE PRO PIC ID', $rootScope.pro_pic)
          $rootScope.items = response.data.items;
          // $rootScope.pro_pic = response.data.picture 
          $rootScope.friends = response.data.friends[0].name;
          $rootScope.friendsLength = response.data.friends.length;
          $rootScope.favorites = response.data.favorites;
          // console.log(response.data.friends.length, 'friend length')
          // console.log("This is the data from GET request.", $rootScope.user);
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
      console.log('like this item', item)
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
      $scope.settings = true;
      $scope.public = true;
      $scope.private = false;
      $scope.makePrivate = () => {
        $scope.private = true;
        $scope.public = false;
      }
      $scope.makePublic = () => {
        $scope.private = false;
        $scope.public = true;
      }
    }

    $scope.backToWlist = () => {
      $scope.settings = false;
    }

    $scope.sort_list = () => {
      var newOrder = $scope.items 
      console.log('updated order array', newOrder)
      UserSvc.saveOrder(newOrder)
    }

    $scope.sortableOptions = {
      update: function(e, ui){ $scope.sort_list() },
      axis: 'y'
    };


}









