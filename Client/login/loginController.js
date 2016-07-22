angular.module('app.loginController', ['app'])

 .controller('loginController', ['$scope', 'auth', '$window', function ($scope, auth, $window) {
    $scope.login = function(){
      if(!window.localStorage.profile) {
        auth.signin();
      }
    };

    $scope.logout = function() {
      window.localStorage.clear();
      $window.location.href ='https://dilp.auth0.com/v2/logout?returnTo=' + $scope.env[0];
   };

   $scope.sendEmail = function(item){
     var subj = "Inquiry regarding " + item.name;
     var message = "Dear item owner,"
     $window.open("mailto:" + item.email + "?subject=" + subj + "&body=" + message, "_self");
   };
  }])
