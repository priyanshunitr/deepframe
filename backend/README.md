# Backend

Basic TypeScript HTTP server for the AI Video Editor backend.

## Scripts

Run these from the project root:

```bash
npm run backend:typecheck
npm run backend:build
npm run backend:start
```

The server reads `PORT` from the environment and defaults to `4000`.

## Endpoints

- `GET /` - API status
- `GET /health` - Health check with uptime and timestamp