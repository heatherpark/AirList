angular.module('loginController', ['app'])

 .controller('loginController', ['$scope', 'auth', '$window', '$location', function ($scope, auth, $window, $location) {
 //sets the users email address in localStorage. Signs them in
    $scope.doLogin = function(){
        auth.signin({
          email: $scope.email,
          password: $scope.password,
          connection: 'Username-Password-Authentication'
        });
    }

    $scope.loginWithFacebook = function(){
      auth.signin({
        connection: 'facebook'
      });
    }
//clears the profile and JWT token from localStorage, effectively logging the person out and returning them to the home.html page where it will ask them to log in again.
    $scope.logout = function() {
      window.localStorage.clear();
      auth.signout();
      $location.path('/login');
   };

//Fired when a user clicks on the 'Contact Owner' button. It will open their default mail client with a prefilled message and subject
   $scope.sendEmail = function(item){
     var subj = "Inquiry regarding " + item.name;
     var message = "Dear item owner,"
     $window.open("mailto:" + item.email + "?subject=" + subj + "&body=" + message, "_self");
   };
}]);



