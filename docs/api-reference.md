# API Reference

Full OpenAPI spec: [`swagger.yaml`](https://github.com/qand90/fakestore-gateway-node/blob/main/swagger.yaml).
Interactive Swagger UI is also available at `/api-docs` when the service is running.

## POST /auth

Authenticate and receive a token.

**Request body**
```json
{ "username": "string", "password": "string" }
```

**Responses**

| Status | Meaning |
|---|---|
| 200 | `{ "message": "...", "token": "..." }` |
| 400 | Missing username or password |

---

## GET /products

Returns all products from FakeStore API. Requires `Authorization: Bearer <token>`.

| Status | Meaning |
|---|---|
| 200 | Array of product objects |
| 500 | Upstream fetch failed |

---

## GET /products/{id}

Returns a single product by numeric ID (only IDs 1-20 exist upstream).
Requires `Authorization: Bearer <token>`.

| Status | Meaning |
|---|---|
| 200 | Product object |
| 404 | Product not found |
| 500 | Upstream fetch failed |

---

## POST /products

Creates a product. **Note:** FakeStore API does not persist created
products - this is a mocked passthrough. Requires `Authorization: Bearer <token>`.

**Request body**
```json
{
  "title": "string",
  "price": 0,
  "description": "string",
  "image": "string",
  "category": "string"
}
```

| Status | Meaning |
|---|---|
| 201 | `{ "message": "...", "product": {...} }` |
| 500 | Create failed |
