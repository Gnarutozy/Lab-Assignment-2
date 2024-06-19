var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config = require('./config/config.js')
var bodyParser = require('body-parser');
var path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/marketplace')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

  //Router
  app.use('/api', require('./routes/productRoutes'));

  // Deliver the app's home page to browser clients
app.get('/', function(req, res) { 
  res.send({ message: 'Welcome to DressStore application.' }); 
}); 

// Add support for incoming JSON entities
app.use(bodyParser.json());

// Array of strings (products)
let products = ['iPhone', 'Macbook', 'AirPod', 'iMac', 'iPad', 'StudioMac', 'VisionPro'];

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get one product by ID
app.get('/api/products/:Id', (req, res) => {
  const Id = req.params.Id;
  if (Id >= 0 && Id < products.length) {
    res.json({ product: products[Id] });
  } else {
    res.status(404).send('Resource not found');
  }
});

// Get products by name using query parameter
app.get('/api/products', (req, res) => {
  const { name } = req.query;
  if (!name) {
    res.status(400).send('Name parameter is required');
    return;
  }

  const filteredProducts = products.filter(product => product.toLowerCase().includes(name.toLowerCase()));
  if (filteredProducts.length > 0) {
    res.json({ products: filteredProducts });
  } else {
    res.status(404).send('No products found matching the criteria');
  }
});

// Add new product
app.post('/api/products', (req, res) => {
  const newItem = req.body.productName;
  products.push(newItem);
  res.status(201).json({ message: `Added ${newItem} as item identifier ${products.length - 1}` });
});

// Edit existing product by ID
app.put('/api/products/:id', (req, res) => {
  const itemId = req.params.id;
  if (itemId >= 0 && itemId < products.length) {
    const updatedItem = req.body.productName;
    products[itemId] = updatedItem;
    res.json({ message: `Updated item with identifier: ${itemId} to ${updatedItem}` });
  } else {
    res.status(404).send('Resource not found');
  }
});

// Delete product by ID
app.delete('/api/products/:id', (req, res) => {
  const itemId = req.params.id;
  if (itemId >= 0 && itemId < products.length) {
    const deletedItem = products.splice(itemId, 1)[0];
    res.status(200).json({ message: `Deleted product: ${deletedItem}` });
  } else {
    res.status(404).send('Resource not found');
  }
});

//Delete all of products
app.delete('/api/products', (req, res) => {
  products = []; // Empty the products array
  res.status(200).json({ message: 'All products deleted' });
});


// Resource not found (this should be at the end)
app.use((req, res) => {
  res.status(404).send('Resource not found');
});

// Start the server
const PORT = 7777;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

module.exports = app;
