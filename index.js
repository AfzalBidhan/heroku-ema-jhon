const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pgeao.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION);
  const ordersCollection = client.db('emaJohnStor').collection('orders');

  app.post('/addProduct', (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount)
      });
  });

  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, document) => {
        res.send(document);
      });
  });

  app.get('/product/:key', (req, res) => {
    productsCollection.find({ key: req.params.key })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });

  app.post('/pdByKeys', (req, res) => {
    const productKey = req.body;
    productsCollection.find({ key: { $in: productKey } })
      .toArray((err, documents) => {
        res.send(documents)
      });
  });

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      });
  });







});





app.get('/', (req, res) => {
  res.send('Hello EMAJHON!')
})

app.listen(port)