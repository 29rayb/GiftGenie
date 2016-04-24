'use strict';

angular.module('App')

.factory('UserSvc', function($http) {
  return {
    getProfile: function() {
      return $http.get('/api/me');
    },
    add_new: function(item) {
      var item;
      console.log(item, "Here is the new item in our service.");
      return $http.post('/api/me/items', item);
    },
    delete_item: function(item, $index) {
      console.log(item, "Item Id for deletion.");
      console.log($index, "INDEX IN SERVICE");
      return $http.put('/api/me/items/delete', item);
    },
    save_changes: function(item) {
      var item;
      console.log(item, "Item for editting.");
      return $http.put('/api/me/items/edit', item);
    }
  };
});
