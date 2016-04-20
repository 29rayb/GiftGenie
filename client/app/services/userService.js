'use strict';

angular.module('App')

.service('UserService', function($http, $location) {

  function UserService($http){
    this.theCurrentUser = function(cb){
      $http.get('/API/users/me')
      .then(function(resp){
        console.log(resp.data);
        cb(resp.status, resp)
      }, function(err){
        console.log(err)
        cb(err.status)
      });
    }
  }
});
