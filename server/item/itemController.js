var Item = require('./itemModel.js');
var Q = require('q');
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/airlistdb';
var agenda = require('agenda')({ db: { address: mongoUri } });
var sugar = require('sugar');
var nodemailer = require('nodemailer');

// promisify
var makeItem = Q.nbind(Item.create, Item);
var getAll = Q.nbind(Item.find, Item);
var removeItem = Q.nbind(Item.remove, Item);
var getItem = Q.nbind(Item.findOne, Item);


// create a new item in database
module.exports.createItem = function(req, res) {
  makeItem(req.body)
  .then(function(newItem){
    console.log(newItem);
    res.status(201);
    res.send(newItem);
  })
  .fail(function(err){
    res.sendStatus(404);
  });
};

// fetch all items from database
module.exports.getAllItems = function() {
  return getAll({});
};

module.exports.getAllItemsWithCategory = function(req, res) {
  var category = req.params.category;
  getAll({category: category})
  .then(function(items){
    res.status(200);
    res.json(items);
  })
  .fail(function(err){
    res.sendStatus(404);
  });
};

module.exports.getAllItemsWithEmail = function(req, res) {
  var email = req.params.email;
  return getAll({email: email})
};

module.exports.getAnItem = function(req, res) {
  var id = req.params.id;
  getItem({_id:id})
  .then(function(item){
    res.status(200);
    res.json(item);
  })
  .fail(function(err){
    res.sendStatus(404);
  });
};

module.exports.deleteItem = function(req, res) {
  var id = req.params.id;
  removeItem({_id: id})
  .then(function(item){
    res.send(item);
  })
  .fail(function(err){
    res.sendStatus(404);
  })
};

// module.exports.rentAnItem = function(req, res) {
//   var itemId = req.params.id;
//   var data = req.body;

//   Item.findOneAndUpdate({_id: itemId}, data, function(err, found) {
//     if (found) {
//       console.log('rented item found!');
//       agenda.schedule('in 10 seconds', 'send email alert', itemId);
//       res.send(200, found);
//     } else {
//       console.log(err);
//     }
//   });
// };

// because of socket.io, the parameters for this function are no longer req and res
module.exports.updateAnItem = function(item) {
  var id = item.params.id;
  var newParams = item.body;

  return Item.findOne({_id: id}, function(err, doc) {
    if (newParams.days) {  //UPDATE DAYS (RENTAL PERIOD)
      doc.days = newParams.days;
    }
    if (newParams.price) { //UPDATE PRICE
      doc.price = newParams.price;
    }
    if (newParams.description) {  //UPDATE DESCRIPTION
      doc.description = newParams.description
    }
    if (newParams.name) {   //UPDATE ITEM NAME
      doc.name = newParams.name;
    }
    if (newParams.category) {   //UPDATE ITEM CATEGORY
      doc.category = newParams.category;
    }
    if (!newParams.renter) {   //UPDATE PERSON WHO'S RENTING (WHEN RETURN ITEM BUTTON IS PRESSED)
      doc.renter = '';
    }
    if (newParams.renter) {    //UPDATE PERSON WHO'S RENTING (WHEN RENT BUTTON IS PRESSED)
      doc.renter = newParams.renter;
    }
    if (newParams.hasOwnProperty('rentable')) {    //UPDATE ITEM'S RENTABLE AS TRUE/FALSE
      doc.rentable = newParams.rentable;
    }
    doc.save();
  });
};