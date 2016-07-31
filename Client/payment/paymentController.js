angular.module('payment', [])

.controller('paymentController', function ($scope, paymentFactory) {
  $scope.charge = function (code, result) {
    if (result.error) {
      console.log('it failed! error: ' + result.error.message);
    } else {
      console.log('success! token: ' + result.id);
      var token = {stripeToken: result.id};
      paymentFactory.payWithStripe(token);
    }
  };
});