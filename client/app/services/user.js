'use strict';

angular.module('App')

.factory('UserSvc', function($http) {
  return {
    getProfile: function() {
      return $http.get('/api/me');
    },
    // getPhotos: function() {
    //   return $http.get('/api/me/photos');
    // },
    add_new: function(item) {
      var item;
      return $http.post('/api/me/items', item);
    },
    // delete_item: function($index) {
    //   return $http.delete('/api/me/items', $index);
    // }
    // delete_item: function($index) {
    //   var item;
    //   return $http.delete('/api/me/items', $index);
    // }
    // add_new: function(item) {
    //   return $http.put('/api/me', item);
    // }

  };
});
