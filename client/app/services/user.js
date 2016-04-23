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

    delete_item: function(item) {
      console.log(item, "Item for deletion.");
      var item;
      return $http.put('/api/me/items', item);
    }
  };
});
