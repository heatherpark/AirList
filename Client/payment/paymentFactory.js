angular.module('payment')

.factory('paymentFactory', function($http, $uibModal) {
  // will contain info for rented item
  var chargedItem;

  // opens payment for modal using Bootstrap UI
  var paymentForm = function() {
    var paymentModal = $uibModal.open({
      animation: true,
      templateUrl: 'payment/paymentView.html',
      controller: 'paymentController',
      size: 'sm',
    });
  };

  // will be invoked by a function in paymentController
  // makes server request to send Stripe token and other relevant item info
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