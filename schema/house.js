var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var houseSchema = new Schema({
  name: { type: String },
  street: { type: String },
  city: { type: String },
  hash: { type: String },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  tenants: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});
houseSchema.index({ hash: 1}, {unique: true});

var House = mongoose.model('House', houseSchema);

module.exports = House;