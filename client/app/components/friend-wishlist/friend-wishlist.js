'use strict';

angular
  .module('App')
  .controller('FriendlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', FriendlistCtrl])

  function FriendlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams) {
    console.log("hey")

    console.log($stateParams, 'state params');
    var friendId = $stateParams.fid;

    UserSvc.friendProfile(friendId)
      .then((response) => {
        console.log(response.data, "response")
          $scope.user = response.data;
          $scope.id = response.data._id;
          $scope.birthday = response.data.birthday;
          $scope.display_name = response.data.displayName
          $scope.email = response.data.email
          $scope.pro_pic = response.data.facebook
          console.log('THIS IS THE PRO PIC ID', $scope.pro_pic)
          $scope.items = response.data.items;
          // $scope.pro_pic = response.data.picture 
          $scope.friends = response.data.friends[0].name;

          $scope.friendsLength = response.data.friends.length;

          console.log(response.data.friends.length, 'friend length')
          console.log("This is the data from GET request.", $scope.user);
      })
      .catch((err) => {
          console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
      });
  }