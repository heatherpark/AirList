var express = require('express');
var mongoose = require('mongoose');

var app = express();

app.set('port', process.env.PORT || 9000);

//serve static files
app.use(express.static(__dirname + '/'));

app.listen(app.get('port'), function(){
  console.log("server up and running on port:" + app.get('port'));
});

