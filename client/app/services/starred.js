'use strict';

angular.module('App')

.factory('StarSvc', function($http) {
  return {

    get_friends: function(user, user_id) {
      console.log("IN HERE. This is user in service", user);
      console.log(user_id, "HEREs the id we will insert");
      return $http.get(`/api/${user_id}/friendslists`, user, user_id);
    }
  };
});
