'use strict';

angular
  .module('App')
  .service('UserSvc', UserSvc)

UserSvc.$inject = ['$http', '$location']

function UserSvc($http){
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
