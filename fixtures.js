const mongoose = require('mongoose');
const fs = require('fs');
const House = require('./schema/house');

const Schema = mongoose.Schema;
const db = mongoose.connection;


mongoose.connect('mongodb://localhost:27017/blockSharing');

db.on('error', err => {
    console.error(`Error while connecting to DB: ${err.message}`);
});

db.once('open', () => {
    console.log('DB connected successfully!');
    var json = fs.readFileSync('./fixtures/house.json').toString();
    var house = JSON.parse(json);

    const houseObj = new House(house);
    houseObj.save(err => {
      if (err) {
        console.log(`Error: Couldn't load fixtures`);
      } else {
        console.log('Fixtures have been loaded');
      }
      process.exit(); // HACK!!
    });

});