//start here
angular.module('app', [])
  .controller('thecontroller', function($scope){

    var refresh = function() {
      return $http({
        method:'GET',
        url: '/listings'
      }).success(function(res) {
        $scope.lists = res;
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