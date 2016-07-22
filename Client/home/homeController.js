angular.module('app.homeController', ['app.userAccountController', 'app.loginController'])

 .controller('mainController', function($scope, $http, $window, mainFactory){

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

   $scope.returnItem = function(item){
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
 }).factory('mainFactory', function($http, $window) {
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
   };

  var refreshUserListings = function() {
    $http({
     method:'GET',
     url: '/listings'
     }).success(function(res) {
       $scope.yourItems = res;
     });
   };

   var generalListings = function() {
      $http({
       method:'GET',
       url: '/listings'
     }).success(function(res) {
       $scope.lists = res;
       console.log(res);
     });
   };

   var search = function(category){
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

   var yourListings = function() {
      $http({
       method:'GET',
       url: '/listings'
     }).success(function(res) {
       $scope.yourItems = res;
     });
    $scope.email = JSON.parse(window.localStorage.profile).email;
    console.log($scope.email);
     refreshUserListings();
   };

  var addItem = function(post){
    post.email = JSON.parse(window.localStorage.profile).email;
     $http({
       method:'POST',
       url: '/listings',
       data: post
     });
     refresh();
     refreshUserListings();
   };

  var rent = function(item){
     item.rentable = false;
     item.renter = JSON.parse(window.localStorage.profile).email;
     $http({
       method: 'PUT',
       url: '/listings/' + item._id,
       data: item
     });
   };

   var returnItem = function(item){
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

   var remove = function(item) {
     $http.delete('/listings/' + item._id).success(function(res) {
       refresh();
       refreshUserListings();
     });
   };

  return {refresh:refresh,
    queryUpdater:queryUpdater,
    refreshUserListings:refreshUserListings,
    generalListings:generalListings,
    search: search,
    yourListings: yourListings,
    addItem: addItem,
    rent:rent,
    returnItem:returnItem,
    remove:remove
  }
 });