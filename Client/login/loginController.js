angular.module('app.loginController', ['app'])

 .controller('loginController', ['$scope', 'auth', '$window', function ($scope, auth, $window) {
    $scope.login = function(){
      if(!window.localStorage.profile) {
        auth.signin();
      }
    }

    $scope.logout = function() {
    window.localStorage.clear();
    $window.location.href ='https://dilp.auth0.com/v2/logout?returnTo=' + $scope.env[0];
   }
  }])
