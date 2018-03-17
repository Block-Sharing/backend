const express = require('express');
const jsonParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');

const Person = require('./schema/person');

const app = express();
const Schema = mongoose.Schema;
const db = mongoose.connection;

app.use(jsonParser.json());
app.use(jsonParser.urlencoded({
   extended: true
}));

mongoose.connect('mongodb://localhost:27017/blockSharing');

db.on('error', err => {
    console.error(`Error while connecting to DB: ${err.message}`);
});

db.once('open', () => {
    console.log('DB connected successfully!');
});


app.get('/', (req, res) => {
    res.json({ response: 'Hello World!' });
});

app.post('/person', (req, res) => {

    let data = req.body;
    data.hash = crypto.randomBytes(20).toString('hex');
    const person = new Person(data);
    person.save(err => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(person);
        }
    })
});

app.listen(3000, () => {
  console.log(' app listening on port 3000!')
});
