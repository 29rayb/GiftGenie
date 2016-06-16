'use strict';

angular
  .module('App')
  .controller('HomeCtrl', ['$scope', '$state', '$auth', '$http', '$rootScope', 'UserSvc', HomeCtrl])

function HomeCtrl($scope, $state, $auth, $http, $rootScope, UserSvc){
  $scope.authenticate = function(provider, user) {
    $auth.authenticate(provider, user)
    .then(function(res) {
      console.log(res, 'This is the auth response in Home Ctlr.');
      var token = res.data;
      console.log(token, "This is our token. We're inside Home Ctlr.")
      UserSvc.getProfile()
      .then(function(res) {
        console.log(res, "RESPONSE FROM THE CALLLLLLLLLLLLLL*");
        // $scope.loggedInPerson = res.data;
        console.log('DATA ID INSIDE!!!!!!!', res.data._id);
        var idWeNeed = res.data.facebook;
        console.log(idWeNeed, 'id NEEDED');
        console.log(res.data, 'res.data');
        $scope.id = idWeNeed;
        // var facebookId = res.data.facebook;
        // $rootScope.facebookid = facebookId;
      })
      .catch((err) => {
        console.error(err, 'Inside UserSvc After Auth.authenticate, we have an error!');
      });
      console.log('$rootscope', $rootScope.birthday);
      console.log('$scope', $scope);
      $state.go('my-wishlist')
    })
    .catch((err) => {
      console.error('Inside the Home Ctrl, we have an error!', err);
    });
  };
}
