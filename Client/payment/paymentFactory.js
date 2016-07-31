angular.module('payment')

.factory('paymentFactory', function($http) {
  var payWithStripe = function(token) {
    return $http({
      method: 'POST',
      url: '/api/payment',
      data: token,
      headers: {'Content-Type': 'application/json'}
    })
    .then(function(res) {
      console.log(res);
    });
  };

  return {
    payWithStripe: payWithStripe
  };
});