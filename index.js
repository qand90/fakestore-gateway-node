const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');

dotenv.config();

const app = express();
app.use(express.json());

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
