'use strict';

angular
  .module('app.routes', [])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', AppRoutes]);

function AppRoutes($stateProvider, $urlRouterProvider, $locationProvider){

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'app/components/home/home.html',
      controller: 'HomeCtrl'
    })
}