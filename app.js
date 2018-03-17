const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const cors = require('cors');

const Person = require('./schema/person');
const House = require('./schema/house');
const Item = require('./schema/item');
const Category = require('./schema/category');

const app = express();
const db = mongoose.connection;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

app.options('*', cors());

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

app.get('/houses/:hash', (req, res) => {
    House.findOne({hash: req.params.hash }).exec((err, house) => {
        if (house) {
            res.send(house);
        } else {
            res.sendStatus(404);
        }
    });
});

app.get('/categories', (reg, res) => {
    Category.find({}).exec((err, categories) => {
        if (categories) {
            res.send(categories);
        } else {
            res.sendStatus(404);
        }
    });
});

app.post('/houses', (req, res) => {

    let data = req.body;
    data.hash = crypto.randomBytes(20).toString('hex');
    const house = new House(data);
    house.save(err => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(house);
        }
    })
});

app.post('/persons', async (req, res) => {
    const personData = {
        nickname: req.body.nickname,
        floor: req.body.floor,
        hash: crypto.randomBytes(20).toString('hex')
    };
    const person = new Person(personData);
    await person.save();

    const houseHash = req.body.houseHash;
    house = await House.findOne({hash: houseHash}).exec();
    house.tenants = house.tenants || [];
    house.tenants.push(person._id);
    await house.save();

    res.json(person);
});

app.post('/houses/:houseHash/items', async (req, res) => {
    let data = req.body;
    const houseHash = req.params.houseHash;
    const userHash = req.get('X-UserHash');
    console.log('Creating new Item for User ' + userHash + ' for House' );
    let person = await Person.findOne({hash: userHash}).exec();
    data.owner = person._id;
    const item = new Item(data);

    await item.save();
    let house = await House.findOne({hash: houseHash}).exec();
    house.items = house.items || [];
    house.items.push(item._id);
    await house.save();
    res.json(item);
});

app.get('/houses/:houseHash/items', async (req, res) => {
    const houseHash = req.params.houseHash;
    let house = await House.findOne({hash: houseHash})
    .populate('items')
    .exec();

    let items = await Person.populate(house.items, {
        path: 'owner',
        select: ['nickname', 'floor']
    });
    res.send(items);
});

app.post('/houses/:houseHash/tenants/:userId', async (req, res) => {
    const houseHash = req.params.houseHash;
    const userHash = req.get('X-UserHash');
    let user = await Person.findOne({hash: userHash}).exec();

    house = await House.findOne({hash: houseHash}).exec();
    house.tenants = house.tenants || [];
    house.tenants.push(person._id);
    await house.save();
    res.json(house);
});

app.listen(8000, () => {
  console.log(' app listening on port 8000!')
});
