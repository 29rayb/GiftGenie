'use strict';

angular
  .module('App')
  .controller('StarredLists', ['$scope', '$state', StarredLists])

function StarredLists($scope, $state){
  console.log('starred lists');

  $scope.unstar = function(){
    console.log('unstar wishlist');
  }
}