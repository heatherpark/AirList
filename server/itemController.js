var Item = require('./itemModel.js');
var Q = require('q');

var makeItem = Q.nbind(Item.create, Item);
var getAll = Q.nbind(Item.find, Item);
var removeItem = Q.nbind(Item.remove, Item);

var createItem = function(req, res) {
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

var getAllItems = function(req, res) {
  getAll({})
  .then(function(items){
    console.log(items);
    res.status(200);
    res.json(items);
  })
  .fail(function(err){
    res.status(404);
  });
};

var deleteItem = function(id, callback) {
  removeItem({_id: id})
  .then(function(item){
    callback(item);
  })
  .fail(function(err){
    console.error(err);
  })
};

var updateAnItem = function(itemName, newParams, callback) {
  Item.findOne({
    name: itemName
  }, function(err, doc) {
    if (newParams.days) {
        doc.days = newParams.days
    }
    if (newParams.price) {
        doc.price = newParams.price
    }
    if (newParams.description) {
        doc.description = newParams.description
    }
    if (newParams.name) {
        doc.name = newParams.name
    }
    doc.save();
    callback(err, doc)
  });
}
module.exports.createItem = createItem;
module.exports.getAllItems = getAllItems;
module.exports.deleteItem = deleteItem;