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
      console.log(friendId, 'Friend');
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
      console.log('like this item', item);
      return $http.put('/api/items/liked', item);
    }
  };
};
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

angular.module('App').controller('FriendlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', 'getUser', FriendlistCtrl]);

function FriendlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams, getUser) {

  $rootScope.display_name = getUser.data.displayName;

  console.log($stateParams, 'state params');
  var friendId = $stateParams.fid;

  UserSvc.friendProfile(friendId).then(function (response) {
    console.log(response.data, "response");
    $scope.user = response.data;
    $scope.id = response.data._id;
    $scope.birthday = response.data.birthday;
    $scope.display_name = response.data.displayName;
    $scope.email = response.data.email;
    $scope.pro_pic = response.data.facebook;
    console.log('THIS IS THE PRO PIC ID', $scope.pro_pic);
    $scope.items = response.data.items;
    console.log('friends items', $scope.items);
    // $scope.pro_pic = response.data.picture
    $scope.friends = response.data.friends[0].name;

    $scope.friendsLength = response.data.friends.length;

    console.log(response.data.friends.length, 'friend length');
    console.log("This is the data from GET request.", $scope.user);
  }).catch(function (err) {
    console.error(err, 'Inside the Wishlist Ctrl, we have an error!');
  });
}

'use strict';

angular.module('App').controller('HomeCtrl', ['$scope', '$state', '$auth', '$http', 'UserSvc', HomeCtrl]);

function HomeCtrl($scope, $state, $auth, $http, UserSvc) {
  $scope.authenticate = function (provider, user) {
    //$auth returns a promise. We'll wanna use that, so we have a '.then'. (This is what produces the 'token' object we see in console).
    //Satellizer stores this token for us automatically. (It's in local storage!) It is sent via the request.get in 'auth.js' route.
    $auth.authenticate(provider, user).then(function (res) {
      console.log(res, 'This is the auth response in Home Ctlr.');
      // var token = res.data;
      // console.log(token, "This is our token. We're inside Home Ctlr.")
      UserSvc.getProfile()
      // this has to be done before state.go because facebook_email is needed but
      // after auth.authenticate because you are pressing the login with facebook button
      .then(function (response) {
        var facebookId = response.data.facebook;
        // var facebook_name = response.data.displayName;
        // var facebook_email = response.data.email;
        console.log('THIS IS THE UNIQUE FACEBOOK ID', facebookId);
        $state.go('my-wishlist', { id: facebookId });
      }).catch(function (err) {
        console.error(err, 'Inside UserSvc After Auth.authenticate, we have an error!');
      });
    }).catch(function (err) {
      console.error('Inside the Home Ctrl, we have an error!', err);
    });
  };
}
'use strict';

angular.module('App').controller('WishlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', WishlistCtrl]);

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

  UserSvc.getProfile().then(function (response) {
    console.log(response.data, "response");
    $rootScope.user = response.data;
    $rootScope.id = response.data._id;
    $rootScope.birthday = response.data.birthday;
    $rootScope.display_name = response.data.displayName;
    $rootScope.email = response.data.email;
    $rootScope.pro_pic = response.data.facebook;
    // console.log('THIS IS THE PRO PIC ID', $rootScope.pro_pic)
    $rootScope.items = response.data.items;
    // $rootScope.pro_pic = response.data.picture
    $rootScope.friends = response.data.friends[0].name;
    $rootScope.friendsLength = response.data.friends.length;
    $rootScope.favorites = response.data.favorites;
    // console.log(response.data.friends.length, 'friend length')
    // console.log("This is the data from GET request.", $rootScope.user);
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
    console.log('like this item', item);
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
    $scope.public = true;
    $scope.private = false;
    $scope.makePrivate = function () {
      $scope.private = true;
      $scope.public = false;
    };
    $scope.makePublic = function () {
      $scope.private = false;
      $scope.public = true;
    };
  };

  $scope.backToWlist = function () {
    $scope.settings = false;
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
}
'use strict';

angular.module('App').controller('StarredCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', 'StarSvc', '$stateParams', 'getUser', '$rootScope', StarredCtrl]);

function StarredCtrl($scope, $state, $auth, $http, $window, UserSvc, StarSvc, $stateParams, getUser, $rootScope) {

  if (!$auth.isAuthenticated()) {
    return $state.go('home');
  }

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

angular.module('App').controller('NavbarCtrl', ['$scope', '$state', 'NavSvc', '$auth', 'UserSvc', '$rootScope', NavbarCtrl]);

function NavbarCtrl($scope, $state, NavSvc, $auth, UserSvc, $rootScope) {

  $scope.isAuthenticated = function () {
    return $auth.isAuthenticated();
  };
  $scope.logout = function () {
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
      console.log('MyId', myId);
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

  // $scope.getFavorites = () => {

  // }

  // UserSvc.getProfile()
  // .then((res) => {
  //   console.log('!@#!@#!@#@#@!#@!#@', res)
  // })

  $scope.focused = function () {
    $scope.friendsContainer = true;
    $scope.searchFriends();
  };

  $scope.blurred = function () {
    $scope.friendsContainer = false;
  };

  // $scope.searchFriends();
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