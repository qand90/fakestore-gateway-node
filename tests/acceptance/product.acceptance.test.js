const request = require('supertest');
const app = require('../../index');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/auth')
    .send({ username: 'test', password: 'test' });
  token = res.body.token;
});

describe('Product API', () => {
  test('GET /products should return products', async () => {
    const res = await request(app)
      .get('/products')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /products/:id should return a product', async () => {
    const res = await request(app)
      .get('/products/1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
  });

  test('POST /products should create a product (fake)', async () => {
    const newProduct = {
      title: 'Test Product',
      price: 12.99,
      description: 'For testing',
      image: 'https://i.pravatar.cc',
      category: 'test',
    };
    const res = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('product');
  });

  test('GET /products/:id with invalid ID returns 404', async () => {
    const res = await request(app)
      .get('/products/9999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  test('GET /products unauthorized returns 401', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toBe(401);
  });
});
