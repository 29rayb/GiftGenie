(function(module) {
try {
  module = angular.module('faq');
} catch (e) {
  module = angular.module('faq', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('faq/faq.html',
    '<div class="main_container">\n' +
    '\n' +
    '  <div class="faq container">\n' +
    '    <h1>Frquently Asked Questions</h1>\n' +
    '    <div class="search_faq_container">\n' +
    '      <input type="text" ng-model="search" class="search_faqs" placeholder="What Question Do You Have?">\n' +
    '    </div>\n' +
    '\n' +
    '    <ul class="faquestions">\n' +
    '      <li ng-repeat="faq in faqs | filter:search">\n' +
    '        <h5 ng-click="getAnswer()">{{faq.question}} </h5><br>\n' +
    '        <h6 class="faq_answers" ng-if="showAnswer">{{faq.answer}} </h6>\n' +
    '      </li>\n' +
    '    </ul>\n' +
    '  </div>\n' +
    '\n' +
    '\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('friendWishlist');
} catch (e) {
  module = angular.module('friendWishlist', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('friend-wishlist/friend-wishlist.html',
    '<div class="main_container">\n' +
    '\n' +
    '  <div class="profile container col-xs-3">\n' +
    '    <div class="pro_pic_container col-xs-10">\n' +
    '      <img ng-src="https://graph.facebook.com/{{pro_pic}}/picture?type=large" class="col-xs-12 pro_pic">\n' +
    '    </div>\n' +
    '    <div class="pro_info col-xs-10">\n' +
    '      <p><i class="fa fa-user"></i>\n' +
    '        <a href=""></a>\n' +
    '        {{display_name}}\n' +
    '      </p>\n' +
    '      <p><i class="fa fa-birthday-cake"></i> {{birthday}}</p>\n' +
    '      <p class="email_address"><i class="fa fa-envelope-o"></i>{{email}}</p>\n' +
    '      <p>Followers: {{followers}} </p>\n' +
    '      <p>Following: {{following}} </p>\n' +
    '      <button ng-click="followUser(user)">\n' +
    '        <div class="btn btn-primary"  ng-if="follow" ng-mouseover="unfollowBtnShow()">Following</div>\n' +
    '        <div ng-show="unfollow" class="btn btn-danger" ng-mouseout="followBtnShow()">Unfollow </div>\n' +
    '        <div class="btn btn-primary"  ng-if="!follow && !unfollow">Follow</div>\n' +
    '      </button>\n' +
    '      <!-- add block this person feature into setting -->\n' +
    '<!--       <button ng-click="goToSettings()" class="btn btn-info settings">\n' +
    '        <i class="fa fa-cog" aria-hidden="true"></i>\n' +
    '      </button> -->\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="wishlist_container container col-xs-8" ng-if="!settings">\n' +
    '    <div class="title_container">\n' +
    '      <h2 class="my_wishlist_title">My WishList</h2>\n' +
    '      <button ng-click="star(user)" ng-class="yellowStar">\n' +
    '        <i class="fa fa-star"></i>\n' +
    '      </button>\n' +
    '    </div>\n' +
    '    <div class="top_container">\n' +
    '      <!-- <div class="col-xs-offset-3 col-xs-5 like_share_container" data-href="https://www.facebook.com/giftsgenies" data-layout="standard" data-action="like" data-show-faces="true" data-share="true" data-ref="referred" action="recommend"></div> -->\n' +
    '    </div>\n' +
    '    <div class="bottom_container">\n' +
    '      <button type="button" class="btn btn-primary-lg add_btn col-xs-pull-1" data-toggle="modal" data-target="#myModal"> <i class="fa fa-plus-circle"></i></button>\n' +
    '      <input type="text" placeholder="Search Wishlist" ng-model="search" class="searchItems">\n' +
    '      <ol ui-sortable ng-model="items" class="wishlist_items" >\n' +
    '        <li class="wishlist_items_container" ng-repeat="item in items | filter:search">\n' +
    '          <a href="{{item.link}}" class="wishlist_item" target="_blank"> {{item.name}} </a>\n' +
    '          <i class="fa fa-heart-o" ng-click="like_item(item, $index)" ng-class="{liked_item : like_heart.indexOf($index) > -1  }"> </i>\n' +
    '          <!-- <i class="fa fa-pencil-square-o" ng-click="edit(item)" data-toggle="modal" data-target="#edit"></i> -->\n' +
    '          <!-- <i class="fa fa-trash" ng-click="delete(item, $index)"></i> -->\n' +
    '        </li>\n' +
    '      </ol>\n' +
    '    </div>\n' +
    '    <div class="fb_comments_container">\n' +
    '<!--       <div class="fb-comments" data-href="http://localhost:3000/#/my-wishlist" data-numposts="5" data-order=by="social" data-width="280"></div>\n' +
    ' -->      <!-- this is for when the app is deployed -->\n' +
    '      <!-- <div class="fb-comments" data-href="https://giftsgenies.herokuapp.com/#/" data-width="464" data-numposts="10"></div> -->\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('home');
} catch (e) {
  module = angular.module('home', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('home/home.html',
    '<div class="logo_container">\n' +
    '  <h1 class="logo">GiFTGENiE</h1>\n' +
    '  <p class="logo">No More Unwanted Gifts</p>\n' +
    '</div>\n' +
    '\n' +
    '<div class="home_container">\n' +
    '  <div class="button_container">\n' +
    '<!--       make sure there is no slash after my-wishlist or it will screw up\n' +
    '    the reason is because its already defined in app.routes.js\n' +
    '    so id is automatically put into the url because its defined in app.routes.js -->\n' +
    '    <button ng-click="authenticate(\'facebook\')" class="fb_btn" ui-sref="my-wishlist({id: facebookId})">\n' +
    '      <img src="dist/images/facebook.jpg" alt="facebook-logo" class="fb_logo">\n' +
    '      Login with Facebook\n' +
    '    </button>\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<!-- <video src="./images/love.mp4" alt="Cutie" class="rach video" autoplay muted> -->\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('myWishlist');
} catch (e) {
  module = angular.module('myWishlist', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('my-wishlist/my-wishlist.html',
    '<div class="main_container">\n' +
    '\n' +
    '  <div class="profile container col-xs-3">\n' +
    '    <div class="pro_pic_container col-xs-10">\n' +
    '      <img ng-src="https://graph.facebook.com/{{pro_pic}}/picture?type=large" class="col-xs-12 pro_pic">\n' +
    '    </div>\n' +
    '    <div class="pro_info col-xs-10">\n' +
    '      <p><i class="fa fa-user"></i>\n' +
    '        <a href=""></a>\n' +
    '        {{display_name}}\n' +
    '      </p>\n' +
    '      <p><i class="fa fa-birthday-cake"></i> {{birthday}}</p>\n' +
    '      <p class="email_address"><i class="fa fa-envelope-o"></i>{{email}}</p>\n' +
    '      <p>Followers: {{followers}} </p>\n' +
    '      <p>Following: {{following}} </p>\n' +
    '\n' +
    '<!--       <button class="btn btn-primary" ng-class="{follow_button: hover}" ng-mouseenter="hover=true" ng-mouseleave="hover=false">\n' +
    '        <div ng-if="hover">Unfollow</div>\n' +
    '        <div ng-if="!hover">Follow <span ng-if="alreadyFollowing">Following</span></div>\n' +
    '      </button> -->\n' +
    '\n' +
    '      <button ng-click="goToSettings()" class=" btn btn-info settings">\n' +
    '        <i class="fa fa-cog" aria-hidden="true"></i>\n' +
    '      </button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="wishlist_container container col-xs-8" ng-if="!settings">\n' +
    '    <div class="title_container">\n' +
    '      <h2 class="my_wishlist_title">My WishList</h2>\n' +
    '\n' +
    '<!--       <button ng-click="favoriteWishlist = !favoriteWishlist; star(user);" ng-class="{star_btn: favoriteWishlist}">\n' +
    '        <i class="fa fa-star"></i>\n' +
    '      </button> -->\n' +
    '    </div>\n' +
    '    <div class="top_container">\n' +
    '      <!-- <div class="col-xs-offset-3 col-xs-5 like_share_container" data-href="https://www.facebook.com/giftsgenies" data-layout="standard" data-action="like" data-show-faces="true" data-share="true" data-ref="referred" action="recommend"></div> -->\n' +
    '    </div>\n' +
    '    <div class="bottom_container">\n' +
    '      <button type="button" class="btn btn-primary-lg add_btn col-xs-pull-1" data-toggle="modal" data-target="#myModal"> <i class="fa fa-plus-circle"></i></button>\n' +
    '      <input type="text" placeholder="Search Wishlist" ng-model="search" class="searchItems">\n' +
    '      <ol ui-sortable="sortableOptions" ng-model="items" class="wishlist_items" >\n' +
    '        <li class="wishlist_items_container" ng-repeat="item in items | filter:search">\n' +
    '          <a href="{{item.link}}" class="wishlist_item" target="_blank"> {{item.name}} </a>\n' +
    '<!--           <i class="fa fa-heart-o" ng-click="like_heart = !like_heart; like_item(item)" ng-class="{liked_item: like_heart}"></i>\n' +
    ' -->          <i class="fa fa-pencil-square-o" ng-click="edit(item)" data-toggle="modal" data-target="#edit"></i>\n' +
    '          <i class="fa fa-trash" ng-click="delete(item, $index)"></i>\n' +
    '        </li>\n' +
    '      </ol>\n' +
    '    </div>\n' +
    '    <div class="fb_comments_container">\n' +
    '<!--       <div class="fb-comments" data-href="http://localhost:3000/#/my-wishlist" data-numposts="5" data-order=by="social" data-width="280"></div>\n' +
    ' -->      <!-- this is for when the app is deployed -->\n' +
    '      <!-- <div class="fb-comments" data-href="https://giftsgenies.herokuapp.com/#/" data-width="464" data-numposts="10"></div> -->\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<!-- settings -->\n' +
    '\n' +
    '<div class="main_container" ng-if="settings">\n' +
    '  <div class="wishlist_container container col-xs-8">\n' +
    '    <div class="title_container">\n' +
    '      <h2 class="my_wishlist_title">Settings Container</h2>\n' +
    '      <div ng-click="backToWlist()"><a>Back To My WishList</a></div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="top_container">\n' +
    '      Privacy:\n' +
    '      <input type="radio" name="privacy" value="public" ng-click="makePublic()" checked> Public\n' +
    '      <input type="radio" name="privacy" value="private" ng-click="makePrivate()"> Private\n' +
    '      <div ng-if="public">Your Account is Public</div>\n' +
    '      <div ng-if="private">Your Account is Private</div>\n' +
    '    </div>\n' +
    '\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<!-- Modal -->\n' +
    '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n' +
    '  <div class="modal-dialog" role="document">\n' +
    '    <div class="modal-content">\n' +
    '      <div class="modal-header">\n' +
    '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
    '        <h4 class="modal-title" id="myModalLabel">Add an Item to your WishList</h4>\n' +
    '      </div>\n' +
    '      <div class="modal-body">\n' +
    '        <input type="text" placeholder="Link" ng-model="item.link" > <br>\n' +
    '        <input type="text" placeholder="Item Name" ng-model="item.name">\n' +
    '      </div>\n' +
    '      <div class="modal-footer">\n' +
    '        <button type="button" class="btn btn-primary" ng-click="add(item, user)" data-dismiss="modal">Save changes</button>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<div class="modal fade" id="edit" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" ng-keydown="$event.which === 13 && save_changes(item, editItemId)">\n' +
    '  <div class="modal-dialog" role="document">\n' +
    '    <div class="modal-content">\n' +
    '      <div class="modal-header">\n' +
    '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
    '        <h4 class="modal-title" id="myModalLabel">Edit Your Item</h4>\n' +
    '      </div>\n' +
    '      <div class="modal-body">\n' +
    '        <input type="text" placeholder="link" ng-model="item.link" > <br>\n' +
    '        <input type="text" placeholder="Item Name" ng-model="item.name">\n' +
    '      </div>\n' +
    '      <div class="modal-footer">\n' +
    '        <button type="button" class="btn btn-primary" ng-click="save_changes(item, editItemId)" data-dismiss="modal">Save changes</button>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);
})();

(function(module) {
try {
  module = angular.module('starredLists');
} catch (e) {
  module = angular.module('starredLists', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('starred-lists/starred-lists.html',
    '<div class="main_container">\n' +
    '\n' +
    '  <div class="profile container col-xs-3">\n' +
    '    <input type="text" placeholder="search by facebook name" class="search_fb col-xs-10" ng-model="user.name">\n' +
    '    <div class="pro_pic_container col-xs-10">\n' +
    '      <!-- the following info will only be seen once searched and clicked on -->\n' +
    '      <video src="dist/images/love.mp4" class="col-xs-12 pro_pic" autoplay loop muted></video>\n' +
    '    </div>\n' +
    '    <div class="pro_info col-xs-10">\n' +
    '      <p>{{display_name}}</p>\n' +
    '      <p>{{email}}</p>\n' +
    '      <p>{{birthday}}</p>\n' +
    '      <button ng-click="star()" class="star_btn"><i class="fa fa-star"></i></button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="wishlist_container container col-xs-8">\n' +
    '    <div class="title_container">\n' +
    '      <h2 class="my_wishlist_title">Starred</h2>\n' +
    '    </div>\n' +
    '    <div class="bottom_container col-xs-12">\n' +
    '\n' +
    '    <div ng-model="favorites">\n' +
    '      <div ng-repeat="favorite in favsModel | filter:favorite.name">\n' +
    '        <div class="user_card col-xs-12 col-sm-6" ng-click="goToOthers(favorite)">\n' +
    '\n' +
    '          <img ng-src="https://graph.facebook.com/{{favorite.id}}/picture?type=large" ng-click="show_user_info()"></img>\n' +
    '          <!-- <h6 class="user_name" ng-if="clicked_card">{{favorite.name}}</h6> -->\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '</div>\n' +
    '');
}]);
})();
