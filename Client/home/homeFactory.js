angular.module('homeFactory', ['userAccountController', 'loginController'])

  .factory('homeFactory', function($http, $window) {

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

    var queryUpdater = function(){
      getListings().then(function(data){ this.query = data});
    }

    var goToUserAcc = function() {
      $window.location.href  = $window.location.href + 'userAccount'
    }

    var viewAllListings = function() {
      $window.location.href = $window.location.origin;
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
    var getListings = function() {
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


    var refreshUserListings = function() {
      return $http({
        method:'GET',
        url: '/listings'
      });
    }

    var remove = function(item) {
      $http.delete('/listings/' + item._id)
      .then(this.refreshUserListings);
    };

    return {
      env: env,
      getListings: getListings,
      options: options,
      addCategory: addCategory,
      initMap: initMap,
      queryUpdater: queryUpdater,
      goToUserAcc: goToUserAcc,
      viewAllListings: viewAllListings,
      refreshUserListings: refreshUserListings,
      search: search,
      yourListings: yourListings,
      addItem: addItem,
      rent: rent,
      returnItem: returnItem,
      remove: remove
    };
   //functions that are used on both userAccount.html and home.html can be put in here so they can be shared across the controllers
  });