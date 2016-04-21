'use strict';

angular
  .module('App')
  .service('NavSvc', NavSvc)

NavSvc.$inject = ['$http']

function NavSvc($http){
  console.log('NavBar Service Working.')
  // this.get_fb_pro_pic = function(cb){
  //   $http.get('/auth')
  //     .then(function(resp){
  //       console.log(resp);
  //     }, function(err){
  //       console.log(err)
  //     })
  //   }
}


