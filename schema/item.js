var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var itemSchema = new Schema({
  category: { type: String },
  title: { type: String },
  description: { type: String },
  owner: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

var House = mongoose.model('House', houseSchema);

module.exports = House;