angular.module('app.controllers', ['userAccountController', 'loginController', 'app.factories'])

  .controller('HomeController', ['$scope', '$http', '$window', 'homeFactory', 'socketio', function($scope, $http, $window, homeFactory, socketio){

  $scope.lists = [];

  socketio.on('something', function(data) {
    $scope.refreshUserListings();
  })
  //this gets the users current location within the app
    $scope.env = homeFactory.env;

  //this asks the user to provide their location. If they agree, the users longitude and latitude will be stored. This will be used later as the position when the user adds an item from the userAccount page.
    navigator.geolocation.getCurrentPosition(function(position) {
      $scope.position = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    });

  //sets up the category options
    $scope.options = homeFactory.options;
    $scope.addCategory = homeFactory.addCategory;

  //creates a map based on the passed in parameters. This is reused on each listing that shows on the home.html page
    $scope.initMap = homeFactory.initMap;

  //pulls the latest data from the server. Used many times throughout the app to ensure latest data in the scope 'lists' variable
    socketio.on('gotAllItems', function(items) {
      $scope.lists = items;
    });

    $scope.refresh = function(){
      socketio.emit('getAllItems');
    };

    $scope.refresh();
  //basically the same thing as 'refresh' above, but it updates a different scope variable, 'query' instead of 'lists'
    $scope.queryUpdater = homeFactory.queryUpdater;

  //again, similar to refresh above, but causes unknown bug when refactor is tried. Can be placed in a shared factory instead of here.
    $scope.refreshUserListings = function() {
      homeFactory.refreshUserListings().then(function(data) {
        $scope.yourItems = data.data;
      })
    }

    socketio.on('gotYourList', function(items) {
      $scope.yourItems = items;
    })

    $scope.generalListings = function() {
      homeFactory.getListings().then(function(res){
        $scope.lists = res.data
        settimeout(function() {
          $scope.lists.forEach(initMap);
          $scope.$apply();
        }, 1);
      });
    }

    $scope.yourListings = homeFactory.yourListings;

  //serves the userAccount.html page into ng-view on index.html
    $scope.goToUserAcc = homeFactory.goToUserAcc;

  //serves the home.html page into ng-view on index.html
    $scope.viewAllListings = homeFactory.viewAllListings;
  //refresh general listings and creates a new map per item via settimeout and forEach
    $scope.generalListings = homeFactory.generalListings;

  //searches the database based on the category
    $scope.search = homeFactory.search;


  //adds a post to the database, using the person's username grabbed from localStorage. Can be placed in the userAccountController instead
    $scope.addItem = homeFactory.addItem;

  //rents an item by changing it's rentable status in the db to false. When two people click on an item to rent, it can cause an error.
    $scope.rent = homeFactory.rent;

  //reverse of above, it changes status to true, and deletes the 'renter' prop out of the item field. Then it refreshes the userListings. Can be placed in the userAccountController instead.
    $scope.returnItem = homeFactory.returnItem;

  //this removes an item from the database. Only users can delete their own items. Can be placed in the userAccountController instead
    $scope.remove = homeFactory.remove;
}])