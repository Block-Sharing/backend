var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var houseSchema = new Schema({
  street: { type: String },
  city: { type: String },
  hash: { type: String },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  tenants: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

var House = mongoose.model('House', houseSchema);

module.exports = House;