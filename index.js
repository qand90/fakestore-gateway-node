const express = require('express');
const dotenv = require('dotenv');
const swaggerUI = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const authMiddleware = require('./middleware/auth');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(authMiddleware);

// Auth endpoint
app.post('/auth', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const token = `fake-jwt-token-${Date.now()}`;
  res.json({ message: 'Authenticated successfully', token });
});

// Routes
app.use('/', productRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => console.log('Server started'));
}

module.exports = app;
