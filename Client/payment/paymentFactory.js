angular.module('payment')

.factory('paymentFactory', function($http, $uibModal) {
  var paymentForm = function() {
    console.log('hello from paymentForm function!');
    var paymentModal = $uibModal.open({
      animation: true,
      templateUrl: 'payment/paymentView.html',
      controller: 'paymentController',
      size: 'sm',
    });
  };

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
    paymentForm: paymentForm,
    payWithStripe: payWithStripe
  };
});