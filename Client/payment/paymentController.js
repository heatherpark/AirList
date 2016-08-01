angular.module('payment', [])

.controller('paymentController', function ($scope, paymentFactory) {
  $scope.charge = function (code, result) {
    if (result.error) {
      console.log('it failed! error: ' + result.error.message);
    } else {
      console.log('success! token: ' + result.id);

      var paymentInfo = {
        stripeToken: result.id,
        itemName: paymentFactory.chargedItem.name,
        itemPrice: paymentFactory.chargedItem.price
      };

      paymentFactory.payWithStripe(paymentInfo);
      // call rent function here and use paymentFactory.chargedItem as argument
    }
  };
});