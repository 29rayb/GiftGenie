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
      controller: 'faqCtrl',
      resolve: {
        getUser: function(UserSvc) {
          return UserSvc.getProfile();
        }
      }
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
    .state('friend-wishlist', {
      url: '/my-wishlist/:id/friends/:fid',
      templateUrl: 'app/components/friend-wishlist/friend-wishlist.html',
      controller: 'FriendlistCtrl',
      resolve: {
        getUser: function(UserSvc) {
          return UserSvc.getProfile();
        }
      }
    })
    .state('settings', {
      url: '/settings/:id',
      templateUrl: 'app/components/settings/settings.html',
      controller: 'SettingsCtrl'
    })
    .state('starred-lists', {
      url: '/starred-lists/:id',
      templateUrl: 'app/components/starred-lists/starred-lists.html',
      controller: 'StarredCtrl',
      resolve: {
        getUser: function(UserSvc) {
          return UserSvc.getProfile();
        }
      }
    })

  $authProvider.facebook({
    clientId: '247255738962232',
    requiredUrlParams: ['scope'],
    scope: ['user_friends', 'email', 'user_birthday', 'user_likes']
  });
}
