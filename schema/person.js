const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const PersonSchema = new Schema({
  hash: {type: String, unique : true, required : true},
  nickname: {type: String, required : true},
  floor: {type: String, required: false},
  createdAt: { type: Date, default: Date.now },
});

const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;