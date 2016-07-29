angular.module('app.homeController', ['app.userAccountController', 'app.loginController'])

  .controller('mainController', function($scope, $http, $window, mainFactory){

  //this gets the users current location within the app
    $scope.env = mainFactory.env;

  //this asks the user to provide their location. If they agree, the users longitude and latitude will be stored. This will be used later as the position when the user adds an item from the userAccount page.
    navigator.geolocation.getCurrentPosition(function(position) {
      $scope.position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    });

  //sets up the category options
    $scope.options = mainFactory.options;
    $scope.addCategory = mainFactory.addCategory;

  //creates a map based on the passed in parameters. This is reused on each listing that shows on the home.html page
    $scope.initMap = mainFactory.initMap;

  //pulls the latest data from the server. Used many times throughout the app to ensure latest data in the scope 'lists' variable
    $scope.refresh = mainFactory.refresh;

  //basically the same thing as 'refresh' above, but it updates a different scope variable, 'query' instead of 'lists'
    $scope.queryUpdater = mainFactory.queryUpdater;

  //again, similar to refresh above, but causes unknown bug when refactor is tried. Can be placed in a shared factory instead of here.
    $scope.refreshUserListings = function() {
      $http({
        method:'GET',
        url: '/listings'
      }).success(function(res) {
        $scope.yourItems = res;
        console.log('hello');
      });
    }

  //serves the userAccount.html page into ng-view on index.html
    $scope.goToUserAcc = mainFactory.goToUserAcc;

  //serves the home.html page into ng-view on index.html
    $scope.viewAllListings = mainFactory.viewAllListings;
  //refresh general listings and creates a new map per item via settimeout and forEach
    $scope.generalListings = mainFactory.generalListings;

  //searches the database based on the category
    $scope.search = mainFactory.search;

    $scope.yourListings = mainFactory.yourListings;

  //adds a post to the database, using the person's username grabbed from localStorage. Can be placed in the userAccountController instead
    $scope.addItem = mainFactory.addItem;

  //rents an item by changing it's rentable status in the db to false. When two people click on an item to rent, it can cause an error.
    $scope.rent = mainFactory.rent;

  //reverse of above, it changes status to true, and deletes the 'renter' prop out of the item field. Then it refreshes the userListings. Can be placed in the userAccountController instead.
    $scope.returnItem = mainFactory.returnItem;

  //this removes an item from the database. Only users can delete their own items. Can be placed in the userAccountController instead
    $scope.remove = mainFactory.remove;
})

  .factory('mainFactory', function($http, $window) {

   var env = $window.location.href.split('#');

   var options = [
      {category: "All Departments"},
      {category: "Books"},
      {category: "Cars"},
      {category: "Electronics"},
      {category: "Furniture"},
      {category: "Jewelry"},
      {category: "Sporting Goods"},
      {category: "Toys+Games"}
    ];

    var addCategory = [
      {category: "Books"},
      {category: "Cars"},
      {category: "Electronics"},
      {category: "Furniture"},
      {category: "Jewelry"},
      {category: "Sporting Goods"},
      {category: "Toys+Games"}
    ];

    var initMap = function(entry, index){
      if(entry.latitude && entry.longitude){
        var map = new google.maps.Map(document.getElementById('listentry-' + index), {
          center: {lat: entry.latitude, lng: entry.longitude},
          zoom: 12
        });
      }
    }

    var refresh = function(){
      refreshed().then(function(res){
        this.lists = res.data;
      });
    }

    var queryUpdater = function(){
      refreshed().then(function(data){ this.query = data});
    }

    var goToUserAcc = function() {
      $window.location.href  = $window.location.href + 'userAccount'
    }

    var viewAllListings = function() {
      $window.location.href = $window.location.origin;
    }

    var generalListings = function() {
      refreshed().then(function(res){
        this.lists = res.data
        setTimeout(function() {
          this.lists.forEach(initMap);
          this.$apply();
        }, 1);
      });
    }

    var search = function(category){
      if(category === "All Departments") {
        $http({
          method:'GET',
          url: '/listings'
        }).success(function(res) {
          this.query = res;
        });
      } else {
        $http({
          method:'GET',
          url: '/listings/category/' + category
        }).success(function(res) {
          this.query = res;
        });
      }
    };

    var yourListings = function() {
    //in order to sort by a person's listing, we grab their email address out of the localStorage. It was stored there after the person logged in with OAuth. If OAuth is not used, another method of getting their email must be used, or just set the person's email address in localStorage in the same place and let the existing code stay the same.
      this.email = JSON.parse(window.localStorage.profile).email;
      this.refreshUserListings();
    }

    var addItem = function(post){
      post.email = JSON.parse(window.localStorage.profile).email;
      if(this.position && this.position.lng && this.position.lat){
        post.longitude = this.position.lng;
        post.latitude = this.position.lat;
      }
      $http({
        method:'POST',
        url: '/listings',
        data: post
      }).then(this.refreshUserListings);
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

  //general refresh function
    var refreshed = function() {
      return $http.get('/listings');
    };

    var returnItem = function(item){
      item.rentable = true;
      delete item.renter;
      var newItem = item;
      $http({
        method: 'PUT',
        url: '/listings/' + item._id,
        data: newItem
      }).then(this.refreshUserListings);
    };

    var remove = function(item) {
      $http.delete('/listings/' + item._id).success(function(res) {
        this.refreshUserListings();
      });
    };

    return {
      env: env,
      refreshed: refreshed,
      options: options,
      addCategory: addCategory,
      initMap: initMap,
      refresh: refresh,
      queryUpdater: queryUpdater,
      goToUserAcc: goToUserAcc,
      viewAllListings: viewAllListings,
      generalListings: generalListings,
      search: search,
      yourListings: yourListings,
      addItem: addItem,
      rent: rent,
      returnItem: returnItem,
      remove: remove
    };
   //functions that are used on both userAccount.html and home.html can be put in here so they can be shared across the controllers
  });