# Observability

## Metrics

The app exposes Prometheus-format metrics at `GET /metrics` via
`prom-client`, including default Node.js process metrics.

## Local stack (Prometheus + Grafana)

```bash
docker-compose up --build
```

This starts:

- **App** - `http://localhost:3000`
- **Prometheus** - `http://localhost:9090` (scrapes the app every 5s, see `prometheus.yml`)
- **Grafana** - `http://localhost:3001` (default login `admin` / `admin`)

## Wiring Grafana to Prometheus

1. Open Grafana -> **Configuration -> Data Sources -> Add data source**
2. Choose **Prometheus**, set URL to `http://prometheus:9090`
3. Save & test
4. Import or build a dashboard for request rate, p95 latency, error rate,
   and CPU/memory
