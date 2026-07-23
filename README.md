# Management System

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-8.1.1-646CFF?logo=vite&logoColor=ffffff) ![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=typescript&logoColor=ffffff) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-38B2AC?logo=tailwind-css&logoColor=ffffff)

This repository contains the React client for the Library Management System.

## Tech Stack

- **React 19** — UI library for building the client interface.
- **Vite 8.1.1** — fast development server and build tool.
- **TypeScript 6.0.2** — typed JavaScript for safer code.
- **Tailwind CSS 4.3.3** — utility-first styling framework.
- **ESLint** — code quality and linting.
- **Docker** — containerized build and deployment.
- **Nginx** — serving the built static app in production.

## Files and locations

- `Library-Management-System/lms.client/package.json` — client dependencies and scripts.
- `Library-Management-System/lms.client/Dockerfile` — build and runtime Docker image for the client.
- `Library-Management-System/docker-compose.yml` — compose file to build and run the client service.
- `Library-Management-System/lms.client/src/assets/` — image and icon assets used by the client.

## Quick project commands

From `Library-Management-System/lms.client`:

```bash
npm install
npm run dev
```

Build with Docker from repo root:

```bash
docker compose up --build
```
