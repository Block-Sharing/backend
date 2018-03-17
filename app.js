const express = require('express');
const app = express();
const jsonParser = require('body-parser');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = mongoose.connection;

app.use(jsonParser.json());
app.use(jsonParser.urlencoded({
   extended: true
}));

mongoose.connect('mongodb://localhost:27017');

db.on('error', err => {
    console.error(`Error while connecting to DB: ${err.message}`);
});

db.once('open', () => {
    console.log('DB connected successfully!');
});

const PersonSchema = new Schema({
    id: String,
    nickname: String,
    createdAt: { type: Date, default: Date.now },
});

const Person = mongoose.model('Person', PersonSchema);

app.get('/', (req, res) => {
    res.json({ response: 'Hello World!' });
});

app.post('/person', (req, res) => {
    const person = new Person(req.body);
    res.json({ response: person });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});
