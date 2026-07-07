# Architecture

## Overview

The gateway sits between API consumers and the public FakeStore API, adding
a lightweight auth layer and observability.

```
Client -> Express App -> [authMiddleware] -> Routes -> Controller -> axios -> FakeStore API
```

## Middleware order

1. `express.json()` - parses request bodies
2. `authMiddleware` (`middleware/auth.js`) - checks `Authorization: Bearer <token>` on protected paths
3. Route handlers

## Modules

| File | Responsibility |
|---|---|
| `index.js` | App bootstrap, `/auth` and `/metrics` endpoints, mounts routes and Swagger UI |
| `middleware/auth.js` | Bearer-token gate for protected routes |
| `routes/productRoutes.js` | Maps HTTP verbs/paths to controller functions |
| `controllers/productController.js` | Talks to FakeStore API via `axios`, shapes responses |
| `swagger.js` / `swagger.yaml` | Loads and serves the OpenAPI spec |

## Auth flow

1. Client calls `POST /auth` with any username/password
2. Server returns a synthetic token: `fake-jwt-token-<timestamp>`
3. Client sends `Authorization: Bearer <token>` on subsequent calls
4. `authMiddleware` checks for the `Bearer fake-jwt-token` prefix - this is a
   simulated auth for testing, not real JWT verification

## Upstream dependency

All product data is proxied live from `https://fakestoreapi.com` (configurable
via the `FAKESTORE_API` env var). There is no local persistence -
`POST /products` is accepted but not actually stored.
