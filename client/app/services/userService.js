'use strict';

angular.module('App')

.service('UserService', function($http, $location) {
  var currentUser = {}
  currentUser.theirMongoId = function(user) {
    this._id = user;
    console.log(user, "INSIDE USER SERVICE - MONGO ID");
    return $http.get('/users/' + user)
  };
  return currentUser;
})
