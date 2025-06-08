const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');
const axios = require('axios');
const FAKESTORE_API = process.env.FAKESTORE_API || 'https://fakestoreapi.com';

dotenv.config();
const app = express();
app.use(express.json());

// Middleware to check JWT token
function authMiddleware(req, res, next) {
  // Allow public routes: /auth and /api-docs and swagger assets
  if (
    req.path === '/auth' ||
    req.path.startsWith('/api-docs') ||
    req.path.startsWith('/swagger-ui')  // in case swagger assets are under this
  ) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer fake-jwt-token')) {
    return res.status(401).json({ error: 'Unauthorized: missing or invalid token' });
  }

  next();
}
app.use(authMiddleware);



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});

app.post('/auth', (req, res) => {
  const { username, password } = req.body;

  // Simulate auth logic
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Fake token (for demo purposes)
  const token = `fake-jwt-token-${Date.now()}`;

  res.status(200).json({
    message: 'Authenticated successfully',
    token
  });
});

app.post('/products', async (req, res) => {
  try {
    const productData = req.body;

    const response = await axios.post(`${FAKESTORE_API}/products`, productData);

    res.status(201).json({
      message: 'Product created',
      product: response.data
    });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${FAKESTORE_API}/products/${id}`);
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error('Error fetching product:', error.message);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const response = await axios.get(`${FAKESTORE_API}/products`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});