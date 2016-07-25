angular.module('app.homeController', ['app.userAccountController', 'app.loginController'])

  .controller('mainController', function($scope, $http, $window, mainFactory){

    $scope.env = $window.location.href.split('#');
    navigator.geolocation.getCurrentPosition(function(position) {
      $scope.position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    });

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

    $scope.initMap = function(entry, index){
      if(entry.latitude && entry.longitude){
        var map = new google.maps.Map(document.getElementById('listentry-' + index), {
          center: {lat: entry.latitude, lng: entry.longitude},
          zoom: 12
        });
      }
    }

    $scope.refresh = function(){
      mainFactory.refreshed().then(function(res){
        $scope.lists = res.data;
      });
    }

    $scope.queryUpdater = function(){
      mainFactory.refreshed().then(function(data){ $scope.query = data});
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
        $scope.lists = res.data
        setTimeout(function() {
          $scope.lists.forEach($scope.initMap);
          $scope.$apply();
        }, 1);
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
      $scope.email = JSON.parse(window.localStorage.profile).email;
      refreshUserListings();
    }

    $scope.addItem = function(post){
      post.email = JSON.parse(window.localStorage.profile).email;
      post.longitude = $scope.position.lng;
      post.latitude = $scope.position.lat;
      $http({
        method:'POST',
        url: '/listings',
        data: post
      }).then(refreshUserListings);
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
      }).then(refreshUserListings);
    };

    $scope.remove = function(item) {
      $http.delete('/listings/' + item._id).success(function(res) {
        refreshUserListings();
      });
    };
  })

  .factory('mainFactory', function($http, $window) {
    var refreshed = function() {
      return $http.get('/listings');
    };
    return {
      refreshed: refreshed,
    };
  });