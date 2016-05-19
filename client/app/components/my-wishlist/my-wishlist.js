'use strict';

angular
  .module('App')
  .controller('WishlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', WishlistCtrl])

function WishlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams) {
    // console.log('THESE ARE THE STATEPARMS', $stateParams.id)
    $scope.id = $stateParams.id;
    // console.log('is this the id in the url', $scope.id)

    if (!$auth.isAuthenticated()) {
      return $state.go('home');
    }

    UserSvc.getProfile()
      .then((response) => {
          $rootScope.user = response.data;
          $rootScope.id = response.data._id;
          $rootScope.display_name = response.data.displayName
          $rootScope.email = response.data.email
          $rootScope.pro_pic = response.data.facebook
          $rootScope.items = response.data.items;
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
              console.log('Inside Add_New method in Ctrl. Item:', item)
              $scope.items.push({
                  name: $scope.name,
                  link: $scope.link,
                  user: userId
              })
              $scope.item.name = '';
              $scope.item.link = '';
              console.log('Added new items.')
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
    }

    $scope.edit = (item) => {
      $scope.item = {};
      $scope.item.name = item.name;
      $scope.item.link = item.link;
      $scope.editItemId = item._id;
      console.log($scope.editItemId, "Edit this Item.");
    }

    $scope.save_changes = (item, editItemId) => {
      console.log('newly editted item for saving', item)
      $scope.item.name = item.name;
      $scope.item.link = item.link;
      $scope.item.id = editItemId;
      console.log($scope.item.id, "Yup, this item id.");
      UserSvc.save_changes(item)
          .then(() => {
              console.log('Inside edit method. Item:', item)
              console.log("HOW TO SAVE CHANGES ON FRONTEND?????");
          })
    }

    $scope.delete = (item, $index) => {
      console.log(item, "HERES THE ITEM.");
      console.log($index, "INDEX 1");
      UserSvc.delete_item(item, $index)
          .then(function() {
              console.log($index, "INDEX 1");
              var item_to_delete = $scope.items[$index];
              console.log('item to delete', item_to_delete);
              $scope.items.splice($index, 1);
          })
    }

    $scope.star = () => {
      console.log('starred this person');
    }
}
