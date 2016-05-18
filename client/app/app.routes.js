'use strict';

angular
  .module('app.routes', [])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$authProvider', AppRoutes]);

function AppRoutes($stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {
  // $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/components/home/home.html',
      controller: 'HomeCtrl'
    })
    .state('my-wishlist', {
      url: '/my-wishlist/:id',
      templateUrl: 'app/components/my-wishlist/my-wishlist.html',
      controller: 'MyWishListCtrl',
    })
    .state('starred-lists', {
      url: '/starred-lists/',
      templateUrl: 'app/components/starred-lists/starred-lists.html',
      controller: 'StarredListsCtrl'
    })
  $authProvider.facebook({
    clientId: '247255738962232',
    requiredUrlParams: ['scope'],
    scope: ['user_friends']
  });
}
