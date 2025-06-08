const express = require('express');
const app = express();
app.use(express.json());

// Mock /auth
app.post('/auth', (req, res) => {
  res.json({ message: 'OK', token: 'mock-token' });
});

// Mock /products
app.get('/products', (req, res) => {
  res.json([{ id: 1, title: 'Mock Product' }]);
});
app.get('/products/:id', (req, res) => {
  res.json({ id: req.params.id, title: 'Mock Product Detail' });
});
app.post('/products', (req, res) => {
  res.status(201).json({ message: 'Product created', product: req.body });
});

const port = 4000;
app.listen(port, () => console.log(`Mock server running on port ${port}`));
