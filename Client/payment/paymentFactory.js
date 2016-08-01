angular.module('payment')

.factory('paymentFactory', function($http, $uibModal) {
  var chargedItem;

  var paymentForm = function() {
    var paymentModal = $uibModal.open({
      animation: true,
      templateUrl: 'payment/paymentView.html',
      controller: 'paymentController',
      size: 'sm',
    });
  };

  var payWithStripe = function(paymentInfo) {
    return $http({
      method: 'POST',
      url: '/api/payment',
      data: paymentInfo,
      headers: {'Content-Type': 'application/json'}
    });
  };

  return {
    chargedItem: chargedItem,
    paymentForm: paymentForm,
    payWithStripe: payWithStripe
  };
});