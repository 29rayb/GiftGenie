'use strict';

angular
  .module('App')
  .controller('VersionCtrl', ['$rootScope', VersionCtrl])

function VersionCtrl($rootScope){

  var token = 'in faq'
  localStorage.setItem('faq', token)

  if (!localStorage.getItem('satellizer_token')){
    $rootScope.infaq = localStorage.getItem('faq')
    console.log('!@#!@#!@#!@#!@#@!3', $rootScope.infaq)
  } else {
    $rootScope.infaq = localStorage.removeItem('faq')
    console.log('$rootScope.infaq', $rootScope.infaq)
  }

}