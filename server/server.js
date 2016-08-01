var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var itemController = require('./item/itemController.js');
var Item = require('./item/itemModel.js');
var stripeKey = process.env.STRIPE_KEY || require('../Client/env/config.js').stripeKey;
var stripe = require("stripe")(stripeKey);

var app = express();

//for heroku
var port = process.env.PORT || 9000;
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/airlistdb';
mongoose.connect(mongoUri);

// for email notifications
var agenda = require('agenda')({ db: { address: mongoUri } });  // chron-like lib for node
var Sugar = require('sugar'); // syntactic sugar library (used specifically for date conversion here)
var nodemailer = require('nodemailer'); // used to send email from node
var sgTransport = require('nodemailer-sendgrid-transport'); // for SendGrid (email provider) to work with nodemailer
var sgKey = process.env.SEND_GRID_KEY || require('../Client/env/config.js').sgKey;

// middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//serve static files
app.use(express.static(__dirname + '/../Client'));

var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(port, function () {
  console.log("server up and running on port:" + port);
});

// stripe payment POST request handler
app.post('/api/payment', function(req, res) {
  var stripeToken = req.body.stripeToken;
  var name = req.body.itemName;
  var price = req.body.itemPrice

  var charge = stripe.charges.create({
    amount: price * 100, // price of item in pennies
    currency: "usd",
    source: stripeToken,
    description: name  // name of item for transaction info
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      console.log('error: ', err);
    } else {
      console.log('success!');
    }
  });

  res.send(charge);
});


io.on('connection', function(socket) {

  socket.on('getAllItems', function() {
    itemController.getAllItems()
      .then( (items) => {
        io.emit('gotAllItems', items)
      })
  });

  socket.on('getUserItems', function(email) {
    itemController.getAllItemsWithEmail({ params : { email : email } })
    .then(function(data) {
      io.emit('gotYourList', data);
    })
  });

  socket.on('deleteUserItem', function(item) {
    itemController.deleteItem({ params : { id: item } })
      io.emit('yourListings');
  });

  socket.on('createItem', function(item) {
    itemController.createItem(item)
    io.emit('yourListings');
  });
  // runs when item is officially rented
  socket.on('update', function(item) {
    itemController.updateAnItem({
      params : {
        id: item._id
      },
      body: {
        renter: item.renter,
        rentable: item.rentable
      }
    })
    .then(function(item) {
      var itemId = item._id;
      var emailDate = new Sugar.Date().advance(item.days - 1).raw;
      // scheduling an agenda job with the new job that is defined below
      agenda.schedule(emailDate, 'send email alert', itemId);
    })
    .then(function() {
      itemController.getAllItems()
        .then( (items) => {
          io.emit('gotAllItems', items)
        })
    });
  });
});

// defining a new agenda job to send out an email alert
agenda.define('send email alert', function(job, done) {
  Item.findOne({ _id: job.attrs.data }).exec(function(err, item) {
    // options for sending via nodemailer
    var options = {
      host: '127.0.0.1',
      port: 9000,
      secure: true,
      strictSSL: false,
      auth: {
        api_key: sgKey
      }
    }

    var mailer = nodemailer.createTransport(sgTransport(options));

    if(item){
      // email text
      var text = "Hey there! \n\nJust wanted to remind you that " + item.name + " is due back tomorrow!\n\nThanks from the AirShare team!";

      // email contents
      var mailOptions = {
        from: 'customerservice@airshare.com',
        to: item.renter,
        subject: 'AirShare Rental Notification',
        text: text
      };

    // set appropriate callbacks upon sending email
      mailer.sendMail(mailOptions, function(error, response) {
        if (error) {
          console.log('error: ', error);
        } else {
          console.log('email sent!');
          mailer.close();
          done();
        }
      });
    }
  });
});

// event handler that listens for agenda to be connected to MongoDB
agenda.on('ready', function() {
  // starts processing jobs
  agenda.start();
});

agenda.on('start', function(job) {
  console.log("Job %s starting", job.attrs.name);
});

agenda.on('complete', function(job) {
  console.log("Job %s finished", job.attrs.name);
});
