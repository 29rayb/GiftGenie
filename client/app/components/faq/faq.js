'use strict';

angular
  .module('App')
  .controller('faqCtrl', ['$rootScope', '$scope', faqCtrl])

function faqCtrl($rootScope, $scope){

  var token = 'in faq'
  localStorage.setItem('faq', token)
  // $scope.infaq = localStorage.getItem('faq')

  if (!localStorage.getItem('satellizer_token')){
    $rootScope.infaq = localStorage.getItem('faq')
    // $rootScope.infaq = true;
    console.log('!@#!@#!@#!@#!@#@!3', $rootScope.infaq)
  } else {
    $rootScope.infaq = localStorage.removeItem('faq')
    console.log('$rootScope.infaq', $rootScope.infaq)
  }



  $scope.faqs =  [
            {question: "1. Why arent my links working?",
            answer: "Make sure you have the http(s):/ /www; The best way to accomplish copying the links is by copying the url & simply plasting it in the input box."},
            {question: "2. 2nd",
            answer: "2nd"},
            {question: "3. 3rd",
            answer: "3rd"}
          ];

  $scope.getAnswer = () => {
    $scope.showAnswer ? $scope.showAnswer = false : $scope.showAnswer = true;
  }

}