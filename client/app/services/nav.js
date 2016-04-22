'use strict';

angular
  .module('App')
  .service('NavSvc', NavSvc)

NavSvc.$inject = ['$http']

function NavSvc($http){
  console.log('NavBar Service Working.')
}


