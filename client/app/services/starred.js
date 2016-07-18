'use strict';

angular
  .module('App')
  .factory('StarSvc', StarSvc)

StarSvc.$inject = ['$http'];


function StarSvc ($http) {
  return {
    get_friends: function() {
      console.log("IN HERE. This is user in service");
      return $http.get('/api/me/friends');
    }
  };
};
