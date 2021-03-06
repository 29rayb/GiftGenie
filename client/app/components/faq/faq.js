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
      answer: "Only your Facebook friends who are already using the app can be seen" },
    {question: "5. I try to use the app on my iPhone using Safari, but I'm having issues",
      answer: "Go to settings --> safari --> privacy & security --> block cookies --> allow from websites I visit. Also make sure you have JavaScript enabled in the Advanced Section"},
    {question: "6. It's not working on my web browser (Google Chrome, Safari, FireFox, etc.). How can I fix it?",
      answer: "Extensions like Adblock might interfere with the Login with Facebook button, preventing you from logginong onto the app"}
  ];

  $scope.getAnswer = ($index) => {
    console.log(' SHOULD BE index of question', $index)
    $scope.showAnswer == $index ? $scope.showAnswer = false : $scope.showAnswer = $index;
  }

}