'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
// var async = require("async");


var User = require('../models/user-model');
var Item = require('../models/item-model');

//#1: Finding a user (to display their profile info).
router.get('/me', function(req, res) {
  User.findById(req.user, function(err, user) {
    res.status(err ? 400 : 200).send(err || user)
  }).populate('items')
});

//#2: Adding a new item to the wishlist.
router.post('/me/items', function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    Item.submit(req.body, function(err, savedItem) {
      user.items.push(savedItem);
      user.save(function(err, user) {
        res.send(user);
      })
    });
  });
});

//Route #3: Deleting an item from the wishlist (removes it from both Mongo models).
router.put('/me/items/delete', function(req, res) {
  // var clicked = req.body;
  var clickedItemId = req.body._id;
  // var clickedItemName = req.body.name;

  var mongoose = require('mongoose');
  var objectId = mongoose.Types.ObjectId(clickedItemId);

  User.findByIdAndUpdate(req.user, {$pull : { "items" : objectId }}, function(err, user) {
    if(err){
      res.status(400).send(err);
    }

    Item.findByIdAndRemove(clickedItemId, function(err, item){
      res.send(user);
    });
  })
});

//Route #4: Editting an item on a wishlist (updates both Mongo models).

router.put('/me/items/edit', function(req, res) {
  var editItem = req.body;
  var editItemId = editItem.id;

  var editItemName = editItem.name;
  var editItemLink = editItem.link;

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    // var new = user.items.ObjectId.str;

    // cannot read property 'str' of undefined error needs to be fixed;
    User.update( {"items" : { $elemMatch: { "_id": editItemId.str }}},
    { "name": editItemName, "link": editItemLink },
    function(err, user) {
      if(err){
        res.status(400).send(err);
      }
      Item.update( {"_id": editItemId},
      { "name": editItemName,
      "link": editItemLink },
      function(err, item) {
        res.send(user);
      });
    });
  });
});

router.put('/me/items/order', function(req, res){
  // console.log('EDITING THE ORDER OF ITEMS')
  var newUserItems = [];
  var newItemsOrderArr = req.body;

  for (var i = 0; i < newItemsOrderArr.length; i++){
    var mongoId = newItemsOrderArr[i]._id;
    newUserItems.push(mongoId);
  }

  console.log(newItemsOrderArr)  

  User.findById(req.user, function(err, user){
    var userItems = user.items;
    console.log('user items !@#!@#!@#!@#', userItems)
    // UserItems
    // console.log('REQ!@#!@#!@#!@#', req.body)
    User.update({"_id": req.user}, {$set : {"items" : newUserItems}}, function(err, user){
      // res.send(user)
      res.write('item order saved in user model')
    })
    // need to find previous _id and replace it with new _id (newUserItems[i]);
    for(var i =0; i<newUserItems.length; i++){
      // console.log('should console 4 times')
      console.log(newUserItems[i])
      // Item.update({"_id":  }, {$set: {"_id": newUserItems[i] }}, function(err, item) {
      //   res.write('item order saved in item model')
      // })
    }



    // while(newUserItems.length > 0){
    //   console.log('should console four 44444444 times')

    // // Item.update({"_id": }))

    // console.log('NEW ORDER YOLOO123O123O12O3', newUserItems)

    // // var itemMongoId = newUserItems.split(',')
    // // console.log('JUST THE MONGO ID',itemMongoId)




    //   newUserItems.length--
    // }
  })
})





// Favorite User's Wishlist
router.put('/me/star', function(req, res){
  console.log(req.body, 'REQ.BODY ASD!@#!@#@!#!@')
  var starred_friend = req.body._id;
  // console.log(req.user, 'REQ.USER !@#!@#@!#!@#!@#!@#!@')

  User.findById(req.user, function(err, user){
    if (!user){
      return res.status(400).send({messages: 'User Not Found'})
    }

    if (req.body.favoritedBy.indexOf(req.user) > -1){
      User.update({"_id": req.body._id}, {$pull: {"favoritedBy": req.user}}, function(err, user){
        if (err) {res.status(400).send(err);}
        console.log('this person is already in your favoritedby array, therefore removed')
      })
    }

    if (user.favorites.indexOf(starred_friend) > -1){
      User.update({"_id": req.user}, {$pull: {"favorites": starred_friend}}, function(err, user){
        if(err){ res.status(400).send(err);}
        console.log('wishlist already in the favorites array');
        console.log('wishlist unfavorited');
      })
      return;
    }


    User.update({"_id": req.body._id}, {$push: {"favoritedBy": req.user}}, function(err, user){
      if (err) {res.status(400).send(err);}
      console.log('the other user is being favorited by me now')
      res.write('my mongo id has been added to rachel slater wishlist ')
    })

    User.update({"_id": req.user}, {$push: {"favorites": starred_friend}}, function(err, user){
      if(err){ res.status(400).send(err);}
      console.log('this is the user that was added to your favorite', user)
      res.write('rachel slater id has been added to my mongo')
      res.end();
    })

  });
})

router.put('/me/following', function(req, res){

  console.log('req.user', req.user)
  console.log('REQ BODY QEQWEQWEQWEQWEWE',req.body)
  var personFollowingYou = req.user;
  var followingThisPerson =  req.body._id

  User.findById(req.user, function(err, user){

    console.log('!#@@$%#$%@#$@#$#@$@#$@#$@#@#', user)

    if (!user) {return res.status(400).send({messages: 'User Not Found'}) }

    if (user.following.indexOf(followingThisPerson) > -1){
      User.update({"_id": req.user}, {$pull: {"following": followingThisPerson}}, function(err, user){
        if (err) {res.status(400).send(err)}
        console.log('already following this user; now UNFOLLOWING THIS USER', user)
      })
    }

    if (req.body.followers.indexOf(personFollowingYou) > -1){
      User.update({"_id": followingThisPerson}, {$pull: {"followers": personFollowingYou}}, function(err, user){
        if (err) {res.status(400).send(err);}
        console.log('the person you are trying to follow already has you in their followers array, therefore you are removed')
      })
      return;
    }


    User.update({"_id": req.user}, {$push: {"following": followingThisPerson}}, function(err, user){
      if (err) {res.status(400).send(err);}
      console.log('this is the user you are following now')
      res.write('this is the user you are following now')
    })

    User.update({"_id": req.body._id}, {$push: {"followers": personFollowingYou }}, function(err, user){
      if (err) {res.status(400).send(err);}
      console.log('your id has been added to the followers array of the person you are following')
      res.write('your id has been added to the followers array of the person you are following')
      res.end();
    })

  });
})



router.post('/friend', function(req, res){
  // console.log('FRIEND FACEBOOK ID', req.body.params)
  var friendId = req.body.params.fid;

  User.findOne({'facebook': friendId}, function(err, user){

    // console.log(user.items, 'USER*************************');
    if (user === null){
      return false;
    }

    var friendItems = user.items;
    // console.log(friendItems, 'items');

    var mongoose = require('mongoose');
    friendItems = friendItems.map(function(id) { return mongoose.Types.ObjectId(id) });

    // var allFriendItems = [];

    Item.find( {_id: { $in : friendItems }}, function(err, items) {
      console.log(items, '<-------Items.');
      var allItems = items;

      var data = {
        user: user,
        items: allItems
      }

      console.log(data, 'DATA')
      if (err) console.error(err)
      res.send(data)
    })
  })
})

router.post('/friend/follow', function(req, res){
  var followMongoIdArray = req.body.params.friendIds;

  var allFollowUsers = [];
  for (var i = 0; i < followMongoIdArray.length; i++){
    var eachFollow = followMongoIdArray[i];

    User.findById({"_id": eachFollow}, function(err, user) {
      if (err) {res.status(400).send(err)}
      var everyUser = user;
      allFollowUsers.push(everyUser);
      var userCheck = user._id;
      if(followMongoIdArray.length === allFollowUsers.length) {
        res.send(allFollowUsers)
      }
    })
  }
})

router.post('/me/favorited', function(req, res){

  var favoritedByMongoIdArray = req.body.params.favoritedByIds;

  var allFavoritedBy = [];
  for (var i = 0; i < favoritedByMongoIdArray.length; i++){
    var eachFavoritedBy = favoritedByMongoIdArray[i];

    User.findById({"_id": eachFavoritedBy}, function(err, user) {
      if (err) {res.status(400).send(err)}
      var everyUser = user;
      allFavoritedBy.push(everyUser);
      var userCheck = user._id;
      if(favoritedByMongoIdArray.length === allFavoritedBy.length) {
        res.send(allFavoritedBy)
      }
    })
  }
})

router.get('/favorites/data', function(req, res) {
  User.findById(req.user, function(err, user){
    if (!user){
      return res.status(400).send({messages: 'User Not Found'})
    }

    var faves = user.favorites;
    var mongoose = require('mongoose');
    faves = faves.map(function(id) { return mongoose.Types.ObjectId(id) });

    User.find( {_id: { $in : faves }}, function(err, faves) {
      var allFaveData = faves;

      var data = {
        user: user,
        favoritesData: faves
      }

      console.log(data, 'THE DATA.')
      if (err) console.error(err)
      res.send(data)
    })
  })
})


// like items;
router.put('/items/liked', function(req, res){
  var likedItem = req.body._id
  User.findById(req.user, function(err, user){

    if (user.liked.indexOf(likedItem) > -1) {
      console.log('item already liked')
      User.update({"_id": req.user}, {$pull: {"liked": likedItem}}, function(err, user){
        if (err) {res.status(400).send(err)}
        console.log('item unliked')
      })
      return;
    }


    console.log('user INSIDE @#$#$%Y#@$%^$#%^&$', user)
    User.update({"_id": req.user}, {$push: {"liked": likedItem}}, function(err, user){
      if (err) {res.status(400).send(err)}
      console.log('liked item added')
      res.send(user);
    })
  })
})

//**Changing privacy settings --> From public to private.
router.put('/me/makePrivate', function(req, res){
  console.log('In make private route in server --> user', req.user);

  var newlyPrivateUser = req.user;

  User.findById(req.user, function(err, user){
    User.update({"_id": req.user}, {$set: {"private": true}}, function(err, user) {
      if (err) {res.status(400).send(err)}
      console.log(user, 'User is now private.')

      var mongoose = require('mongoose');
      var mongoFormOfPrivateUser = mongoose.Types.ObjectId(newlyPrivateUser);
      var arrayForm = [mongoFormOfPrivateUser];

      User.find( {"favorites" : { $in : arrayForm }}, function(err, faves) {
        var usersWithPrivatedInFaves = faves;
        console.log(usersWithPrivatedInFaves, 'this is the faves for removal');

        User.find( {"following" : { $in : arrayForm }}, function(err, following) {
          var usersWithPrivatedInFollowing = following;
          console.log(usersWithPrivatedInFollowing, 'this is the following for removal');

          User.find( {"followers" : { $in : arrayForm }}, function(err, followers) {
            var usersWithPrivatedInFollowers = followers;
            console.log(usersWithPrivatedInFollowers, 'this is the followers for removal');

            if(usersWithPrivatedInFaves.length > 0) {
              for (var i = 0; i < usersWithPrivatedInFaves.length; i++){
                var theUser = usersWithPrivatedInFaves[i]._id;

                var allFaveRemovals = [];
                User.update({"_id": theUser}, {$pull: {"favorites": mongoFormOfPrivateUser}}, function(err, user) {
                  if (err) {res.status(400).send(err)}
                  console.log(user, '<--------------------- !!!!The private user has been removed from favorites.')
                  var eachUser = user;
                  allFaveRemovals.push(eachUser)
                })
              }
            }

            if(usersWithPrivatedInFollowing.length > 0) {
              for (var i = 0; i < usersWithPrivatedInFollowing.length; i++){
                var theUser = usersWithPrivatedInFollowing[i]._id;

                var allFollowingRemovals = [];
                User.update({"_id": theUser}, {$pull: {"following": mongoFormOfPrivateUser}}, function(err, user) {
                  if (err) {res.status(400).send(err)}
                  console.log(user, '<---------------------!!!!The private user has been removed from following.')
                  var eachUser = user;
                  allFollowingRemovals.push(eachUser)
                })
              }
            }

            if(usersWithPrivatedInFollowers.length > 0) {
              for (var i = 0; i < usersWithPrivatedInFollowers.length; i++){
                var theUser = usersWithPrivatedInFollowers[i]._id;

                var allFollowersRemovals = [];
                User.update({"_id": theUser}, {$pull: {"followers": mongoFormOfPrivateUser}}, function(err, user) {
                  if (err) {res.status(400).send(err)}
                  console.log(user, '<---------------------!!!!The private user has been removed from followers.')
                  var eachUser = user;
                  allFollowersRemovals.push(eachUser)
                })
              }
            }

            var data = {
              user: user
            }

            console.log(data, 'THE DATA.')
            if (err) console.error(err)
            res.send(data)


          })
        })
      })
    })
  })
})

//**Changing privacy settings --> From private to public.
router.put('/me/makePublic', function(req, res){
  console.log('in make public route --> user', req.user);

  User.findById(req.user, function(err, user){
    User.update({"_id": req.user}, {$set: {"private": false}}, function(err, user) {
      if (err) {res.status(400).send(err)}
      console.log('USER UPDATED')
      res.send(user);
    })
  })
})

//**When click on searchbar in Navbar, checking if friends have set their profile to private.
router.post('/me/checkingFriendPrivacy', function(req, res) {
  console.log('*******INSIDE CHECK FRIEND PRIVACY');
  console.log('--------------> The actual user', req.user);
  var userMates = req.body.friends;
  console.log(userMates, '<------------------------------- UserMates in Server.');

  User.find( {facebook: { $in : userMates }}, function(err, users) {
    var allFriends = users;
    var friendsWhoArePublic = [];
    var friendsWhoArePrivate = [];

    for (var i = 0; i < users.length; i++){
      if(users[i].private == false) {
        friendsWhoArePublic.push(users[i])
      } else if (users[i].private == true) {
        friendsWhoArePrivate.push(users[i])
      }
    }

    console.log(friendsWhoArePublic, 'PUBLIC*********');
    console.log(friendsWhoArePrivate, 'PRIVATE*********');

    var idsOfPrivateMates = []
    for (var i = 0; i < friendsWhoArePrivate.length; i++){
      var mongoId = friendsWhoArePrivate[i]._id;
      idsOfPrivateMates.push(mongoId);
    }
    console.log(idsOfPrivateMates, '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');

    // var mongoose = require('mongoose');
    // idsOfPrivateMates = idsOfPrivateMates.map(function(id) { return mongoose.Types.ObjectId(id) });


    // User.findById(req.user, function(err, user) {
    //
    //   console.log(user.favorites, 'Before REMOVAL');
    //   var currentFaves = user.favorites;
    //   console.log(currentFaves, 'here current fav');
    //
    //   console.log(idsOfPrivateMates, 'privates');
    //   if(err){
    //     res.status(400).send(err);
    //   }
    //
    //   var privatesPresentinFavs = [];
    //   for (var i = 0; i < idsOfPrivateMates.length; i++){
    //     if(currentFaves.indexOf(idsOfPrivateMates[i]) > -1) {
    //       console.log('HERERERERERRERERERERRRRRRRRRRRRR', idsOfPrivateMates[i]);
    //       var privateForRemoval = idsOfPrivateMates[i];
    //       privatesPresentinFavs.push(privateForRemoval);
    //     }
    //   }
    //
    //   console.log(privatesPresentinFavs, 'DOUBLE CHECK&&&&&&&&&&&&&&&&&');
    //
    //   User.update({"_id": req.user}, {$pull: {"favorites": privatesPresentinFavs}}, function(err, user){
    //     if(err){ res.status(400).send(err);}
    //     console.log(user, 'user update');

    var data = {
      publicFriends: friendsWhoArePublic,
      privateFriends: friendsWhoArePrivate
    }

    console.log(data, '<-----------------------------------DATA')

    if (err) console.error(err)
    res.send(data)
  })

})
// })

module.exports = router;
