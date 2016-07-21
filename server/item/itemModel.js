var mongoose = require('mongoose');
var User = require('../user/userModel.js');

var ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  days: Number,
  price: Number,
  rentable: Boolean,
  category: String,
  email: String,
  renter: String
});

module.exports = mongoose.model('Item', ItemSchema);