'use strict';

angular
  .module('App')
  .service('NavSvc', NavSvc)

NavSvc.$inject = ['$http']

function NavSvc($http){
  console.log('nav service')
}