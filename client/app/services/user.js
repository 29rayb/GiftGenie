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
    friendProfile: (friendId) => {
      return $http.post('/api/me/friend', {params: {fid: friendId}});
    },
    showFollow: (allFriendIds) => {
      return $http.post('/api/friend/showfriendfollows', {params: {friendIds: allFriendIds}});
    },
    displayFaves: (allFavoritedBy) => {
      return $http.post('/api/me/favoritedby', {params: {favoritedByIds: allFavoritedBy}});
    },
    add_new: (item) => {
      var item;
      // console.log(item, "Here is the new item in our service.");
      return $http.post('/api/me/items', item);
    },
    delete_item: (item, $index) => {
      console.log(item, "Item Id for deletion.");
      return $http.put('/api/me/deleteitem', item);
    },
    save_changes: (item) => {
      var item;
      console.log(item, "Item for editting.");
      return $http.put('/api/me/edititem', item);
    },
    starPerson: (user) => {
      console.log('starring this user', user)
      return $http.put('/api/me/favorite', user)
    },
    saveOrder: (newOrder) => {
      console.log('new order in service', newOrder);
      return $http.put('/api/me/itemreorder', newOrder);
    },
    likeItem: (item) => {
      return $http.put('/api/items/liked', item);
    },
    showFavoritesData: () => {
      return $http.get('/api/favoritesdata');
    },
    followPerson: (user) => {
      // console.log('user in service', user)
      return $http.put('/api/me/following', user)
    },
    makePrivate: (loggedInUser) => {
      return $http.put('/api/me/makeprivate')
    },
    makePublic: (loggedInUser) => {
      return $http.put('/api/me/makepublic')
    },
    checkingFriendPrivacy: (userFriends) => {
      console.log('userFriends in service ------> ', userFriends);
      var friendsToCheck = []
      for (var i = 0; i < userFriends.length; i++){
        var mongoId = userFriends[i].id;
        friendsToCheck.push(mongoId);
      }
      return $http.post('/api/me/checkfriendprivacy', {friends: friendsToCheck})
    }
  };
};
