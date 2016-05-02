'use strict';

angular.module('App', ['ui.router', 'satellizer', 'app.routes', 'ui.sortable']);
'use strict';

angular.module('app.routes', []).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$authProvider', AppRoutes]);

function AppRoutes($stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {
  // $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'app/components/home/home.html',
    controller: 'HomeCtrl'
  }).state('my-wishlist', {
    url: '/my-wishlist/:id',
    templateUrl: 'app/components/my-wishlist/my-wishlist.html',
    controller: 'WishlistCtrl'
  }).state('starred-lists', {
    url: '/starred-lists/:id',
    templateUrl: 'app/components/starred-lists/starred-lists.html',
    controller: 'StarredCtrl'
  });
  $authProvider.facebook({
    clientId: '247255738962232'
  });
}
'use strict';

angular.module('App').service('NavSvc', NavSvc);

NavSvc.$inject = ['$http'];

function NavSvc($http) {}
'use strict';

angular.module('App').factory('StarSvc', function ($http) {
  return {
    // get_friends: function(user) {
    //   console.log("IN HERE. This is user in service", user);
    //   return $http.get('/api/me/:id/friends', user);
    // }
  };
});
'use strict';

angular.module('App').factory('UserSvc', function ($http) {
  return {
    getProfile: function getProfile() {
      return $http.get('/api/me');
    },
    add_new: function add_new(item) {
      var item;
      void 0;
      return $http.post('/api/me/items', item);
    },
    delete_item: function delete_item(item, $index) {
      void 0;
      void 0;
      return $http.put('/api/me/items/delete', item);
    },
    save_changes: function save_changes(item) {
      var item;
      void 0;
      return $http.put('/api/me/items/edit', item);
    }
  };
});
'use strict';

angular.module('App').controller('HomeCtrl', ['$scope', '$state', '$auth', '$http', 'UserSvc', HomeCtrl]);

function HomeCtrl($scope, $state, $auth, $http, UserSvc) {
  $scope.authenticate = function (provider, user) {
    //$auth returns a promise. We'll wanna use that, so we have a '.then'. (This is what produces the 'token' object we see in console).
    //Satellizer stores this token for us automatically. (It's in local storage!) It is sent via the request.get in 'auth.js' route.
    $auth.authenticate(provider, user).then(function (res) {
      // console.log(res, 'This is the auth response in Home Ctlr.');
      var token = res.data;
      // console.log(token, "This is our token. We're inside Home Ctlr.")
      UserSvc.getProfile()
      // this has to be done before state.go because facebook_email is needed but
      // after auth.authenticate because you are pressing the login with facebook button
      .then(function (response) {
        var facebookId = response.data._id;
        // var facebook_name = response.data.displayName;
        // var facebook_email = response.data.email;
        void 0;
        $state.go('my-wishlist', { id: facebookId });
      }).catch(function (err) {
        void 0;
      });
    }).catch(function (err) {
      void 0;
    });
  };
}
'use strict';

angular.module('App').controller('WishlistCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', '$rootScope', '$stateParams', WishlistCtrl]);

function WishlistCtrl($scope, $state, $auth, $http, $window, UserSvc, $rootScope, $stateParams) {
  void 0;
  $scope.id = $stateParams.id;
  void 0;

  if (!$auth.isAuthenticated()) {
    return $state.go('home');
  }

  UserSvc.getProfile().then(function (response) {
    $rootScope.user = response.data;
    $rootScope.id = response.data._id;
    $rootScope.display_name = response.data.displayName;
    $rootScope.email = response.data.email;
    $rootScope.pro_pic = response.data.facebook;
    $rootScope.items = response.data.items;
    void 0;
  }).catch(function (err) {
    void 0;
  });

  $scope.add = function (item, user) {
    $scope.name = item.name;
    $scope.link = item.link;
    var userId = $scope.user._id;
    $scope.item.user = userId;

    UserSvc.add_new(item).then(function () {
      void 0;
      $scope.items.push({
        name: $scope.name,
        link: $scope.link,
        user: userId
      });
      $scope.item.name = '';
      $scope.item.link = '';
      void 0;
    }).catch(function (err) {
      void 0;
    });
    swal({ title: "Good job!",
      text: "You added the item!",
      type: "success",
      timer: 2000
    });
  };

  $scope.edit = function (item) {
    $scope.item = {};
    $scope.item.name = item.name;
    $scope.item.link = item.link;
    $scope.editItemId = item._id;
    void 0;
  };

  $scope.save_changes = function (item, editItemId) {
    void 0;
    $scope.item.name = item.name;
    $scope.item.link = item.link;
    $scope.item.id = editItemId;
    void 0;
    UserSvc.save_changes(item).then(function () {
      void 0;
      void 0;
    });
  };

  $scope.delete = function (item, $index) {
    void 0;
    void 0;
    UserSvc.delete_item(item, $index).then(function () {
      void 0;
      var item_to_delete = $scope.items[$index];
      void 0;
      $scope.items.splice($index, 1);
    });
  };

  $scope.star = function () {
    void 0;
  };
}
'use strict';

angular.module('App').controller('NavbarCtrl', ['$scope', '$state', 'NavSvc', '$auth', NavbarCtrl]);

function NavbarCtrl($scope, $state, NavSvc, $auth) {
  $scope.isAuthenticated = function () {
    return $auth.isAuthenticated();
  };
  $scope.logout = function () {
    $auth.logout();
    $state.go('home');
  };
}
'use strict';

angular.module('App').controller('StarredCtrl', ['$scope', '$state', '$auth', '$http', '$window', 'UserSvc', 'StarSvc', '$stateParams', StarredCtrl]);

function StarredCtrl($scope, $state, $auth, $http, $window, UserSvc, StarSvc, $stateParams) {

  if (!$auth.isAuthenticated()) {
    return $state.go('home');
  }

  $scope.search = function () {
    // console.log(user, 'heres the user');
    // StarSvc.get_friends(user)
    // .then(function(user){
    //   console.log(user, "here are the friends we would get back");
    //   console.log('WTF');
    // })
    // .catch(function(err) {
    //   console.error(err, 'Inside the Starred Ctrl, we have an error!');
    // });
  };
}
'use strict';

angular.module('App').controller('ProfileCardCtrl', function ($scope) {
  void 0;
}).directive('profile-card', function () {
  return {
    restrict: 'E',
    controller: 'ProfileCardCtrl',
    templateUrl: 'app/shared/profile-card/profile-card.html',
    link: function link(scope, el, attrs) {}
  };
});