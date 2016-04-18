'use strict';

angular
  .module('app.routes', [])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', AppRoutes]);

function AppRoutes($stateProvider, $urlRouterProvider, $locationProvider){

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/components/home/home.html',
      controller: 'HomeCtrl'
    })
    .state('my-wishlist', {
      url: '/',
      templateUrl: 'app/components/my-wishlist/my-wishlist.html',
      controller: 'MyWishListCtrl'
    })
    .state('starred-lists', {
      url: '/',
      templateUrl: 'app/components/starred-lists/starred-lists.html',
      controller: 'StarredLists'
    })
}