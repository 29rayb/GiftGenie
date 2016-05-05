(function(module) {
try {
  module = angular.module('home');
} catch (e) {
  module = angular.module('home', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('home/home.html',
    '  <!-- <img src="./images/gift-wrapper.png" alt="gift-wrapper" class="wrapper"> -->\n' +
    '\n' +
    '  <div class="logo_container">\n' +
    '    <h1 class="logo">GiFTGENiE</h1>\n' +
    '    <p class="logo">No More Unwanted Gifts</p>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="home_container">\n' +
    '    <div class="button_container">\n' +
    '<!--       make sure there is no slash after my-wishlist or it will screw up\n' +
    '      the reason is because its already defined in app.routes.js\n' +
    '      so id is automatically put into the url because its defined in app.routes.js -->\n' +
    '      <button ng-click="authenticate(\'facebook\')" class="fb_btn" ui-sref="my-wishlist({id: facebookId})">\n' +
    '        <img src="./images/facebook.jpg" alt="facebook-logo" class="fb_logo">\n' +
    '        Login with Facebook\n' +
    '      </button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '<video src="./images/love.mp4" alt="Cutie" class="rach video" autoplay loop muted>\n' +
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
    '      <p>{{display_name}}</p>\n' +
    '      <p>{{email}}</p>\n' +
    '      <p>{{birthday}}</p>\n' +
    '      <button ng-click="star()" class="star_btn"><i class="fa fa-star"></i></button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="wishlist_container container col-xs-8">\n' +
    '    <div class="title_container">\n' +
    '      <h2 class="my_wishlist_title">My WishList</h2>\n' +
    '    </div>\n' +
    '    <div class="top_container">\n' +
    '      <div class="fb-like col-xs-offset-3 col-xs-5 like_share_container" data-href="https://www.facebook.com/giftsgenies" data-layout="standard" data-action="like" data-show-faces="true" data-share="true" data-ref="referred" action="recommend"></div>\n' +
    '    </div>\n' +
    '    <div class="bottom_container">\n' +
    '      <button type="button" class="btn btn-primary-lg add_btn col-xs-pull-1" data-toggle="modal" data-target="#myModal"> <i class="fa fa-plus-circle"></i></button>\n' +
    '      <input type="text" placeholder="search saved items" ng-model="search" class="items">\n' +
    '      <ol ui-sortable ng-model="items" class="wishlist_items" >\n' +
    '        <li class="wishlist_items_container" ng-repeat="item in items | filter:search">\n' +
    '          <a href="{{item.link}}" class="wishlist_item" target="_blank"> {{item.name}} </a>\n' +
    '          <i class="fa fa-pencil-square-o" ng-click="edit(item)" data-toggle="modal" data-target="#edit"></i>\n' +
    '          <i class="fa fa-trash" ng-click="delete(item, $index)"></i>\n' +
    '        </li>\n' +
    '      </ol>\n' +
    '    </div>\n' +
    '    <div class="fb_comments_container">\n' +
    '      <div class="fb-comments" data-href="http://localhost:3000/#/my-wishlist" data-numposts="5" data-order=by="social" data-width="280"></div>\n' +
    '      <!-- this is for when the app is deployed -->\n' +
    '      <!-- <div class="fb-comments" data-href="https://giftsgenies.herokuapp.com/#/" data-width="464" data-numposts="10"></div> -->\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '\n' +
    '\n' +
    '<!-- Modal -->\n' +
    '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n' +
    '  <div class="modal-dialog" role="document">\n' +
    '    <div class="modal-content">\n' +
    '      <div class="modal-header">\n' +
    '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
    '        <h4 class="modal-title" id="myModalLabel" ng-click="getUserMongoId()">Add an Item to your WishList</h4>\n' +
    '      </div>\n' +
    '      <div class="modal-body">\n' +
    '        <input type="text" placeholder="link" ng-model="item.link" > <br>\n' +
    '        <input type="text" placeholder="Item Name" ng-model="item.name">\n' +
    '      </div>\n' +
    '      <div class="modal-footer">\n' +
    '        <button type="button" class="btn btn-primary" ng-click="add(item, user)" data-dismiss="modal">Save changes</button>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '\n' +
    '<div class="modal fade" id="edit" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n' +
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
    '\n' +
    '\n' +
    '<html>\n' +
    '    <head>\n' +
    '        <meta name="generator" content="HTML Tidy for Mac OS X (vers 31 October 2006 - Apple Inc. build 15.17), see www.w3.org">\n' +
    '        <title></title>\n' +
    '    </head>\n' +
    '    <body>\n' +
    '        <div class="main_container">\n' +
    '            <div class="profile container col-xs-3">\n' +
    '                <div class="pro_pic_container col-xs-10">\n' +
    '                    <img ng-src="https://graph.facebook.com/{{pro_pic}}/picture?type=large" class="col-xs-12 pro_pic">\n' +
    '                </div>\n' +
    '                <div class="pro_info col-xs-10">\n' +
    '                    <p>\n' +
    '                        {{display_name}}\n' +
    '                    </p>\n' +
    '                    <p>\n' +
    '                        {{email}}\n' +
    '                    </p>\n' +
    '                    <p>\n' +
    '                        {{birthday}}\n' +
    '                    </p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="wishlist_container container col-xs-8">\n' +
    '                <div class="title_container">\n' +
    '                    <h2 class="my_wishlist_title">\n' +
    '                        My WishList\n' +
    '                    </h2>\n' +
    '                </div>\n' +
    '                <div class="top_container">\n' +
    '                    <div class="fb-like col-xs-offset-3 col-xs-5 like_share_container" data-href="https://www.facebook.com/giftsgenies" data-layout="standard" data-action="like" data-show-faces="true" data-share="true" data-ref="referred" action="recommend"></div>\n' +
    '                </div>\n' +
    '                <div class="bottom_container">\n' +
    '                    <input type="text" placeholder="search saved items" ng-model="search" class="items">\n' +
    '                    <ol ui-sortable="" ng-model="items" class="wishlist_items">\n' +
    '                        <li class="wishlist_items_container" ng-repeat="item in items | filter:search">\n' +
    '                            <a href="{{item.link}}" class="wishlist_item" target="_blank">{{item.name}}</a>\n' +
    '                        </li>\n' +
    '                    </ol>\n' +
    '                </div>\n' +
    '                <div class="fb_comments_container">\n' +
    '                    <div class="fb-comments" data-href="http://localhost:3000/#/my-wishlist" data-numposts="5" data-order="by=&quot;social&quot;" data-width="280"></div><!-- this is for when the app is deployed -->\n' +
    '                    <!-- <div class="fb-comments" data-href="https://giftsgenies.herokuapp.com/#/" data-width="464" data-numposts="10"></div> -->\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div><!-- Modal -->\n' +
    '        <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n' +
    '            <div class="modal-dialog" role="document">\n' +
    '                <div class="modal-content">\n' +
    '                    <div class="modal-header">\n' +
    '                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&#215;</span></button>\n' +
    '                        <h4 class="modal-title" id="myModalLabel" ng-click="getUserMongoId()">\n' +
    '                            Add an Item to your WishList\n' +
    '                        </h4>\n' +
    '                    </div>\n' +
    '                    <div class="modal-body">\n' +
    '                        <input type="text" placeholder="link" ng-model="item.link"><br>\n' +
    '                        <input type="text" placeholder="Item Name" ng-model="item.name">\n' +
    '                    </div>\n' +
    '                    <div class="modal-footer">\n' +
    '                        <button type="button" class="btn btn-primary" ng-click="add(item, user)" data-dismiss="modal">Save changes</button>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="modal fade" id="edit" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n' +
    '            <div class="modal-dialog" role="document">\n' +
    '                <div class="modal-content">\n' +
    '                    <div class="modal-header">\n' +
    '                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&#215;</span></button>\n' +
    '                        <h4 class="modal-title" id="myModalLabel">\n' +
    '                            Edit Your Item\n' +
    '                        </h4>\n' +
    '                    </div>\n' +
    '                    <div class="modal-body">\n' +
    '                        <input type="text" placeholder="link" ng-model="item.link"><br>\n' +
    '                        <input type="text" placeholder="Item Name" ng-model="item.name">\n' +
    '                    </div>\n' +
    '                    <div class="modal-footer">\n' +
    '                        <button type="button" class="btn btn-primary" ng-click="save_changes(item, editItemId)" data-dismiss="modal">Save changes</button>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </body>\n' +
    '</html>\n' +
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
    '<!-- <div ng-init="items = []"></div> -->\n' +
    '\n' +
    '<div class="main_container">\n' +
    '\n' +
    '  <div class="container col-xs-3">\n' +
    '    <input type="text" placeholder="search by facebook name" class="search_fb col-xs-10">\n' +
    '    <div class="pro_pic_container col-xs-10">\n' +
    '      <!-- the following info will only be seen once searched and clicked on -->\n' +
    '      <video src="./images/rach.MOV" class="col-xs-12 pro_pic" autoplay loop muted></video>\n' +
    '    </div>\n' +
    '    <div class="pro_info col-xs-10">\n' +
    '      <p>MY NAME</p>\n' +
    '      <p>Email:</p>\n' +
    '      <p>Birthday:</p>\n' +
    '      <button ng-click="star()" class="star_btn"><i class="fa fa-star"></i></button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '  <div class="wishlist_container container col-xs-8">\n' +
    '    <div class="title_container">\n' +
    '      <h2 class="my_wishlist_title">Starred</h2>\n' +
    '    </div>\n' +
    '    <div class="bottom_container">\n' +
    '      <button ng-click="search(user)">Facebook Friend Wishlist Lookup</button>\n' +
    '      <!-- <input type="text" placeholder="search starred wishlists" ng-model="search"> -->\n' +
    '      <ol ui-sortable ng-model="items" class="wishlist_items">\n' +
    '        <li class="wishlist_items_container starred col-lg-4 col-xs-12 col-sm-6" ng-repeat="item in items | filter:search">\n' +
    '          <a href="" class="wishlist_item"><img src="http://m0.her.ie/wp-content/uploads/2014/06/grad-photo_opt.jpg" alt="" class="facebook_photo"></a>\n' +
    '          <a href="" ><p class="facebook_name">{{item.name}} </p></a>\n' +
    '          <i class="fa fa-star starred_wislist" ng-click="unstar($index)"></i>\n' +
    '        </li>\n' +
    '      </ol>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '\n' +
    '</div>\n' +
    '');
}]);
})();
