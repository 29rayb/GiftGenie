'use strict';

angular
  .module('App')
  .controller('ProfileCardCtrl', function($scope){
    console.log('yo')
  })
  .directive('profile-card', function(){
    return {
      restrict: 'E',
      controller: 'ProfileCardCtrl',
      templateUrl: 'app/shared/profile-card/profile-card.html',
      link: function(scope, el, attrs){

      }
    }
  });