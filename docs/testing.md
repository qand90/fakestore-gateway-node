# Testing

## Test suites

| Command | Runs |
|---|---|
| `npm test` | Unit + acceptance tests |
| `npm run test:unit` | `tests/unit/` - Jest with mocked `axios` |
| `npm run test:acceptance` | `tests/acceptance/` - hits a running instance |

Acceptance tests require the app to be running locally first (`npm start`)
since they make real HTTP calls against `http://localhost:3000`.

## Performance test spec

This service was built as a performance-engineering exercise. Reference load
profile:

| Parameter | Value |
|---|---|
| Concurrent virtual users | 20 |
| Ramp-up duration | 10 seconds |
| Sustained duration | 1 minute |
| Error rate threshold | <= 0.01% |

**Response time targets (p95)**

| Endpoint | Target |
|---|---|
| `GET /products` | <= 500 ms |
| `GET /products/{id}` | <= 500 ms |
| `POST /products` | <= 600 ms |

Each virtual user should authenticate once via `POST /auth` and reuse the
token for all subsequent requests.
