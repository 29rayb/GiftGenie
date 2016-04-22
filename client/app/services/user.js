'use strict';

angular.module('App')
.factory('Account', function($http) {
  return {
    getProfile: function() {
      return $http.get('/api/me');
    },
    add_new: function(item) {
      var item;
      // this.add_new = function(item) {
      console.log(item, "INSIDE ADD_NEW SERVICE");
      return $http.post('/api/me/items', item);
      // }
    }
    // add_new: function(item) {
    //   return $http.put('/api/me', item);
    // }
  };
});
