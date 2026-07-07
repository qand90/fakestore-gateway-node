# FakeStore Gateway (Node.js)

Lightweight Node.js/Express gateway service that authenticates users via a
simulated JWT flow and proxies product requests to the public
[FakeStore API](https://fakestoreapi.com).

## What this service does

- Issues a fake JWT token via `POST /auth`
- Proxies `GET /products`, `GET /products/{id}`, and `POST /products` to FakeStore API
- Exposes Prometheus metrics at `/metrics`
- Serves interactive Swagger UI at `/api-docs`

## Quick links

- [Architecture](architecture.md)
- [API Reference](api-reference.md)
- [Local Development](local-development.md)
- [Testing](testing.md)
- [Observability](observability.md)
- [Deployment](deployment.md)

## At a glance

| | |
|---|---|
| Language | Node.js 20, Express 5 |
| Owner | sasha |
| System | fakestore-platform |
| Lifecycle | experimental |
| Repo | qand90/fakestore-gateway-node |
