'use strict';

angular.module('App')
  .factory('UserSvc', function($http) {
    return {
      getProfile: function() {
        return $http.get('/api/me');
      },
      add_new: function(item) {
        return $http.post('/api/me', item);
      }
    };
  });
