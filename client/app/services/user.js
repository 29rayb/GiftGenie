'use strict';

angular.module('App')

.factory('UserSvc', function($http) {
  return {
    getProfile: function() {
      return $http.get('/api/me');
    },
    add_new: function(item) {
      var item;
      return $http.post('/api/me/items', item);
    }
  };
});
