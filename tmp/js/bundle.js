'use strict';

angular.module('App', ['ui.router', 'satellizer', 'app.routes', 'ui.sortable']);
'use strict';

angular.module('app.routes', []).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$authProvider', AppRoutes]);

function AppRoutes($stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {
  // $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');
  // $urlRouterProvider.otherwise(function($injector, $location){
  //   // to work on mobile, make sure cookies are NOT blocked;
  //   var state = $injector.get('$state');
  //   var path = $location.url();
  //   if (state.current.abstract){
  //     if (path.indexOf('access_token') == -1){
  //       state.go('login');
  //     }
  //   }
  // })
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
    controller: 'WishlistCtrl',
    resolve: {
      getUser: function getUser(UserSvc) {
        return UserSvc.getProfile();
      }
    }
  }).state('friend-wishlist', {
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
    requiredUrlParams: ['scope', 'display'],
    scope: ['user_friends', 'email', 'user_birthday']
  });
}
'use strict';

angular.module('App').controller('HomeCtrl', HomeCtrl);

HomeCtrl.$inject = ['$scope', '$rootScope', '$state', '$auth', '$http', 'UserSvc'];

function HomeCtrl($scope, $rootScope, $state, $auth, $http, UserSvc) {

  $rootScope.loggedIn = localStorage.getItem("satellizer_token");

  $scope.authenticate = function (provider, user) {
    $auth.authenticate(provider, user).then(function (res) {
      // console.log(res)
      $rootScope.allMyFriends = res.data.user;
      // console.log($rootScope.allMyFriends)
      // is it a problem that when facebook login button clicked, he/she
      // doesn't have the id in the url?
      $state.go('my-wishlist', { id: $rootScope.pro_pic });
    }).catch(function (err) {
      console.error('ERROR with Facebook Satellizer Auth', err);
    });
  };
}
'use strict';

angular.module('App').controller('NavbarCtrl', NavbarCtrl);

NavbarCtrl.$inject = ['$scope', '$state', '$auth', '$rootScope', 'UserSvc'];

function NavbarCtrl($scope, $state, $auth, $rootScope, UserSvc) {

  // need this for instances of refreshing
  if (localStorage.getItem('satellizer_token')) {
    // console.log('if refreshed')
    UserSvc.getProfile().then(function (res) {
      $rootScope.allMyFriends = res.data.friends;
      $rootScope.display_name = res.data.displayName;
      $rootScope.infaq = localStorage.removeItem('faq');
      // console.log($rootScope.allMyFriends)
    });
  } else {
    $rootScope.infaq = localStorage.getItem('faq');
  }

  // if (!localStorage.getItem('satellizer_token')){
  //   $rootScope.infaq = localStorage.getItem('faq')
  // } else {
  //   $rootScope.infaq = localStorage.removeItem('faq')
  // }

  $rootScope.settings = false;
  $rootScope.starred = false;
  $rootScope.followersPage = false;
  $rootScope.followingPage = false;

  $scope.isAuthenticated = function () {
    return $auth.isAuthenticated();
  };

  $scope.logout = function () {
    $rootScope.loggedIn = undefined;
    $scope.friendsContainer = false;
    $auth.logout();
    $scope.backToHome();
    $state.go('home');
  };

  $scope.backToHome = function () {
    localStorage.removeItem('faq');
    $rootScope.infaq = null;
  };

  $scope.goToWishList = function () {
    $rootScope.settings = false;
    $rootScope.starred = false;
    $rootScope.followersPage = false;
    $rootScope.followingPage = false;
    // pro_pic is facebook id
    $state.go('my-wishlist', { id: $rootScope.pro_pic });
  };

  $scope.goToStarred = function () {
    $scope.goToWishList();
    $rootScope.starred = true;
  };

  $scope.goToOthers = function (userObj) {
    $scope.friendsContainer = false;
    // pro_pic is facebook id
    $state.go('friend-wishlist', { id: $rootScope.pro_pic, fid: userObj.id });
  };

  $scope.focused = function () {
    $scope.friendsContainer = true;
    $scope.searchFriends();
  };

  $scope.hoverIn = function () {
    $scope.friendsContainer = true;
  };

  $scope.hoverOut = function () {
    $scope.friendsContainer = false;
  };

  $scope.searchFriends = function () {
    // prevents $rootScope.user from being undefined;
    // console.log('THIS IS $ROOTSCOPE', $rootScope)
    if ($rootScope.user !== undefined) {
      $rootScope.user.friends = $rootScope.allMyFriends;
    }
    var myFriends = $rootScope.allMyFriends || $rootScope.user.friends;
    // console.log('after setting it to all my friends for friends who joined', myFriends)
    UserSvc.checkingFriendPrivacy(myFriends).then(function (response) {
      // console.log(response)
      var publicFriends = response.data.publicFriends;
      var length = publicFriends.length;

      $rootScope.userModel = [];

      for (var i = 0; i < length; i++) {
        $rootScope.userModel[i] = {
          "name": publicFriends[i].displayName,
          "id": publicFriends[i].facebook
        };
      }
    });
  };

  $scope.authenticate = function (provider, user) {
    localStorage.removeItem('faq');
    $auth.authenticate(provider, user).then(function (res) {
      // is it a problem that when facebook login button clicked, he/she
      // doesn't have the id in the url?
      $state.go('my-wishlist', { id: $rootScope.facebook });
    }).catch(function (err) {
      console.error('ERROR with Facebook Satellizer Auth', err);
    });
  };
}
'use strict';

angular.module('App').controller('WishlistCtrl', WishlistCtrl);

WishlistCtrl.$inject = ['$scope', '$state', '$auth', '$http', '$window', '$rootScope', '$stateParams', 'UserSvc', 'getUser'];

function WishlistCtrl($scope, $state, $auth, $http, $window, $rootScope, $stateParams, UserSvc, getUser) {

  // can eliminate this extra API call for my profile everytime by
  // using localstorage;
  // console.log('made an API call for my profile')

  if (!$auth.isAuthenticated()) {
    return $state.go('home');
  }

  $scope.like_heart = false;
  $scope.favoriteWishlist = false;

  $rootScope.user = getUser.data;
  $rootScope.id = getUser.data._id;
  $rootScope.birthday = getUser.data.birthday;
  if ($rootScope.birthday == undefined) {
    $rootScope.birthday = ' N/A ';
  }
  $rootScope.display_name = getUser.data.displayName;
  $rootScope.email = getUser.data.email;
  $rootScope.pro_pic = getUser.data.facebook;
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

  if (allFavoritedBy.length === $rootScope.favoritedByArrLength) {
    // console.log('NO need for an API call')
  } else {
    // should eliminate this extra api call;
    // console.log('API call to get favs')
    UserSvc.displayFaves(allFavoritedBy).then(function (res) {
      var allFavoritedBy = res.data;
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
    }).catch(function (err) {
      console.error(err, 'Error getting the favorited by array!');
    });
  }

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

    if ($rootScope.followingCount === $rootScope.currentFollowingLength) {
      // console.log('SAME! No need for API Call.')
    } else {
      UserSvc.showFollow(allFollowing).then(function (response) {
        var theFollowing = response.data;
        $rootScope.currentFollowingLength = theFollowing.length;
        // console.log(theFollowing, '<-------MADE API Call')
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
    }
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

    if ($rootScope.followersCount === $rootScope.currentFollowersLength) {
      // console.log('No need for API call')
    } else {
      UserSvc.showFollow(allFollowers).then(function (response) {
        var theFollowers = response.data;
        $rootScope.currentFollowersLength = theFollowers.length;
        // console.log(theFollowers, '<-------MADE API Call')

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
    }
  };

  /* ______________
  |              |
  |  Add Item:   |
  |______________| */

  $scope.add = function (item, user) {
    console.log('about to add items ITEM', item);
    console.log('about to add items USER', user);
    $scope.name = item.name;
    $scope.link = item.link;
    var userId = $scope.user._id;
    $scope.item.user = userId;

    UserSvc.add_new(item).then(function () {
      // console.log('made API call to add items')
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
    var first_name = user.displayName.split(' ')[0];
    swal({
      title: first_name,
      html: true,
      text: "<b>You added a WiSH!</b> <div>Let your friends know so they can surprise you</div>",
      type: "success",
      timer: 2800
    });
    // shouldn't need this if done right;
    // window.location.reload(true)
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
  $scope.edit = function (item, $index, $event) {
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
  };

  // when user exits out of edit modal without saving changes,
  // remove all inputs;
  $scope.removeInputs = function ($event) {
    console.log('out-ed without saving edits');
    $event.preventDefault();
    $scope.item = {};
  };

  $scope.save_changes = function (item, editItemId, $event) {
    console.log('saving changes');
    $scope.item.name = item.name;
    $scope.item.link = item.link;
    $scope.item.id = editItemId;
    UserSvc.save_changes(item).then(function (res) {
      var itemAfterEdit = {
        name: res.data.name,
        link: res.data.link
      };
      $scope.items.splice($rootScope.editItemIndex, 1, itemAfterEdit);
      // $scope.item.link = res.data.link
      // $scope.item.name = res.data.name
      $('#edit').modal('hide');
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
      // remove inputs after changes are saved so when user opens
      // up add item modal, it doesn't show the saved changes there;
      $scope.removeInputs($event);
    }).catch(function () {
      console.error('saving method doesnt work');
    });
  };

  /* ______________
  |              |
  |  Delete Item:|
  |______________| */
  $scope.delete = function (item, $index) {
    // console.log('Made API call to delete items')
    $scope.items.splice($index, 1);
    UserSvc.delete_item(item, $index);
  };

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
  $scope.goToSettings = function () {
    $rootScope.settings = true;
    $rootScope.followersPage = false;
    $rootScope.followingPage = false;
    $rootScope.starred = false;

    $scope.makePrivate = function () {
      var loggedInUser = $rootScope.user;
      UserSvc.makePrivate(loggedInUser).then(function () {
        console.log('making API call to make user Private');
      }).catch(function () {
        console.error('ERROR: Making user private.');
      });
      $scope.private = true;
      $scope.public = false;
    };

    $scope.makePublic = function () {
      var loggedInUser = $rootScope.user;
      UserSvc.makePublic(loggedInUser).then(function () {
        console.log('making API call to make user public');
      }).catch(function () {
        console.error('ERROR: Making user public');
      });
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
    console.log('API call to save order of items in backend');
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
    // console.log('go to others clicked', otherUser)
    var myId = getUser.data.facebook;
    var fid = otherUser.id || otherUser.fbookId;
    // code needed to remove the modal upon route change;
    $('#showFavBy').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $state.go('friend-wishlist', { id: myId, fid: fid });
  };

  /* _____________________
  |                       |
  |  Display starredLists |
  |_______________________| */

  // should put the counter in the localstorage to keep track of
  // length of the people I starred; but right now, saves extra API
  // call everytime I go to starred list;
  var counter = 0;
  if ($rootScope.favorites.length === getUser.data.favorites.length) {
    if (counter === 0) {
      console.log('1st making API call to get Starred Friends');
      // need this API call to get Data in right format;
      UserSvc.showFavoritesData().then(function (response) {
        var favsLength = response.data.favorites.length;
        var favObj = response.data.favorites;
        $scope.favsModel = [];
        for (var i = 0; i < favsLength; i++) {
          $scope.favsModel[i] = {
            "name": favObj[i].displayName,
            "id": favObj[i].facebook
          };
        }
        // console.log('this is how many ppl you have starred', $scope.favsModel.length);
        $rootScope.starredLength = $scope.favsModel.length;
        counter++;
      }).catch(function (err) {
        console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
      });
    } else {
      // console.log('no need for API call to get Starred friends')
    }
  } else {
    console.log(' 2nd making API call to get Starred Friends');
    // need this API call to get Data in right format;
    UserSvc.showFavoritesData().then(function (response) {
      var favsLength = response.data.favorites.length;
      var favObj = response.data.favorites;
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
}
'use strict';

angular.module('App').controller('faqCtrl', faqCtrl);

faqCtrl.$inject = ['$rootScope', '$scope'];

function faqCtrl($rootScope, $scope) {

  localStorage.setItem('faq', 'in faq');

  !localStorage.getItem('satellizer_token') ? $rootScope.infaq = localStorage.getItem('faq') : $rootScope.infaq = localStorage.removeItem('faq');

  $scope.faqs = [{ question: "1. Why arent my links working?",
    answer: "Make sure you have the http(s):/ /www; The best way to accomplish copying the links is by copying the url & simply plasting it in the input box." }, { question: "2. I have ideas to improve the app; How can I let you guys know?",
    answer: "Simply click the email icon on the bottom and email us!" }, { question: "3. Can I share this with my friends?",
    answer: "The app is currently in beta; please limit invites to just 5 friends" }, { question: "4. Why can't I see anyone in the searchbar?",
    answer: "Only your Facebook friends who are already using the app can be seen" }, { question: "5. I try to use the app on my iPhone using Safari, but I'm having issues",
    answer: "Go to settings --> safari --> privacy & security --> block cookies --> allow from websites I visit. Also make sure you have JavaScript enabled in the Advanced Section" }, { question: "6. It's not working on my web browser (Google Chrome, Safari, FireFox, etc.). How can I fix it?",
    answer: "Extensions like Adblock might interfere with the Login with Facebook button, preventing you from logginong onto the app" }];

  $scope.getAnswer = function () {
    $scope.showAnswer ? $scope.showAnswer = false : $scope.showAnswer = true;
  };
}
'use strict';

angular.module('App').controller('FriendlistCtrl', FriendlistCtrl);

FriendlistCtrl.$inject = ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', 'getUser', 'getFriend'];

function FriendlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams, getUser, getFriend) {

  $scope.followersPage = false;
  $scope.followingPage = false;

  /* _______________________
  |                         |
  |  Logged In User's Data: |
  |_________________________| */

  $rootScope.user = getUser.data;
  var favoritesIdArr = getUser.data.favorites;
  var followingFriendIdArr = getUser.data.following;
  var likedItemsArr = getUser.data.liked;
  $rootScope.display_name = getUser.data.displayName;

  /* _______________
  |                 |
  |  Friend's Data: |
  |_________________| */

  $scope.user = getFriend.data;
  $scope.id = getFriend.data._id;
  $scope.items = getFriend.data.items;
  $rootScope.friendFollowers = getFriend.data.followers;
  $rootScope.friendFollowing = getFriend.data.following;
  $scope.display_name = getFriend.data.displayName;
  $scope.email = getFriend.data.email;
  $scope.pro_pic = getFriend.data.facebook;
  // throws an cannot get length of undefined error;
  $scope.following = getFriend.data.following.length;
  $scope.followers = getFriend.data.followers.length;

  $scope.birthday = getFriend.data.birthday;
  if ($scope.birthday == undefined) {
    $scope.birthday = ' N/A ';
  }

  var friendFavId = getFriend.data._id;
  if (favoritesIdArr.indexOf(friendFavId) > -1) {
    $rootScope.yellowStar = 'star_btn';
    $scope.favWishList = true;
  }

  if (followingFriendIdArr.indexOf($scope.id) > -1) {
    $rootScope.follow = true;
  } else {
    $rootScope.follow = false;
  }

  var friendFriendArray = [];
  var friendsIdArr = [];
  for (var i = 0; i < getFriend.data.friends.length; i++) {
    var friendFriendName = getFriend.data.friends[i].name;
    var friendId = getFriend.data.friends[i].id;
    friendFriendArray.push(friendFriendName);
    friendsIdArr.push(friendId);
  }

  $scope.friends = friendFriendArray;
  $scope.friendsLength = friendFriendArray.length;

  /* ____________________________________________________
  |                                                      |
  |  Display if logged in user has liked friend's items: |
  |______________________________________________________| */
  var friendItems = getFriend.data.items;
  var allTheLikedItemsArr = [];
  for (var i = 0; i < friendItems.length; i++) {
    var each_likeable_item = friendItems[i]._id;
    if (likedItemsArr.indexOf(each_likeable_item) > -1) {
      allTheLikedItemsArr.push(i);
      $scope.like_heart = allTheLikedItemsArr;
    }
  }

  /* ______________
  |                |
  |  Favorited By: |
  |________________| */

  $rootScope.friendFavoritedByArr = getFriend.data.favoritedBy;
  $rootScope.favoritedByLength = getFriend.data.favoritedBy.length;

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
  }).catch(function (err) {});

  /* ___________________
  |                     |
  |  Like Friend Items: |
  |_____________________| */
  $scope.like_item = function (item, $index) {
    if ($scope.like_heart != undefined && $scope.like_heart.indexOf($index) > -1) {
      console.log('------------> SCENARIO #1 - UNLIKING');
      var theIndex = $index;
      var parsed = parseInt($index);
      var arrayToRemoveFrom = $scope.like_heart;
      arrayToRemoveFrom.splice(arrayToRemoveFrom.indexOf(parsed), 1);
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

    UserSvc.likeItem(item).then(function (res) {}).catch(function (err) {});
  };

  /* _______________________
  |                         |
  |  Star Friends Wishlist: |
  |_________________________| */

  $scope.star = function (user) {
    $scope.favWishList ? $scope.favWishList = false : $scope.favWishList = 'is_favoriting';

    if ($rootScope.yellowStar === undefined) {
      $rootScope.yellowStar = 'star_btn';
    } else {
      $rootScope.yellowStar = undefined;
    }
    UserSvc.starPerson(user);
    window.location.reload(true);
  };

  /* _______________
  |                 |
  |  Follow Friend: |
  |_________________| */

  $scope.followUser = function (user) {
    var tmpFriendId = user._id;
    if (followingFriendIdArr.indexOf(tmpFriendId) > -1) {
      followingFriendIdArr.pop(tmpFriendId);
      $scope.unfollow = false;
    } else {
      followingFriendIdArr.push(tmpFriendId);
      window.location.reload();
    }
    UserSvc.followPerson(user);
  };

  /* _________________________
  |                           |
  |  Follow/Unfollow Buttons: |
  |___________________________| */

  $scope.unfollowBtnShow = function () {
    $rootScope.follow = false;
    $rootScope.unfollow = true;
  };

  $scope.followBtnShow = function () {
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
    var allFollowers = $rootScope.friendFollowers;

    UserSvc.showFollow(allFollowers).then(function (response) {
      var theFollowers = response.data;
      $scope.followersModel = [];

      for (var i = 0; i < theFollowers.length; i++) {
        var eachFollower = theFollowers[i];
        var name = eachFollower.displayName;
        var id = eachFollower.facebook;

        $scope.followersModel[i] = {
          "name": name,
          "id": id
        };
      }
    });
  };

  /* ________________
  |                  |
  |  View following: |
  |__________________| */

  $scope.goToFollowing = function () {
    $scope.followingPage = true;
    $scope.followersPage = false;
    var allFollowing = $rootScope.friendFollowing;

    UserSvc.showFollow(allFollowing).then(function (response) {
      var theFollowing = response.data;
      $scope.followingModel = [];

      for (var i = 0; i < theFollowing.length; i++) {
        var eachFollowing = theFollowing[i];
        var name = eachFollowing.displayName;
        var id = eachFollowing.facebook;

        $scope.followingModel[i] = {
          "name": name,
          "id": id
        };
      }
    });
  };

  /* ______________________
  |                        |
  |  View friend wishlist: |
  |________________________| */
  $scope.goToOthers = function (otherUser) {
    // console.log('go to others clicked', otherUser)
    var myId = getUser.data.facebook;
    var fid = otherUser.id || otherUser.fbookId;
    // code needed to remove the modal upon route change;
    $('#showFavBy').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $state.go('friend-wishlist', { id: myId, fid: fid });
  };
}
'use strict';

angular.module('App').factory('UserSvc', UserSvc);

UserSvc.$inject = ['$http'];

function UserSvc($http) {
  return {
    getProfile: function getProfile() {
      return $http.get('/api/me');
    },
    friendProfile: function friendProfile(friendId) {
      return $http.post('/api/me/friend', { params: { fid: friendId } });
    },
    showFollow: function showFollow(allFriendIds) {
      return $http.post('/api/friend/showfriendfollows', { params: { friendIds: allFriendIds } });
    },
    displayFaves: function displayFaves(allFavoritedBy) {
      return $http.post('/api/me/favoritedby', { params: { favoritedByIds: allFavoritedBy } });
    },
    add_new: function add_new(item) {
      var item;
      // console.log(item, "Here is the new item in our service.");
      return $http.post('/api/me/items', item);
    },
    delete_item: function delete_item(item, $index) {
      console.log(item, "Item Id for deletion.");
      return $http.put('/api/me/deleteitem', item);
    },
    save_changes: function save_changes(item) {
      var item;
      console.log(item, "Item for editting.");
      return $http.put('/api/me/edititem', item);
    },
    starPerson: function starPerson(user) {
      console.log('starring this user', user);
      return $http.put('/api/me/favorite', user);
    },
    saveOrder: function saveOrder(newOrder) {
      console.log('new order in service', newOrder);
      return $http.put('/api/me/itemreorder', newOrder);
    },
    likeItem: function likeItem(item) {
      return $http.put('/api/items/liked', item);
    },
    showFavoritesData: function showFavoritesData() {
      return $http.get('/api/favoritesdata');
    },
    followPerson: function followPerson(user) {
      // console.log('user in service', user)
      return $http.put('/api/me/following', user);
    },
    makePrivate: function makePrivate(loggedInUser) {
      return $http.put('/api/me/makeprivate');
    },
    makePublic: function makePublic(loggedInUser) {
      return $http.put('/api/me/makepublic');
    },
    checkingFriendPrivacy: function checkingFriendPrivacy(userFriends) {
      // console.log('userFriends in service ------> ', userFriends);
      var friendsToCheck = [];
      for (var i = 0; i < userFriends.length; i++) {
        var mongoId = userFriends[i].id;
        friendsToCheck.push(mongoId);
      }
      return $http.post('/api/me/checkfriendprivacy', { friends: friendsToCheck });
    }
  };
};
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