var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var itemController = require('./item/itemController.js');
// var userController = require('./user/userController.js');    NOT USED BUT AVAILBLE FOR LEGACY TEAM IF NEEDED

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);


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
  })

  socket.on('createItem', function(item) {
    itemController.createItem({ body: item})
    io.emit('yourListings');
  })

  socket.on('rent', function(item) {
    itemController.updateAnItem({
      params : {
        id: item._id
      },
      body: {
        renter: item.renter,
        rentable: item.rentable
      }
    }).then(function() {
      itemController.getAllItems()
        .then( (items) => {
          io.emit('gotAllItems', items)
        })
    });
  })
})

//for heroku
var port = process.env.PORT || 9000;
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/airlistdb';
mongoose.connect(mongoUri);

// middleware
app.use(bodyParser.json());
//serve static files
app.use(express.static(__dirname + '/../Client'));

//api routes for items

// app.get('/listings', itemController.getAllItems);

// app.get('/listings/:id',itemController.getAnItem);

// app.get('/listings/category/:category',itemController.getAllItemsWithCategory);

// app.post('/listings',itemController.createItem);

// app.delete('/listings/:id',itemController.deleteItem);

// app.put('/listings/:id',itemController.updateAnItem);

// api routes for users
// routes for users schema if legacy team needs it, but we didn't use it. We only used the item schema.
/* ROUTES
app.get('/users', userController.getAllUsers);

app.get('/users/:id', userController.getAnUser);

app.post('/users', userController.createUser);

app.delete('/users/:id', userController.deleteUser);
*/

http.listen(port, function () {
  console.log("server up and running on port:" + port);
});


