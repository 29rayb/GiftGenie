'use strict';

angular
  .module('App')
  .factory('StarSvc', StarSvc)

StarSvc.$inject = ['$http'];

function StarSvc ($http) {
  return {
    // get_friends: function(user) {
    //   console.log("IN HERE. This is user in service", user);
    //   return $http.get('/api/me/:id/friends', user);
    // }
  };
};
