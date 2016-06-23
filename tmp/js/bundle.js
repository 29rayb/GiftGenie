'use strict';

angular.module('App', ['ui.router', 'satellizer', 'app.routes', 'ui.sortable']);
'use strict';

angular.module('app.routes', []).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$authProvider', AppRoutes]);

function AppRoutes($stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {
  // $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('faq', {
    url: '/faq',
    templateUrl: 'app/components/faq/faq.html',
    controller: 'faqCtrl',
    resolve: {
      getUser: function getUser(UserSvc) {
        return UserSvc.getProfile();
      }
    }
  }).state('home', {
    url: '/',
    templateUrl: 'app/components/home/home.html',
    controller: 'HomeCtrl'
  }).state('my-wishlist', {
    url: '/my-wishlist/:id',
    templateUrl: 'app/components/my-wishlist/my-wishlist.html',
    controller: 'WishlistCtrl'
  }).state('friend-wishlist', {
    url: '/my-wishlist/:id/friends/:fid',
    templateUrl: 'app/components/friend-wishlist/friend-wishlist.html',
    controller: 'FriendlistCtrl',
    resolve: {
      getUser: function getUser(UserSvc) {
        return UserSvc.getProfile();
      }
    }
  }).state('settings', {
    url: '/settings/:id',
    templateUrl: 'app/components/settings/settings.html',
    controller: 'SettingsCtrl'
  }).state('starred-lists', {
    url: '/starred-lists/:id',
    templateUrl: 'app/components/starred-lists/starred-lists.html',
    controller: 'StarredCtrl',
    resolve: {
      getUser: function getUser(UserSvc) {
        return UserSvc.getProfile();
      }
    }
  });

  $authProvider.facebook({
    clientId: '247255738962232',
    requiredUrlParams: ['scope'],
    scope: ['user_friends', 'email', 'user_birthday', 'user_likes']
  });
}
'use strict';

angular.module('App').service('NavSvc', NavSvc);

NavSvc.$inject = ['$http'];

function NavSvc($http) {}
'use strict';

angular.module('App').factory('StarSvc', StarSvc);

StarSvc.$inject = ['$http'];

function StarSvc($http) {
  return {
    get_friends: function get_friends() {
      console.log("IN HERE. This is user in service");
      return $http.get('/api/me/friends');
    }
  };
};
'use strict';

angular.module('App').factory('UserSvc', UserSvc);

UserSvc.$inject = ['$http'];

function UserSvc($http) {
  return {
    getProfile: function getProfile() {
      return $http.get('/api/me');
    },
    friendProfile: function friendProfile(friendId) {
      // console.log(friendId, 'Friend')
      return $http.post('/api/friend', { params: { fid: friendId } });
    },
    add_new: function add_new(item) {
      var item;
      console.log(item, "Here is the new item in our service.");
      return $http.post('/api/me/items', item);
    },
    delete_item: function delete_item(item, $index) {
      console.log(item, "Item Id for deletion.");
      return $http.put('/api/me/items/delete', item);
    },
    save_changes: function save_changes(item) {
      var item;
      console.log(item, "Item for editting.");
      return $http.put('/api/me/items/edit', item);
    },
    starPerson: function starPerson(user) {
      console.log('starring this user', user);
      return $http.put('/api/me/star', user);
    },
    saveOrder: function saveOrder(newOrder) {
      console.log('new order in service', newOrder);
      return $http.put('/api/me/items/order', newOrder);
    },
    likeItem: function likeItem(item) {
      return $http.put('/api/items/liked', item);
    },
    showFavoritesData: function showFavoritesData() {
      return $http.get('/api/favorites/data');
    },
    followPerson: function followPerson(user) {
      // console.log('user in service', user)
      return $http.put('/api/me/following', user);
    },
    makePrivate: function makePrivate(loggedInUser) {
      console.log(loggedInUser, 'user');
      return $http.put('/api/me/makePrivate');
    }
  };
};
'use strict';

angular.module('App').controller('FriendlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', 'getUser', FriendlistCtrl]);

function FriendlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams, getUser) {

  var favoritesIdArr = getUser.data.favorites;
  var followingFriendIdArr = getUser.data.following;
  $rootScope.display_name = getUser.data.displayName;
  var friendId = $stateParams.fid;

  var likedItemsArr = getUser.data.liked;
  console.log(likedItemsArr, 'THIS IS THE LIKED ITEMS BEFORE WITHIN FRIEND PROFILE.*****');

  UserSvc.friendProfile(friendId).then(function (response) {
    console.log(response.data, "Response from GetFriend Profile service call.");
    $scope.user = response.data.user;
    $scope.id = response.data.user._id;
    $scope.birthday = response.data.user.birthday;
    $scope.display_name = response.data.user.displayName;
    $scope.email = response.data.user.email;
    $scope.pro_pic = response.data.user.facebook;
    $scope.items = response.data.items;
    $scope.friendsLengthh = response.data.user.friends.length;
    $scope.allFriendFriends = response.data.user.friends;
    $scope.following = response.data.user.following.length;
    $scope.followers = response.data.user.followers.length;

    var friendItems = response.data.user.items;
    console.log('******All of the friends items.');
    var allTheLikedItemsArr = [];
    for (var i = 0; i < friendItems.length; i++) {
      var each_likeable_item = friendItems[i];
      if (likedItemsArr.indexOf(each_likeable_item) > -1) {
        allTheLikedItemsArr.push(i);
        $scope.like_heart = allTheLikedItemsArr;
      }
    }

    var friendFavId = response.data.user._id;
    if (favoritesIdArr.indexOf(friendFavId) > -1) {
      $rootScope.yellowStar = 'star_btn';
    }

    if (followingFriendIdArr.indexOf($scope.id) > -1) {
      console.log('you are following this person');
      $rootScope.follow = true;
    } else {
      console.log('you are not following this person');
      $rootScope.follow = false;
    }

    var friendFriendArray = [];
    for (var i = 0; i < response.data.user.friends.length; i++) {
      var friendFriendName = response.data.user.friends[i].name;
      friendFriendArray.push(friendFriendName);
    }

    $scope.friends = friendFriendArray;
    $scope.friendsLength = friendFriendArray.length;
  }).catch(function (err) {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });

  $scope.like_item = function (item, $index) {
    console.log($scope.like_heart, '<----------- value of $rootScope.like_heart outside if statement.');

    if ($scope.like_heart != undefined && $scope.like_heart.indexOf($index) > -1) {
      console.log('------------------------> SCENARIO #1 - UNLIKING');
      var theIndex = $index;
      var parsed = parseInt($index);
      var arrayToRemoveFrom = $scope.like_heart;
      console.log(arrayToRemoveFrom, 'BEFORE DELETING.');
      // console.log(arrayToRemoveFrom.length, 'LENGTH BEFORE');
      arrayToRemoveFrom.splice(arrayToRemoveFrom.indexOf(parsed), 1);
      console.log(arrayToRemoveFrom, 'AFTER DELETING.');
      // console.log(arrayToRemoveFrom.length, 'LENGTH AFTER');
    } else if ($scope.like_heart == undefined) {
        console.log('------------------------> SCENARIO #2 - LIKING (WHEN ITS THE FIRST LIKE.)');
        $scope.like_heart = [];
        $scope.like_heart.push($index);
        console.log('after pushing index into like_heart', $scope.like_heart);
      } else if ($scope.like_heart != undefined) {
        console.log('------------------------> SCENARIO #3 - LIKING (WHEN ALREADY SOME LIKED.)');
        $scope.like_heart.push($index);
        console.log('after pushing index into like_heart', $scope.like_heart);
      }

    UserSvc.likeItem(item).then(function (res) {
      console.log('response from item being liked', res);
    }).catch(function (err) {
      console.log('error from item being liked', err);
    });
  };

  $scope.star = function (user) {
    if ($rootScope.yellowStar === undefined) {
      $rootScope.yellowStar = 'star_btn';
    } else {
      $rootScope.yellowStar = undefined;
    }
    // console.log('this is the user you are favoriting', user)
    UserSvc.starPerson(user);
  };

  $scope.followUser = function (user) {
    console.log('user', user._id);
    var tmpFriendId = user._id;
    if (followingFriendIdArr.indexOf(tmpFriendId) > -1) {
      followingFriendIdArr.pop(tmpFriendId);
      $scope.unfollow = false;
    } else {
      followingFriendIdArr.push(tmpFriendId);
      console.log('you are following this person');
      // need to fix this;
      window.location.reload();
      // $scope.unfollow = true;
      // $scope.follow = false;
    }
    console.log(followingFriendIdArr);
    UserSvc.followPerson(user);
  };

  $scope.unfollowBtnShow = function () {
    console.log('should show RED unfollow button & hide following button');
    $rootScope.follow = false;
    $rootScope.unfollow = true;
  };

  $scope.followBtnShow = function () {
    console.log('should show follow button only');
    $rootScope.follow = true;
    $rootScope.unfollow = false;
  };

  // need to pass in params so can make api call to backend for individual friend data;
  $scope.goToFollowing = function () {
    $state.go('following');
  };

  $scope.goToFollowers = function () {
    $state.go('followers');
  };
}
'use strict';

angular.module('App').controller('faqCtrl', ['$rootScope', '$scope', 'getUser', faqCtrl]);

function faqCtrl($rootScope, $scope, getUser) {
  $rootScope.display_name = getUser.data.displayName;

  $scope.faqs = [{ question: "1. Why arent my links working?",
    answer: "Make sure you have the http(s):/ /www; The best way to accomplish copying the links is by copying the url & simply plasting it in the input box." }, { question: "2. 2nd",
    answer: "2nd" }, { question: "3. 3rd",
    answer: "3rd" }];

  $scope.getAnswer = function () {
    $scope.showAnswer ? $scope.showAnswer = false : $scope.showAnswer = true;
  };
}

'use strict';

angular.module('App').controller('HomeCtrl', ['$scope', '$state', '$auth', '$http', 'UserSvc', '$rootScope', HomeCtrl]);

function HomeCtrl($scope, $state, $auth, $http, UserSvc, $rootScope) {

  $rootScope.loggedIn = localStorage.getItem("satellizer_token");

  if (localStorage.getItem("satellizer_token")) {
    UserSvc.getProfile().then(function (response) {
      $rootScope.display_name = response.data.displayName;
    });
  }

  $scope.authenticate = function (provider, user) {
    //$auth returns a promise. We'll wanna use that, so we have a '.then'. (This is what produces the 'token' object we see in console).
    //Satellizer stores this token for us automatically. (It's in local storage!) It is sent via the request.get in 'auth.js' route.
    // $rootScope.notLoggedIn = true;
    $auth.authenticate(provider, user).then(function (res) {
      UserSvc.getProfile()
      // this has to be done before state.go because facebook_email is needed but
      // after auth.authenticate because you are pressing the login with facebook button
      .then(function (response) {
        var facebookId = response.data.facebook;
        // var facebook_name = response.data.displayName;
        // var facebook_email = response.data.email;
        // console.log('THIS IS THE UNIQUE FACEBOOK ID',facebookId)
        $state.go('my-wishlist', { id: facebookId });
      }).catch(function (err) {
        console.error(err, 'Inside UserSvc After Auth.authenticate, we have an error!');
      });
    }).catch(function (err) {
      console.error('Inside the Home Ctrl, we have an error!', err);
    });
  };

  // $rootScope.display_name = getUser.data.displayName;
}
'use strict';

angular.module('App').controller('WishlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', WishlistCtrl]);

function WishlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams) {
  // console.log('THESE ARE THE STATEPARMS', $stateParams.id)

  $scope.id = $stateParams.id;
  $rootScope.fbook = $stateParams.facebook;
  $scope.settings = false;
  $scope.followersPage = false;
  $scope.followingPage = false;
  $scope.like_heart = false;
  $scope.favoriteWishlist = false;
  // $scope.notFollowing = true;

  // console.log('is this the id in the url', $scope.id)

  if (!$auth.isAuthenticated()) {
    return $state.go('home');
  }

  UserSvc.getProfile().then(function (response) {
    $rootScope.user = response.data;
    $rootScope.id = response.data._id;
    $rootScope.birthday = response.data.birthday;
    $rootScope.display_name = response.data.displayName;
    $rootScope.email = response.data.email;
    $rootScope.pro_pic = response.data.facebook;
    $rootScope.items = response.data.items;
    $rootScope.friends = response.data.friends[0].name;
    $rootScope.friendsLength = response.data.friends.length;
    $rootScope.favorites = response.data.favorites;
    $scope.followersCount = response.data.followers.length;
    $scope.followingCount = response.data.following.length;
    $scope.privacy = response.data.private;
    console.log($scope.privacy, '<--------------- CURRENT PRIVATE SETTING.');

    $rootScope.followersModel = [];
    $rootScope.followingModel = [];

    $scope.followingArr = response.data.following;
    for (var i = 0; i < $scope.followingCount; i++) {
      $rootScope.followingModel[i] = {
        "name": response.data.friends[i].name,
        "id": response.data.friends[i].id
      };
    }

    $scope.followersArr = response.data.following;
    for (var i = 0; i < $scope.followersCount; i++) {
      $rootScope.followersModel[i] = {
        "name": response.data.friends[i].name,
        "id": response.data.friends[i].id
      };
    }
  }).catch(function (err) {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });

  $scope.add = function (item, user) {
    $scope.name = item.name;
    $scope.link = item.link;
    var userId = $scope.user._id;
    $scope.item.user = userId;

    UserSvc.add_new(item).then(function () {
      $scope.items.push({
        name: $scope.name,
        link: $scope.link,
        user: userId
      });
      $scope.item.name = '';
      $scope.item.link = '';
    }).catch(function (err) {
      console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
    });
    swal({
      title: "Good job!",
      text: "You added the item!",
      type: "success",
      timer: 2000
    });
    // shouldn't need this if done right;
    window.location.reload(true);
  };

  $scope.like_item = function (item) {
    UserSvc.likeItem(item);
  };

  $scope.edit = function (item) {
    $scope.item = {};
    $scope.item.link = item.link;
    $scope.item.name = item.name;
    $scope.editItemId = item._id;
  };

  $scope.save_changes = function (item, editItemId) {
    $scope.item.name = item.name;
    $scope.item.link = item.link;
    $scope.item.id = editItemId;
    UserSvc.save_changes(item).then(function () {
      // shouldn't need this if done right;
      window.location.reload(true);
    }).catch(function () {
      console.error('saving method doesnt work');
    });
  };

  $scope.delete = function (item, $index) {
    $scope.items.splice($index, 1);
    UserSvc.delete_item(item, $index);
  };

  $scope.star = function (user) {
    // console.log('this is the user you are favoriting', user)
    UserSvc.starPerson(user);
  };

  $scope.goToSettings = function () {
    $scope.settings = true;
    $scope.followersPage = false;
    $scope.followingPage = false;
    // $scope.public = true;
    // $scope.private = false;

    $scope.makePrivate = function () {
      console.log('making Private');
      var loggedInUser = $rootScope.user;
      console.log(loggedInUser, 'loggedInUser');
      UserSvc.makePrivate(loggedInUser);

      $scope.private = true;
      $scope.public = false;
    };

    $scope.makePublic = function () {
      console.log('making Public');
      $scope.private = false;
      $scope.public = true;
    };
  };

  $scope.backToWlist = function () {
    $scope.settings = false;
    $scope.followersPage = false;
    $scope.followingPage = false;
  };

  $scope.sort_list = function () {
    var newOrder = $scope.items;
    console.log('updated order array', newOrder);
    UserSvc.saveOrder(newOrder);
  };

  $scope.sortableOptions = {
    update: function update(e, ui) {
      $scope.sort_list();
    },
    axis: 'y'
  };

  $scope.goToFollowing = function () {
    $scope.followingPage = true;
    $scope.followersPage = false;
    $scope.settings = false;
    // $state.go('following')
  };

  $scope.goToFollowers = function () {
    $scope.followersPage = true;
    $scope.followingPage = false;
    $scope.settings = false;
    // $state.go('followers')
  };

  $scope.goToOthers = function (favorite) {
    UserSvc.getProfile().then(function (response) {
      var myId = response.data.facebook;
      // var fid = favorite.id;
      // console.log('MyId TRYING TO CHANGE PAGE', myId)
      $state.go('friend-wishlist', { id: myId, fid: favorite.id });
    });
  };
}
'use strict';

angular.module('App').controller('NavbarCtrl', ['$scope', '$state', 'NavSvc', '$auth', 'UserSvc', '$rootScope', NavbarCtrl]);

function NavbarCtrl($scope, $state, NavSvc, $auth, UserSvc, $rootScope) {

  $scope.isAuthenticated = function () {
    return $auth.isAuthenticated();
  };
  $scope.logout = function () {
    $rootScope.loggedIn = undefined;
    $auth.logout();
    $state.go('home');
  };

  $scope.goToWishList = function () {
    UserSvc.getProfile().then(function (response) {
      var facebookId = response.data.facebook;
      // var facebook_name = response.data.displayName;
      // var facebook_email = response.data.email;
      console.log('THIS IS THE UNIQUE FACEBOOK ID', facebookId);
      $state.go('my-wishlist', { id: facebookId });
    });
  };

  $scope.goToOthers = function (user) {
    UserSvc.getProfile().then(function (response) {
      var myId = response.data.facebook;
      console.log('MyId TRYING TO CHANGE PAGE', myId);
      $state.go('friend-wishlist', { id: myId, fid: user.id });
    });
  };

  // ui-sref="my-wishlist({id: {{user.id}}})"

  $scope.searchFriends = function () {
    var length = $rootScope.friendsLength;
    $rootScope.userModel = [];
    UserSvc.getProfile().then(function (res) {
      console.log('@#%#$@!$#%@#!#!$', res);
      // works because both arrays have same length;
      for (var i = 0; i < length; i++) {
        $rootScope.userModel[i] = {
          "name": res.data.friends[i].name,
          "id": res.data.friends[i].id
        };
      }
    });
  };

  $scope.focused = function () {
    $scope.friendsContainer = true;
    $scope.searchFriends();
  };

  $scope.blurred = function () {
    $scope.friendsContainer = false;
  };
}
'use strict';

angular.module('App').controller('StarredCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', 'StarSvc', '$stateParams', 'getUser', '$rootScope', StarredCtrl]);

function StarredCtrl($scope, $state, $auth, $http, $window, UserSvc, StarSvc, $stateParams, getUser, $rootScope) {

  if (!$auth.isAuthenticated()) {
    return $state.go('home');
  }

  // $scope.favorites = getUser.data.favorites;
  // var favoritesIdsArray = $scope.favorites;

  UserSvc.showFavoritesData().then(function (response) {
    var favsLength = response.data.user.favorites.length;
    var favObj = response.data.favoritesData;
    // console.log(favObj)
    $scope.favsModel = [];
    for (var i = 0; i < favsLength; i++) {
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
  }).catch(function (err) {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });

  $scope.goToOthers = function (favorite) {
    UserSvc.getProfile().then(function (response) {
      var myId = response.data.facebook;
      // var fid = favorite.id;
      // console.log('MyId TRYING TO CHANGE PAGE', myId)
      $state.go('friend-wishlist', { id: myId, fid: favorite.id });
    });
  };

  // var friendFriendArray = [];
  // for (var i=0; i<response.data.user.friends.length; i++) {
  //   var friendFriendName = response.data.user.friends[i].name;
  //   friendFriendArray.push(friendFriendName);
  // }

  $scope.star = function () {
    console.log('star in starred list');
  };

  $rootScope.display_name = getUser.data.displayName;
  $rootScope.email = getUser.data.email;
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

  $scope.show_user_info = function () {
    $scope.clicked_card ? $scope.clicked_card = false : $scope.clicked_card = true;
  };
}
'use strict';

angular.module('App').controller('ProfileCardCtrl', function ($scope) {
  console.log('yo');
}).directive('profile-card', function () {
  return {
    restrict: 'E',
    controller: 'ProfileCardCtrl',
    templateUrl: 'app/shared/profile-card/profile-card.html',
    link: function link(scope, el, attrs) {}
  };
});