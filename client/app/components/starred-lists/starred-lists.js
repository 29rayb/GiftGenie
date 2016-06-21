'use strict';

angular
.module('App')
.controller('StarredCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', 'StarSvc', '$stateParams', 'getUser', '$rootScope', StarredCtrl])

function StarredCtrl($scope, $state, $auth, $http, $window, UserSvc, StarSvc, $stateParams, getUser, $rootScope){

  if(!$auth.isAuthenticated()){
    return $state.go('home');
  }

// $scope.favorites = getUser.data.favorites;
// var favoritesIdsArray = $scope.favorites;

  UserSvc.showFavoritesData()
  .then((response) => {
    var favsLength = response.data.user.favorites.length;
    var favObj = response.data.favoritesData
    console.log(favObj)
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






    // var friendFriendArray = [];
    // for (var i=0; i<response.data.user.friends.length; i++) {
    //   var friendFriendName = response.data.user.friends[i].name;
    //   friendFriendArray.push(friendFriendName);
    // }









  $scope.star = () => {
    console.log('star in starred list')
  }

  $rootScope.display_name = getUser.data.displayName
  $rootScope.email = getUser.data.email
  $rootScope.birthday = getUser.data.birthday;
  $rootScope.favorites = getUser.data.favorites;

  $scope.friendsContainer = true;

  // $scope.search = () => {
  //   // var facebookId = .facebook;
  //   // console.log('facebookId', facebookId)
  //   StarSvc.get_friends()
  //     .then(function(res){
  //       console.log(res.data, "here are the friends we would get back");
  //     })
  //     .catch(function(err) {
  //       console.error(err, 'have no friends');
  //     });
  // }
  //

  $scope.show_user_info = () => {
    $scope.clicked_card ? $scope.clicked_card = false : $scope.clicked_card = true;
  }

}
