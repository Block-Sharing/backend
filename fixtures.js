const mongoose = require('mongoose');
const fs = require('fs');
const House = require('./schema/house');
const Category = require('./schema/category');
const Person = require('./schema/person');

const Schema = mongoose.Schema;
const db = mongoose.connection;


mongoose.connect('mongodb://localhost:27017/blockSharing');

db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});


async function loadCategories () {
    const json = fs.readFileSync('./fixtures/categories.json').toString();
    const categories = JSON.parse(json);
    await Category.create(categories);
}

async function execute () {
    const json = fs.readFileSync('./fixtures/house.json').toString();
    const house = JSON.parse(json);
    await mongoose.connection.dropDatabase();
    await House.create(house);
    await loadCategories();
    await loadUser();
}

async function loadUser () {
  const json = fs.readFileSync('./fixtures/person.json').toString();
  const person = JSON.parse(json);
  await Person.create(person);
}

db.once('open', () => {
    console.log('DB connected successfully!');
    var promise = execute();
    promise.then(() => {
      console.log('Fixtures have been loaded');
      process.exit(); // HACK!!
    });

    promise.catch((err) => {
      console.log(`Error: Couldn't load fixtures`);
      console.log(err);
      process.exit(); // HACK!!
    });

});
