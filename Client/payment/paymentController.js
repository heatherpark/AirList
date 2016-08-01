angular.module('payment', [])

.controller('paymentController', function ($scope, paymentFactory, socketio) {
  // called when user submits payment information
  // returns Stripe token if payment information is valid
  // 'angularPayments' module is used to abstract token creation and form information extraction
  $scope.charge = function (code, result) {
    if (result.error) {
      console.log('it failed! error: ' + result.error.message);
    } else {
      console.log('success! token: ' + result.id);

      // payment information to send to the server
      var paymentInfo = {
        stripeToken: result.id,
        itemName: paymentFactory.chargedItem.name,
        itemPrice: paymentFactory.chargedItem.price
      };

      // calls server request function in paymentFactory
      paymentFactory.payWithStripe(paymentInfo)
      .then(function() {
        // after successful payment, item info is updated
        // in DB using socketio event handlers
        var item = paymentFactory.chargedItem;
        item.rentable = false;
        console.log(item)
        item.renter = JSON.parse(window.localStorage.profile).email;
        socketio.emit('update', item);
      });
    }
  };
});