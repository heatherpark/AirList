angular.module('payment', [])

.controller('paymentController', function ($scope, paymentFactory, socketio) {
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

      paymentFactory.payWithStripe(paymentInfo)
      .then(function() {
        var item = paymentFactory.chargedItem;
        item.rentable = false;
        item.renter = JSON.parse(window.localStorage.profile).email;
        socketio.emit('update', item);
      });
    }
  };
});