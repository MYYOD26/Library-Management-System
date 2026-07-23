# LMS Client

Quick start instructions for developers who clone this repository.

## Prerequisites
- Git
- Docker Desktop (with Compose) OR Node.js + npm (for local development)

## Quick start (recommended - Docker)
1. Clone the repo and enter the project:

```bash
git clone <repo-url>
cd Library-Management-System
```

2. Build and run the services (from the repo root):

```bash
docker compose up --build
```

3. Open the app at:

http://localhost:3000

## Local development (optional)
If you prefer to run the client locally (requires Node.js):

```bash
cd lms.client
npm install
npm run dev
```

Default dev server address is typically `http://localhost:5173` (Vite).

## Build production image

```bash
cd lms.client
docker build -t lms-client:latest .
docker run -p 3000:80 lms-client:latest
```

Or use the repo `docker-compose.yml` to build and run everything.

## Environment & common issues
- If a `.env.example` exists, copy it to `.env` and adjust values.
- The Dockerfile currently uses `npm ci` which requires `package-lock.json`. If your repo does not include `package-lock.json`, either:
	- generate and commit it with `npm install` before running Docker builds, or
	- update the Dockerfile to use `npm install` instead of `npm ci`.

## Useful commands
- Show logs: `docker compose logs --tail 200`
- Stop and remove containers: `docker compose down`

## Project layout (brief)
- `lms.client/` — React client source and Dockerfile
- `docker-compose.yml` — compose file at repo root (builds client service)

If you want a shorter or translated version, tell me which language and I will update it.

