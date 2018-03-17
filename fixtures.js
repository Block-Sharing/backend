const mongoose = require('mongoose');
const fs = require('fs');
const House = require('./schema/house');
const Category = require('./schema/category');
const Item = require('./schema/item');
const Person = require('./schema/person');

const Schema = mongoose.Schema;
const db = mongoose.connection;


mongoose.connect('mongodb://localhost:27017/blockSharing');

async function loadCategories () {
    const json = fs.readFileSync('./fixtures/categories.json').toString();
    const categories = JSON.parse(json);
    await Category.create(categories);
}

async function loadItems (house, user) {
    const json = fs.readFileSync('./fixtures/items.json').toString();
    let items = JSON.parse(json);
    items.forEach(elem => {
      elem.owner = user._id;
    })
    items = await Item.create(items);
    house.items = house.items.concat(items);
    await house.save();
}

async function loadHouse(person) {
  const json = fs.readFileSync('./fixtures/house.json').toString();
  let house = JSON.parse(json);
  house.tenants = [person._id];
  house = await House.create(house);
  return house;
}

async function loadPerson () {
  const json = fs.readFileSync('./fixtures/person.json').toString();
  const person = JSON.parse(json);
  user = await Person.create(person);
  return user;
}

async function execute () {
  await mongoose.connection.dropDatabase();
  await loadCategories();
  let user = await loadPerson();
  let house = await loadHouse(user);
  await loadItems(house, user);
}

db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});

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
