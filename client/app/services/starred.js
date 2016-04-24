'use strict';

angular.module('App')

.factory('StarSvc', function($http) {
  return {
    get_friends: function(user) {
      console.log("IN HERE. This is user in service", user);
      return $http.get('/api/me/:id/friends', user);
    }
  //   add_new: function(item) {
  //     var item;
  //     console.log(item, "Here is the new item in our service.");
  //     return $http.post('/api/me/items', item);
  //   },
  //   delete_item: function(item) {
  //     return $http.put('/api/me/items/delete', item);
  //   },
  //   save_changes: function(item) {
  //     var item;
  //     console.log(item, "Item for editting.");
  //     return $http.put('/api/me/items/edit', item);
  //   }
  };
});
