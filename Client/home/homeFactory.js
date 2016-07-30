angular.module('app.factories', ['userAccountController', 'loginController'])

  .config(['$routeProvider',  function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: '/index.html'
    });
  }])

  .factory('homeFactory', ['$http', '$window', 'socketio', function($http, $window, socketio) {

    socketio.on('my other event', function(data) {
      console.log(data);
    })

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
      $window.location.href = $window.location.href + 'userAccount'
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

    var addItem = function(post){
      post.email = JSON.parse(window.localStorage.profile).email;
      post.rentable = true;
      if(this.position && this.position.lng && this.position.lat){
        post.longitude = this.position.lng;
        post.latitude = this.position.lat;
      }
      socketio.emit('createItem', post);
    };

    var rent = function(item){
      console.log(item);
      item.rentable = false;
      item.renter = JSON.parse(window.localStorage.profile).email;
      socketio.emit('update', item);
    };

  //general refresh function
    var getListings = function() {
      return $http.get('/listings');
    };

    var returnItem = function(item){
      item.rentable = true;
      delete item.renter;
      var newItem = item;
      socketio.emit('update', newItem);
    };

    var yourListings = function() {
    //in order to sort by a person's listing, we grab their email address out of the localStorage. It was stored there after the person logged in with OAuth. If OAuth is not used, another method of getting their email must be used, or just set the person's email address in localStorage in the same place and let the existing code stay the same.
      this.email = JSON.parse(window.localStorage.profile).email;
      //this.refreshUserListings();
      socketio.emit('getUserItems', this.email);
    }

    socketio.on('yourListings', function() {
      yourListings();
    })


    var refreshUserListings = function() {
      return $http({
        method:'GET',
        url: '/listings'
      });
    }

    var remove = function(item) {
      // $http.delete('/listings/' + item._id)
      // .then(this.refreshUserListings);
      socketio.emit('deleteUserItem', item._id);
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
      yourListings: yourListings,
      search: search,
      addItem: addItem,
      rent: rent,
      returnItem: returnItem,
      remove: remove
    };
   //functions that are used on both userAccount.html and home.html can be put in here so they can be shared across the controllers
  }])

  .factory('socketio', ['$rootScope', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}]);