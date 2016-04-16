'use strict';

angular
  .module('App')
  .controller('HomeCtrl', ['$scope', '$state', HomeCtrl])

function HomeCtrl($scope, $state){
  console.log('In The Home Controller')
}