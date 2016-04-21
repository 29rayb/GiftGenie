'use strict';

angular.module('App')
  .factory('Account', function($http) {
    return {
      getProfile: function() {
        return $http.get('/api/me');
      },
      add_new: function(profileData) {
        return $http.put('/api/me', profileData);
      }
    };
  });
