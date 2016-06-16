'use strict';

angular
  .module('App')
  .controller('faqCtrl', ['$rootScope', '$scope', 'getUser', faqCtrl])

function faqCtrl($rootScope, $scope, getUser){
  $rootScope.display_name = getUser.data.displayName

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