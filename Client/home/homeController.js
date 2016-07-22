angular.module('app.homeController', ['app.userAccountController', 'app.loginController'])

 .controller('LoginCtrl', ['$scope', 'auth', function ($scope, auth) {
    $scope.login = function(){
      if(!window.localStorage.profile) {
        auth.signin();
      }
    }
  }])

 .controller('mainController', function($scope, $http, $window){

    $scope.env = $window.location.href.split('#');

   $scope.options = [
     {category: "All Departments"},
     {category: "Books"},
     {category: "Cars"},
     {category: "Electronics"},
     {category: "Furniture"},
     {category: "Jewelry"},
     {category: "Sporting Goods"},
     {category: "Toys/Games"}
   ];

   $scope.addCategory = [
     {category: "Books"},
     {category: "Cars"},
     {category: "Electronics"},
     {category: "Furniture"},
     {category: "Jewelry"},
     {category: "Sporting Goods"},
     {category: "Toys/Games"}
   ];

   var refresh = function() {
      $http({
       method:'GET',
       url: '/listings'
     }).success(function(res) {
       $scope.lists = res;
     });
   };

   var queryUpdater = function() {
      $http({
       method:'GET',
       url: '/listings'
     }).success(function(res) {
       $scope.query = res;
       console.log('updating scope.query')
     });
   }

   var refreshUserListings = function() {
      $http({
       method:'GET',
       url: '/listings'
     }).success(function(res) {
       $scope.yourItems = res;
     });
   }

   $scope.goToUserAcc = function() {
    $window.location.href  = $window.location.href + 'userAccount'
   }

   $scope.viewAllListings = function() {
    $window.location.href = $window.location.origin;

   }

   $scope.logout = function() {
    window.localStorage.clear();
    $window.location.href ='https://dilp.auth0.com/v2/logout?returnTo=' + $scope.env[0];
   }

   $scope.generalListings = function() {
      $http({
       method:'GET',
       url: '/listings'
     }).success(function(res) {
       $scope.lists = res;
       console.log(res);
     });
   }

   $scope.search = function(category){
     if(category === "All Departments") {
        $http({
         method:'GET',
         url: '/listings'
       }).success(function(res) {
         $scope.query = res;
       });
     } else {
       $http({
         method:'GET',
         url: '/listings/category/' + category
       }).success(function(res) {
         $scope.query = res;
       });
     }
   };

   $scope.yourListings = function() {
      $http({
       method:'GET',
       url: '/listings'
     }).success(function(res) {
       $scope.yourItems = res;
     });
    $scope.email = JSON.parse(window.localStorage.profile).email;
    console.log($scope.email);
     refreshUserListings();
   }

   $scope.addItem = function(post){
    post.email = JSON.parse(window.localStorage.profile).email;
     $http({
       method:'POST',
       url: '/listings',
       data: post
     });
     refresh();
     refreshUserListings();
   };

   $scope.rent = function(item){
     item.rentable = false;
     item.renter = JSON.parse(window.localStorage.profile).email;
     $http({
       method: 'PUT',
       url: '/listings/' + item._id,
       data: item
     });
   };

   $scope.return = function(item){
     item.rentable = true;
     delete item.renter;
     var newItem = item;
     $http({
       method: 'PUT',
       url: '/listings/' + item._id,
       data: newItem
     });
    // refreshUserListings();
   };

   $scope.remove = function(item) {
     $http.delete('/listings/' + item._id).success(function(res) {
       refresh();
       refreshUserListings();
     });
   };


 });