angular.module('app', [])
  .controller('thecontroller', function($scope, $http){
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

    var refresh = function() {
      return $http({
        method:'GET',
        url: '/listings'
      }).success(function(res) {
        $scope.lists = res;
      })
    }

    $scope.search = function(query, category){
      $http({
        method:'GET',
        url: '/listings/' + query  + '/' + category
      }).success(function(res) {
        $scope.query = res;
      })
    }

    $scope.addItem = function(post){
      $http({
        method:'POST',
        url: '/listings',
        data: post
      });
      refresh();
    };

    $scope.remove = function(id) {
      $http.delete('/listings/' + id).success(function(res) {
        refresh();
      });
    }


  });