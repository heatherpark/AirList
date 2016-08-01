var mongoose = require('mongoose');
//var User = require('../user/userModel.js'); <---NOT NEEDED BUT AVAILABLE FOR USE

var ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  days: Number,
  price: Number,
  rentable: Boolean,    //IS ITEM AVAILABLE FOR RENT?
  category: String,
  email: String,        //EMAIL ADDRESS OF OWNER
  renter: String,        //EMAIL ADDRESS OF PERSON RENTING ITEM
  latitude: Number,
  longitude: Number,
  image: String
});

module.exports = mongoose.model('Item', ItemSchema);