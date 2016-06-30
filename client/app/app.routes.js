'use strict';

angular
.module('app.routes', [])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$authProvider', AppRoutes]);

function AppRoutes($stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {
  // $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('faq', {
    url: '/faq',
    templateUrl: 'app/components/faq/faq.html',
    controller: 'faqCtrl'
  })
  .state('home', {
    url: '/',
    templateUrl: 'app/components/home/home.html',
    controller: 'HomeCtrl'
  })
  .state('my-wishlist', {
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
      getUser: function(UserSvc) {
        return UserSvc.getProfile();
      },
      getFriend: function(UserSvc, $stateParams){
        return UserSvc.friendProfile($stateParams.fid);
      }
    }
  })

  $authProvider.facebook({
    clientId: '247255738962232',
    requiredUrlParams: ['scope', 'display'],
    display: 'popup',
    authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
    redirectUri: window.location.origin + '/auth/facebook/callback',
    scope: ['user_friends', 'email', 'user_birthday', 'user_likes'],
    type: '2.0',
    popupOptions: { width: 580, height: 400 }
  });
}
