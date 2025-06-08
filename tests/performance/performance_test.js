import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';


export function handleSummary(data) {
return {
'SummaryofSampleGet.html': htmlReport(data, { debug: false }),
stdout: textSummary(data, { indent: ' ', enableColors: true }),
}
}

// Custom metrics
const errorRate = new Rate('errors');

// Configurable parameters
const BASE_URL = 'http://localhost:3000';

export const options = {
  vus: 20,
  stages: [
    { duration: '10s', target: 20 }, // ramp up from 0 to 20 users over 10 seconds
    { duration: '1m', target: 20 },  // sustain 20 users for 1 minute
  ],
  thresholds: {
    'http_req_duration{endpoint:GET /products}': ['p(95)<500'],
    'http_req_duration{endpoint:GET /products/:id}': ['p(95)<500'],
    'http_req_duration{endpoint:POST /products}': ['p(95)<600'],
    errors: ['rate<0.001'], // ≤ 0.01%
  },
};

function authenticate() {
  const payload = JSON.stringify({
    username: `user${__VU}`, // unique username per virtual user
    password: 'password',
  });
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };
  const res = http.post(`${BASE_URL}/auth`, payload, params);
  
  const success = check(res, {
    'auth status 200': (r) => r.status === 200,
    'auth token present': (r) => r.json('token') !== undefined && r.json('token') !== '',
  });

  if (!success) {
    errorRate.add(1);
    return null;
  }
  return res.json('token');
}

// Helper: fetch product IDs for GET /products/:id
function fetchProductIds(token) {
  const params = {
    headers: { Authorization: `Bearer ${token}` },
    tags: { endpoint: 'GET /products' },
  };
  const res = http.get(`${BASE_URL}/products`, params);

  check(res, {
    'get products status 200': (r) => r.status === 200,
    'response is array': (r) => Array.isArray(r.json()),
  }) || errorRate.add(1);

  if (res.status !== 200) return [];

  // Extract product IDs assuming products have an 'id' field
  return res.json().map((p) => p.id).filter((id) => id !== undefined);
}

// Generate new product data for POST /products
function generateProduct() {
  return JSON.stringify({
    title: `Test Product ${Math.random().toString(36).substring(7)}`,
    price: Math.floor(Math.random() * 100) + 1,
    description: 'A test product for performance testing',
    image: 'https://via.placeholder.com/150',
    category: 'test-category',
  });
}

// Main test scenario
export default function () {
  // Authenticate once per VU
  const token = authenticate();
  if (!token) {
    return; // abort iteration if auth fails
  }

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  // Fetch product IDs once to pick random IDs for /products/:id requests
  const productIds = fetchProductIds(token);
  if (productIds.length === 0) {
    errorRate.add(1);
  }

  // Target request rates per second per endpoint (approximate)
  // Distribute requests over time in the loop.
  // Per VU RPS targets:
  // GET /products ~1.67 rps total -> ~0.0835 rps per VU (20 VUs)
  // GET /products/:id ~16.67 rps total -> ~0.8335 rps per VU
  // POST /products ~0.17 rps total -> ~0.0085 rps per VU

  // Calculate delays to meet RPS roughly (inverse of RPS)
  const getProductsInterval = 1 / 0.0835; // ~12s
  const getProductByIdInterval = 1 / 0.8335; // ~1.2s
  const postProductInterval = 1 / 0.0835; // ~12s

  let lastGetProducts = 0;
  let lastGetProductById = 0;
  let lastPostProduct = 0;

  const start = Date.now();

  while (Date.now() - start < 60 * 1000) { // 1 minute steady state loop
    const now = Date.now();

    if (now - lastGetProducts > getProductsInterval * 1000) {
      let res = http.get(`${BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
        tags: { endpoint: 'GET /products' },
      });
      check(res, {
        'get products status 200': (r) => r.status === 200,
        'response is array': (r) => Array.isArray(r.json()),
        'get products p95 < 500ms': (r) => r.timings.duration < 500,
      }) || errorRate.add(1);
      lastGetProducts = now;
    }

    if (now - lastGetProductById > getProductByIdInterval * 1000 && productIds.length > 0) {
      const id = productIds[Math.floor(Math.random() * productIds.length)];
      let res = http.get(`${BASE_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        tags: { endpoint: 'GET /products/:id' },
      });
      check(res, {
        'get product by id status 200': (r) => r.status === 200,
        'product has id': (r) => r.json('id') === id,
        'get product by id p95 < 500ms': (r) => r.timings.duration < 500,
      }) || errorRate.add(1);
      lastGetProductById = now;
    }

    if (now - lastPostProduct > postProductInterval * 1000) {
      let payload = generateProduct();
      let res = http.post(`${BASE_URL}/products`, payload, authHeaders);
      check(res, {
        'post product status 201': (r) => r.status === 201,
        'post product p95 < 600ms': (r) => r.timings.duration < 600,
      }) || errorRate.add(1);
      lastPostProduct = now;
    }

    sleep(0.1); // small sleep to prevent tight loop
  }
}
