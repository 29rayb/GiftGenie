'use strict';

angular.module('App')

.service('UserService', function($http, $location, $window) {
  // var currentUser = {}
  // currentUser.theirMongoId = function(user) {
  //   this._id = user;
  //   console.log(user, "INSIDE USER SERVICE - MONGO ID");
  //   return $http.get('/users/me' + user)
  var saveToken = function (token) {
    $window.localStorage['auth-token'] = token;
  };

  var getToken = function () {
    return $window.localStorage['auth-token'];
  };

  logout = function() {
    $window.localStorage.removeItem('auth-token');
  };

  return {
    saveToken : saveToken,
    getToken : getToken,
    logout : logout
  };
});
