'use strict';

angular
  .module('App')
  .factory('UserSvc', UserSvc)

UserSvc.$inject = ['$http']

function UserSvc ($http) {
  return {
    getProfile: () => {
      return $http.get('/api/me');
    },
    add_new: (item) => {
      var item;
      console.log(item, "Here is the new item in our service.");
      return $http.post('/api/me/items', item);
    },
    delete_item: (item, $index) => {
      console.log(item, "Item Id for deletion.");
      console.log($index, "INDEX IN SERVICE");
      return $http.put('/api/me/items/delete', item);
    },
    save_changes: (item) => {
      var item;
      console.log(item, "Item for editting.");
      return $http.put('/api/me/items/edit', item);
    }
  };
};
