'use strict';

angular.module('App')
  .factory('Account', function($http) {
    return {
      getProfile: function() {
        return $http.get('/api/me');
      },
      add_new: function(item) {
        return $http.post('/api/me', item);
      }
    };
  });
