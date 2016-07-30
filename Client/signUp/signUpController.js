angular.module('signUpController', ['app'])

  .controller('signUpController', ['$scope', 'auth', '$window', 'signUpFactory', function ($scope, auth, $window, signUpFactory) {
  $scope.postUser = loginFactory.postUser;

  }])

  .factory("signUpFactory", function($http){
    var postUser = function(email, password){
      console.log(email, password);
      $http({
        method: "POST",
        url: "/signUp",
        data: {
          email: email,
          password: password
        }
      })
      .then(function(resp){
        return resp;
      })
      .catch(function(err){
        console.log(err);
      })
    };
    return {
      postUser: postUser
    };
  });