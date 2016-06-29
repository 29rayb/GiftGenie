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
    controller: 'faqCtrl'
  }).state('home', {
    url: '/',
    templateUrl: 'app/components/home/home.html',
    controller: 'HomeCtrl'
  }).state('my-wishlist', {
    url: '/my-wishlist/:id',
    templateUrl: 'app/components/my-wishlist/my-wishlist.html',
    controller: 'WishlistCtrl'
  })
  // .state('friend-wishlist', {
  //   url: '/my-wishlist/:id/friends/:fid',
  //   templateUrl: 'app/components/friend-wishlist/friend-wishlist.html',
  //   controller: 'FriendlistCtrl',
  //   resolve: FriendlistCtrl.resolve
  // })
  .state('friend-wishlist', {
    url: '/my-wishlist/:id/friends/:fid',
    templateUrl: 'app/components/friend-wishlist/friend-wishlist.html',
    controller: 'FriendlistCtrl',
    resolve: {
      getUser: function getUser(UserSvc) {
        return UserSvc.getProfile();
      },
      getFriend: function getFriend(UserSvc, $stateParams) {
        return UserSvc.friendProfile($stateParams.fid);
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
      return $http.post('/api/friend', { params: { fid: friendId } });
    },
    showFollow: function showFollow(allFriendIds) {
      return $http.post('/api/friend/follow', { params: { friendIds: allFriendIds } });
    },
    displayFaves: function displayFaves(allFavoritedBy) {
      return $http.post('/api/me/favorited', { params: { favoritedByIds: allFavoritedBy } });
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
      return $http.put('/api/me/makePrivate');
    },
    makePublic: function makePublic(loggedInUser) {
      return $http.put('/api/me/makePublic');
    },
    checkingFriendPrivacy: function checkingFriendPrivacy(userMates) {
      // console.log('usermates in service ------> ', userMates);
      var friendsToCheck = [];
      for (var i = 0; i < userMates.length; i++) {
        var mongoId = userMates[i].id;
        friendsToCheck.push(mongoId);
      }
      return $http.post('/api/me/checkingFriendPrivacy', { friends: friendsToCheck });
    }
  };
};
'use strict';

angular.module('App').controller('faqCtrl', ['$rootScope', '$scope', faqCtrl]);

function faqCtrl($rootScope, $scope) {

  var token = 'in faq';
  localStorage.setItem('faq', token);

  if (!localStorage.getItem('satellizer_token')) {
    $rootScope.infaq = localStorage.getItem('faq');
    console.log('!@#!@#!@#!@#!@#@!3', $rootScope.infaq);
  } else {
    $rootScope.infaq = localStorage.removeItem('faq');
    console.log('$rootScope.infaq', $rootScope.infaq);
  }

  $scope.faqs = [{ question: "1. Why arent my links working?",
    answer: "Make sure you have the http(s):/ /www; The best way to accomplish copying the links is by copying the url & simply plasting it in the input box." }, { question: "2. 2nd",
    answer: "2nd" }, { question: "3. 3rd",
    answer: "3rd" }];

  $scope.getAnswer = function () {
    $scope.showAnswer ? $scope.showAnswer = false : $scope.showAnswer = true;
  };
}
'use strict';

angular.module('App').controller('FriendlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', 'getUser', 'getFriend', FriendlistCtrl]);

function FriendlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams, getUser, getFriend) {

  var favoritesIdArr = getUser.data.favorites;
  var followingFriendIdArr = getUser.data.following;
  $rootScope.display_name = getUser.data.displayName;
  var friendId = $stateParams.fid;
  $scope.followersPage = false;
  $scope.followingPage = false;

  // console.log(getFriend.data, 'GET FRIEND (all friend info) <-----------');

  $scope.items = getFriend.data.items;
  $rootScope.friendFollowers = getFriend.data.user.followers;
  // console.log($rootScope.friendFollowers, '<--------------------------------------Friend Followers');
  $rootScope.friendFollowing = getFriend.data.user.following;
  // console.log($rootScope.friendFollowing, '<--------------------------------------Friend Following');
  $rootScope.friendId = getFriend.data.user._id;
  console.log($rootScope.friendId, '<------------------ friendId');
  var likedItemsArr = getUser.data.liked;

  $scope.user = getFriend.data.user;
  $scope.id = getFriend.data.user._id;
  $scope.birthday = getFriend.data.user.birthday;
  if ($scope.birthday == undefined) {
    $scope.birthday = ' N/A ';
  }
  $scope.display_name = getFriend.data.user.displayName;
  $scope.email = getFriend.data.user.email;
  $scope.pro_pic = getFriend.data.user.facebook;
  $scope.friendsLengthh = getFriend.data.user.friends.length;
  $scope.allFriendFriends = getFriend.data.user.friends;
  $scope.following = getFriend.data.user.following.length;
  $scope.followers = getFriend.data.user.followers.length;

  var friendItems = getFriend.data.user.items;
  // console.log('******All of the friends items.');
  var allTheLikedItemsArr = [];
  for (var i = 0; i < friendItems.length; i++) {
    var each_likeable_item = friendItems[i];
    if (likedItemsArr.indexOf(each_likeable_item) > -1) {
      allTheLikedItemsArr.push(i);
      $scope.like_heart = allTheLikedItemsArr;
    }
  }

  var friendFavId = getFriend.data.user._id;
  if (favoritesIdArr.indexOf(friendFavId) > -1) {
    // console.log(')!@(#)!@(#)!(@#)!(@#)(!)@(#!@)(#!@)(#)!@(#!@)(',friendFavId)
    $rootScope.yellowStar = 'star_btn';
    $scope.favWishList = true;
  }

  if (followingFriendIdArr.indexOf($scope.id) > -1) {
    // console.log('you are following this person')
    $rootScope.follow = true;
  } else {
    // console.log('you are not following this person')
    $rootScope.follow = false;
  }

  var friendFriendArray = [];
  var friendsIdArr = [];
  for (var i = 0; i < getFriend.data.user.friends.length; i++) {
    var friendFriendName = getFriend.data.user.friends[i].name;
    var friendId = getFriend.data.user.friends[i].id;
    // console.log('LOOK HERERERERERE', friendFriendName)
    friendFriendArray.push(friendFriendName);
    friendsIdArr.push(friendId);
  }

  $scope.friends = friendFriendArray;
  $scope.friendsLength = friendFriendArray.length;

  /* ________________
  |                  |
  |  Favorited By:   |
  |__________________| */
  $rootScope.friendFavoritedByArr = getFriend.data.user.favoritedBy;
  $rootScope.favoritedByLength = getFriend.data.user.favoritedBy.length;

  var allFriendFavoritedBy = $rootScope.friendFavoritedByArr;

  UserSvc.displayFaves(allFriendFavoritedBy).then(function (response) {
    var allFriendFavoritedBy = response.data;
    $rootScope.favoritedByModel = [];

    for (var i = 0; i < allFriendFavoritedBy.length; i++) {
      var eachFriendFavoritedBy = allFriendFavoritedBy[i];
      var name = eachFriendFavoritedBy.displayName;
      var fbookId = eachFriendFavoritedBy.facebook;

      $rootScope.favoritedByModel[i] = {
        "name": name,
        "fbookId": fbookId
      };
    }
    console.log($rootScope.favoritedByModel, '<---Favorited By response.');
  }).catch(function (err) {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });

  // this is the fbook id
  // console.log('WHAT I WANT', friendsIdArr)

  $scope.favoritedBy = getFriend.data.user.favoritedBy;
  $scope.favoritedByLength = getFriend.data.user.favoritedBy.length;

  // console.log('all rachels friends', friendFriendArray)

  for (var i = 0; i < $scope.favoritedByLength; i++) {
    // console.log('should console once')
    // console.log('all the people that favorited rachels wishlist', $scope.favoritedBy)
    // $scope.eachFavoritedBy = $scope.favoritedBy.split(',')
    $scope.favoritedBy.map(function (eachFavoritedById) {
      // console.log('WHAT I NEED',eachFavoritedById)
      if (friendsIdArr.indexOf(eachFavoritedById) > -1) {
        // console.log('WHAT I NEED', eachFavoritedById)
      }
    });
    // if (friendFriendArray.indexOf($scope.favoritedBy) > -1 ){
    //   console.log('!@#!@#21', $scope.favoritedBy)
    // }
  }

  $scope.like_item = function (item, $index) {
    // console.log('heart clicked')
    // $scope.clicked ? $scope.clicked = false : $scope.clicked = true;
    // console.log($scope.like_heart, '<----------- value of $rootScope.like_heart outside if statement.');

    if ($scope.like_heart != undefined && $scope.like_heart.indexOf($index) > -1) {
      // console.log('------------------------> SCENARIO #1 - UNLIKING');
      var theIndex = $index;
      var parsed = parseInt($index);
      var arrayToRemoveFrom = $scope.like_heart;
      // console.log(arrayToRemoveFrom, 'BEFORE DELETING.');
      // console.log(arrayToRemoveFrom.length, 'LENGTH BEFORE');
      arrayToRemoveFrom.splice(arrayToRemoveFrom.indexOf(parsed), 1);
      // console.log(arrayToRemoveFrom, 'AFTER DELETING.');
      // console.log(arrayToRemoveFrom.length, 'LENGTH AFTER');
    } else if ($scope.like_heart == undefined) {
      // console.log('------------------------> SCENARIO #2 - LIKING (WHEN ITS THE FIRST LIKE.)');
      $scope.like_heart = [];
      $scope.like_heart.push($index);
      // console.log('after pushing index into like_heart',$scope.like_heart)
    } else if ($scope.like_heart != undefined) {
      // console.log('------------------------> SCENARIO #3 - LIKING (WHEN ALREADY SOME LIKED.)');
      $scope.like_heart.push($index);
      // console.log('after pushing index into like_heart',$scope.like_heart)
    }

    UserSvc.likeItem(item).then(function (res) {
      // console.log('response from item being liked', res);
    }).catch(function (err) {
      // console.log('error from item being liked', err)
    });
  };

  $scope.star = function (user) {
    // console.log('trying to fav user')
    // console.log('RRIGHE HWERUOIWJOIDJFODSFNGOJEMRGNKWEJNGURIDOSKPFIGHUDJOKPINUDOMSPKFGJIHUJO')
    $scope.favWishList ? $scope.favWishList = false : $scope.favWishList = 'is_favoriting';
    // $scope.favWishList = 'is_favoriting'
    // $scope.clicked ? $scope.clicked = false : $scope.clicked = true;

    if ($rootScope.yellowStar === undefined) {
      $rootScope.yellowStar = 'star_btn';
    } else {
      $rootScope.yellowStar = undefined;
    }
    // console.log('this is the user you are favoriting', user)
    UserSvc.starPerson(user);
  };

  $scope.followUser = function (user) {
    // console.log('user', user._id)
    var tmpFriendId = user._id;
    if (followingFriendIdArr.indexOf(tmpFriendId) > -1) {
      followingFriendIdArr.pop(tmpFriendId);
      $scope.unfollow = false;
    } else {
      followingFriendIdArr.push(tmpFriendId);
      // console.log('you are following this person')
      // need to fix this;
      window.location.reload();
      // $scope.unfollow = true;
      // $scope.follow = false;
    }
    // console.log(followingFriendIdArr)
    UserSvc.followPerson(user);
  };

  $scope.unfollowBtnShow = function () {
    // console.log('should show RED unfollow button & hide following button')
    $rootScope.follow = false;
    $rootScope.unfollow = true;
  };

  $scope.followBtnShow = function () {
    // console.log('should show follow button only')
    $rootScope.follow = true;
    $rootScope.unfollow = false;
  };

  /* ________________
  |                  |
  |  View followers: |
  |__________________| */

  $scope.goToFollowers = function () {
    $scope.followersPage = true;
    $scope.followingPage = false;
    // console.log('followers button clicked')
    // $rootScope.followersPage = true;
    // $rootScope.followingPage = false;
    var allFollowers = $rootScope.friendFollowers;

    UserSvc.showFollow(allFollowers).then(function (response) {
      var theFollowers = response.data;
      $rootScope.followersModel = [];

      for (var i = 0; i < theFollowers.length; i++) {
        var eachFollower = theFollowers[i];
        var name = eachFollower.displayName;
        var id = eachFollower.facebook;

        $rootScope.followersModel[i] = {
          "name": name,
          "id": id
        };
      }
      // console.log($rootScope.followersModel, 'Data <----------');
    });
  };

  /* ________________
  |                  |
  |  View following: |
  |__________________| */

  $scope.goToFollowing = function () {
    $scope.followingPage = true;
    $scope.followersPage = false;
    // console.log('following button clicked')
    // $rootScope.followersPage = true;
    // $rootScope.followingPage = false;

    var allFollowing = $rootScope.friendFollowing;

    UserSvc.showFollow(allFollowing).then(function (response) {
      var theFollowing = response.data;
      $rootScope.followingModel = [];

      for (var i = 0; i < theFollowing.length; i++) {
        var eachFollowing = theFollowing[i];
        var name = eachFollowing.displayName;
        var id = eachFollowing.facebook;

        $rootScope.followingModel[i] = {
          "name": name,
          "id": id
        };
      }
      // console.log($rootScope.followingModel, 'Data <----------');
    });
  };
}

'use strict';

angular.module('App').controller('HomeCtrl', ['$scope', '$state', '$auth', '$http', 'UserSvc', '$rootScope', HomeCtrl]);

function HomeCtrl($scope, $state, $auth, $http, UserSvc, $rootScope) {

  $rootScope.loggedIn = localStorage.getItem("satellizer_token");

  if (localStorage.getItem("satellizer_token")) {
    UserSvc.getProfile().then(function (response) {
      $rootScope.display_name = response.data.displayName;
      $rootScope.favoritesLength = response.data.favorites.length;
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
    $rootScope.favoritedByLength = response.data.favoritedBy.length;

    var allFavoritedBy = $rootScope.favoritedByArr;
    UserSvc.displayFaves(allFavoritedBy).then(function (response) {
      console.log('RIGHT HURRR', response.data);
      var allFavoritedBy = response.data;
      $rootScope.favoritedByModel = [];

      for (var i = 0; i < allFavoritedBy.length; i++) {
        var eachFavoritedBy = allFavoritedBy[i];
        var name = eachFavoritedBy.displayName;
        var fbookId = eachFavoritedBy.facebook;

        $rootScope.favoritedByModel[i] = {
          "name": name,
          "fbookId": fbookId
        };
      }
    });
  }).catch(function (err) {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });

  /* ________________
  |                  |
  |  View following: |
  |__________________| */

  $scope.goToFollowing = function () {
    $rootScope.followingPage = true;
    $rootScope.followersPage = false;
    $rootScope.settings = false;
    $rootScope.starred = false;

    var allFollowing = $rootScope.followingArr;

    UserSvc.showFollow(allFollowing).then(function (response) {
      var theFollowing = response.data;
      $rootScope.followingModel = [];

      for (var i = 0; i < theFollowing.length; i++) {
        var eachFollowing = theFollowing[i];
        var name = eachFollowing.displayName;
        var id = eachFollowing.facebook;

        $rootScope.followingModel[i] = {
          "name": name,
          "id": id
        };
      }
    });
  };

  /* ________________
  |                  |
  |  View followers: |
  |__________________| */

  $scope.goToFollowers = function () {
    $rootScope.followersPage = true;
    $rootScope.followingPage = false;
    $rootScope.settings = false;
    $rootScope.starred = false;

    var allFollowers = $rootScope.followersArr;

    UserSvc.showFollow(allFollowers).then(function (response) {
      var theFollowers = response.data;
      $rootScope.followersModel = [];

      for (var i = 0; i < theFollowers.length; i++) {
        var eachFollower = theFollowers[i];
        var name = eachFollower.displayName;
        var id = eachFollower.facebook;

        $rootScope.followersModel[i] = {
          "name": name,
          "id": id
        };
      }
    });
  };

  /* ______________
  |              |
  |  Add Item:   |
  |______________| */

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

  /* ______________
  |              |
  |  Like Item:  |
  |______________| */
  $scope.like_item = function (item) {
    UserSvc.likeItem(item);
  };

  /* ______________
  |              |
  |  Edit Item:  |
  |______________| */
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
      window.location.reload(true);
    }).catch(function () {
      console.error('saving method doesnt work');
    });
  };

  /* ______________
  |              |
  |  Delete Item:|
  |______________| */
  $scope.delete = function (item, $index) {
    $scope.items.splice($index, 1);
    UserSvc.delete_item(item, $index);
  };

  /* ______________
  |                |
  |  Star Wishlist:|
  |________________| */
  $scope.star = function (user) {

    UserSvc.starPerson(user);
  };

  /* ______________
  |              |
  |  Settings:   |
  |______________| */
  $scope.goToSettings = function () {
    console.log('Inside Settings.');
    $rootScope.settings = true;
    $rootScope.followersPage = false;
    $rootScope.followingPage = false;
    $rootScope.starred = false;

    $scope.makePrivate = function () {
      console.log('making Private');
      var loggedInUser = $rootScope.user;
      UserSvc.makePrivate(loggedInUser).then(function () {
        console.log('User now private.');
      }).catch(function () {
        console.error('Making private method has an error.');
      });
      $scope.private = true;
      $scope.public = false;
    };

    $scope.makePublic = function () {
      console.log('making Public');
      var loggedInUser = $rootScope.user;
      UserSvc.makePublic(loggedInUser);
      $scope.private = false;
      $scope.public = true;
    };
  };

  /* ________________
  |                  |
  |  Re-order Items: |
  |__________________| */
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

  /* ________________
  |                  |
  |  View starred:   |
  |__________________| */
  $scope.goToStarred = function () {
    $rootScope.starred = true;
    $rootScope.followersPage = false;
    $rootScope.followingPage = false;
    $rootScope.settings = false;
  };

  /* ______________________
  |                        |
  |  View friend wishlist: |
  |________________________| */
  $scope.goToOthers = function (otherUser) {
    console.log('Going to a users page yo --> They are:', otherUser);
    UserSvc.getProfile().then(function (response) {
      var myId = response.data.facebook;
      var fid = otherUser.id;
      $state.go('friend-wishlist', { id: myId, fid: otherUser.id });
    });
  };

  /* __________________
  |                    |
  |  Display favorites |
  |____________________| */
  UserSvc.showFavoritesData().then(function (response) {
    var favsLength = response.data.user.favorites.length;
    var favObj = response.data.favoritesData;
    $scope.favsModel = [];
    for (var i = 0; i < favsLength; i++) {
      $scope.favsModel[i] = {
        "name": favObj[i].displayName,
        "id": favObj[i].facebook
      };
    }
    // console.log('this is how many ppl you have starred', $scope.favsModel.length);
    $rootScope.starredLength = $scope.favsModel.length;
  }).catch(function (err) {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });
}
'use strict';

angular.module('App').controller('NavbarCtrl', ['$scope', '$state', '$auth', 'UserSvc', '$rootScope', NavbarCtrl]);

function NavbarCtrl($scope, $state, $auth, UserSvc, $rootScope) {

  if (!localStorage.getItem('satellizer_token')) {
    $rootScope.infaq = localStorage.getItem('faq');
    // console.log('!@#!@#!@#!@#!@#@!3', $rootScope.infaq)
  } else {
    $rootScope.infaq = localStorage.removeItem('faq');
    // console.log('$rootScope.infaq', $rootScope.infaq)
  }

  $scope.isAuthenticated = function () {
    return $auth.isAuthenticated();
  };
  $scope.logout = function () {
    $rootScope.loggedIn = undefined;
    $auth.logout();
    $state.go('home');
  };

  $scope.backToHome = function () {
    // $scope.infaqqqq = false;
    // localStorage.setItem('faq', undefined)
    localStorage.removeItem('faq');
    // localStorage.setItem('faq', undefined)
    // $scope.infaq = undefined;
    $rootScope.infaq = null;
    console.log('!@#!@#!@#!@#!@#!@#@!#!@#!@#', $rootScope.infaq);
  };

  $scope.goToWishList = function () {
    $rootScope.settings = false;
    $rootScope.starred = false;
    $rootScope.followersPage = false;
    $rootScope.followingPage = false;
    UserSvc.getProfile().then(function (response) {
      var facebookId = response.data.facebook;
      // var facebook_name = response.data.displayName;
      // var facebook_email = response.data.email;
      console.log('THIS IS THE UNIQUE FACEBOOK ID', facebookId);
      $state.go('my-wishlist', { id: facebookId });
    });
  };

  $scope.goToStarred = function () {
    $scope.goToWishList();
    UserSvc.getProfile().then(function (response) {
      var facebookId = response.data.facebook;
      $rootScope.settings = false;
      $rootScope.starred = true;
      $rootScope.followersPage = false;
      $rootScope.followingPage = false;
      $state.go('my-wishlist', { id: facebookId });
    });
  };

  $scope.goToOthers = function (user) {
    console.log('CLICKING ON LI ELEMENT');
    UserSvc.getProfile().then(function (response) {
      var myId = response.data.facebook;
      console.log('MyId TRYING TO CHANGE PAGE', myId);
      $scope.friendsContainer = false;
      $state.go('friend-wishlist', { id: myId, fid: user.id });
    });
  };

  // ui-sref="my-wishlist({id: {{user.id}}})"

  $scope.searchFriends = function () {
    UserSvc.getProfile().then(function (response) {
      // console.log(response, 'response ');
      var alternative = response.data.friends;
      $rootScope.alternate = alternative;
      var userMates = $rootScope.alternate || $rootScope.user.friends;

      UserSvc.checkingFriendPrivacy(userMates).then(function (response) {
        // console.log(response, 'RESPONSE FROM PRIVACY SETTINGS CHECK!!!!!!!!!!!!!');
        var res = response.data.publicFriends;
        var length = res.length;
        // console.log(length, 'length');

        $rootScope.userModel = [];

        for (var i = 0; i < length; i++) {
          $rootScope.userModel[i] = {
            "name": res[i].displayName,
            "id": res[i].facebook
          };
        }
        // console.log($rootScope.userModel, 'HERE!!!!!!!!');
      });
    });
  };

  $scope.focused = function () {
    $scope.friendsContainer = true;
    $scope.searchFriends();
  };

  // $scope.blurred = () => {
  //   console.log('outside friends container')
  //   $scope.friendsContainer = false;
  // }

  $scope.hoverIn = function () {
    $scope.friendsContainer = true;
  };

  $scope.hoverOut = function () {
    $scope.friendsContainer = false;
  };

  $scope.authenticate = function (provider, user) {
    //$auth returns a promise. We'll wanna use that, so we have a '.then'. (This is what produces the 'token' object we see in console).
    //Satellizer stores this token for us automatically. (It's in local storage!) It is sent via the request.get in 'auth.js' route.
    localStorage.removeItem('faq');
    $rootScope.notLoggedIn = true;
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
}