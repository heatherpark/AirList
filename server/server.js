var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// var itemController = require('./itemController.js')

var app = express();

//for heroku
var port = process.env.PORT || 9000;
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/airlistdb';
mongoose.connect(mongoUri);

// middleware
app.use(bodyParser.json());
//serve static files
app.use(express.static(__dirname + '/../Client'));

// app.get('/', function (req, res) {
//   res.send('Hello Word!');
// })

//api routes
app.get('/listings', function (req, res) {

});

app.post('/listings', function (req, res) {

});

app.delete('/listings/:id', function (req, res) {

});

app.listen(port, function () {
  console.log("server up and running on port:" + port);
});

