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

   $scope.refresh = function(){
     mainFactory.refreshed().then(function(res){ $scope.lists = res.data});
   }

    $scope.queryUpdater = function(url){
      if (!url){
     mainFactory.refreshed().then(function(res){ $scope.query = res.data});

      } else {
        mainFactory.refreshed().then(function(res){ $scope.query = res.data});
      }
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
    mainFactory.refreshed().then(function(res){
      console.log(res);
      console.log(res.data);
      $scope.lists = res.data
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
     refreshUserListings();
   }

   $scope.addItem = function(post){
    post.email = JSON.parse(window.localStorage.profile).email;
     $http({
       method:'POST',
       url: '/listings',
       data: post
     });
     $scope.refresh();
     refreshUserListings();
   };

   $scope.rent = function(item){
     item.rentable = false;
     item.renter = JSON.parse(window.localStorage.profile).email;
     var url =
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
     console.log(newItem);
     $http({
       method: 'PUT',
       url: '/listings/' + item._id,
       data: newItem
     });
     console.log('returning item')
    refreshUserListings();
   };

   $scope.remove = function(item) {
     $http.delete('/listings/' + item._id).success(function(res) {
      refreshUserListings();
     });
   };
 })

//start of factory

 .factory('mainFactory', function($http, $window) {

    refreshed = function() {
      return $http.get('/listings');
    };


  return {
    refreshed:refreshed,
  }
 });