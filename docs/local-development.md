# Local Development

## Prerequisites

- Node.js v20+
- npm
- Docker (optional, for containerized run)

## Setup

```bash
git clone https://github.com/qand90/fakestore-gateway-node.git
cd fakestore-gateway-node
npm install
```

## Run

```bash
npm start
```

Server starts on `http://localhost:3000` (override with the `PORT` env var).

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Server port |
| `FAKESTORE_API` | `https://fakestoreapi.com` | Upstream API base URL |

## Explore the API

- Swagger UI: `http://localhost:3000/api-docs`
- Metrics: `http://localhost:3000/metrics`

## Run in Docker

```bash
docker build -t fakestore-gateway .
docker run -p 3000:3000 fakestore-gateway
```

> **Known issue:** the `Dockerfile` currently uses `COMMAND [...]` instead of
> `CMD [...]`, so the built image will not actually start the app. Fix this
> line before relying on the Docker build.
