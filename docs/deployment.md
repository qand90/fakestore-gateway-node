# Deployment

## Container image

```bash
docker build -t fakestore-gateway .
```

> **Note:** fix the `Dockerfile`'s `COMMAND` -> `CMD` typo before deploying -
> as currently written the container image will not launch the app.

## Configuration

The app reads `PORT` and `FAKESTORE_API` from the environment (via `.env`
locally through `dotenv`, or set directly in your deployment platform).

## Backstage integration

This service is registered in the Backstage catalog via `catalog-info.yaml`:

- **Component:** `fakestore-gateway-node-github`
- **System:** `fakestore-platform`
- **Owner:** `user:sasha`
- **TechDocs source:** `dir:.` (this `docs/` folder)

## CI/CD

No GitHub Actions workflow exists yet for this repo. See the
`backstage-templates` K6 performance-test template for the established
pattern (Docker-based `workflow_dispatch` job) if adding a pipeline here.
