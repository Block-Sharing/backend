const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const itemSchema = new Schema({
  category: { type: String },
  title: { type: String },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'Person' }
});
itemSchema.index({ hash: 1}, {unique: true});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;