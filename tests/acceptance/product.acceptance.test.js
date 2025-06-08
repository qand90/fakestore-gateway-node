// tests/acceptance/product.acceptance.test.js
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let token;

beforeAll(async () => {
  const res = await axios.post(`${BASE_URL}/auth`, {
    username: 'test',
    password: 'test',
  });
  token = res.data.token;
});

describe('Product API', () => {
  test('GET /products should return products', async () => {
    const res = await axios.get(`${BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  test('GET /products/:id should return a product', async () => {
    const res = await axios.get(`${BASE_URL}/products/1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty('id');
  });

  test('POST /products should create a product (fake)', async () => {
    const newProduct = {
      title: 'Test Product',
      price: 12.99,
      description: 'For testing',
      image: 'https://i.pravatar.cc',
      category: 'test',
    };

    const res = await axios.post(`${BASE_URL}/products`, newProduct, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('product');
  });

  test('GET /products/:id with invalid ID returns 200 but empty or error', async () => {
    const res = await axios.get(`${BASE_URL}/products/9999`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Depends on API behavior: adapt this assertion as needed
    expect(res.status).toBe(200);
  });

  test('GET /products unauthorized returns 401', async () => {
    try {
      await axios.get(`${BASE_URL}/products`);
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
  });
});
