# 🧪 FakeStore Gateway (Node.js)

This is a lightweight **Node.js gateway app** that authenticates users and proxies requests to the [FakeStore API](https://fakestoreapi.com/). It's designed for testing, learning, and performance engineering interview scenarios.

---

## 📦 Features

- 🔐 Simple fake authentication
- ➕ Add a product (POST)
- 📄 Get all products (GET)
- 🔍 Get a product by ID (GET)
- 🛡️ JWT-like token auth
- 📜 Swagger UI documentation
- 🧪 Unit + Acceptance tests

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/fakestore-gateway-node.git
cd fakestore-gateway-node
````

### 2. Install dependencies

```bash
npm install
```

### 3. Run the server

```bash
npm start
```

By default, the server runs at:

```
http://localhost:3000
```

---

## 📘 API Docs (Swagger)

After starting the server, open:

```
http://localhost:3000/api-docs
```

Use the `Authorize` button to input your token (see auth below).

---

## 🔐 Authentication

Before using the protected endpoints, you must get a fake token:

### Request

```http
POST /auth
Content-Type: application/json

{
  "username": "test",
  "password": "test"
}
```

### Response

```json
{
  "message": "Authenticated successfully",
  "token": "fake-jwt-token-..."
}
```

Use this token in `Authorization: Bearer ...` header.

---

## 🧪 Running Tests

### Run all tests

```bash
npm test
```

### Run only unit tests

```bash
npx jest __tests__/unit
```

### Run only acceptance tests

```bash
npx jest __tests__/acceptance
```

---

# Running with Docker

## Build Docker image

```bash
docker build -t fakestore-gateway .
```

## Run the container and publish port 3000

```bash
docker run -p 3000:3000 fakestore-gateway
```

## 📂 Project Structure

```
.
├── controllers/            # Business logic
├── middleware/             # Auth middleware
├── routes/                 # Express routes
├── swagger.yaml            # OpenAPI spec
├── tests/                  # Unit + Acceptance tests
├── index.js                # App entry point
└── swagger.js              # Swagger setup
```

---

## 💡 Notes

* Product `POST` is mocked — FakeStore API doesn’t persist created products.
* Only IDs 1–20 exist on `GET /products/:id`.

---

## 📜 License

MIT — feel free to fork or use for interview testing.

