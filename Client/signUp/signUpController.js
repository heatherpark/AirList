angular.module('signUpController', ['app'])


  .controller('signUpController', ['$scope', 'auth', '$window', '$http', function ($scope, auth, $window, $http){

    $scope.signUp = function(email, password){
      auth.signup({
        email: email,
        password: password,
        connection: 'Username-Password-Authentication',
        username: 'Dude234'
      })
    }
  }])