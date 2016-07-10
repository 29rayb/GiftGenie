'use strict';

angular
  .module('App')
  .controller('faqCtrl', faqCtrl)

faqCtrl.$inject = ['$rootScope', '$scope']

function faqCtrl($rootScope, $scope){

  localStorage.setItem('faq', 'in faq')

  !localStorage.getItem('satellizer_token') ? $rootScope.infaq = localStorage.getItem('faq') : $rootScope.infaq = localStorage.removeItem('faq');

  $scope.faqs =  [
    {question: "1. Why arent my links working?",
      answer: "Make sure you have the http(s):/ /www; The best way to accomplish copying the links is by copying the url & simply plasting it in the input box."},
    {question: "2. I have ideas to improve the app; How can I let you guys know?",
      answer: "Simply click the email icon on the bottom and email us!"},
    {question: "3. Can I share this with my friends?",
      answer: "The app is currently in beta; please limit invites to just 5 friends"},
    {question: "4. Why can't I see anyone in the searchbar?",
      answer: "Only your Facebook friends who are already using the app can be seen" }
  ];

  $scope.getAnswer = () => {
    $scope.showAnswer ? $scope.showAnswer = false : $scope.showAnswer = true;
  }

}