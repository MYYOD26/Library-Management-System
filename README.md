# 📚 Library Management System (LMS) - Client

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.x-CA4245?logo=reactrouter&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=ffffff)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=ffffff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?logo=tailwind-css&logoColor=ffffff)
![MUI](https://img.shields.io/badge/MUI_v6-Material_UI-007FFF?logo=mui&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide_Icons-latest-F56565?logo=lucide&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

The client interface for the Library Management System, featuring a modern YouTube-style UI layout with full responsive support for both desktop and mobile devices.

---

## 🛠️ Frameworks, Libraries & Tech Stack

### 🔵 Core Framework & Runtime
- **[React 19](https://react.dev/)** — Main UI library for building components and managing application state.
- **[Vite 8](https://vite.dev/)** — Next-generation fast frontend build tool and development server.
- **[TypeScript 6](https://www.typescriptlang.org/)** — Strongly typed programming language for safer and maintainable code.

### 🔴 Navigation & Routing
- **[React Router Dom 7](https://reactrouter.com/)** — Declarative routing library for Single Page Applications (SPA).

### 🎨 Styling & UI Components
- **[Material UI (MUI)](https://mui.com/)** (`@mui/material`, `@emotion/react`, `@emotion/styled`) — Comprehensive React UI component library for rich UI components, modals, and input controls.
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first CSS framework (configured with `@tailwindcss/vite`).
- **[Lucide React](https://lucide.dev/)** — High-quality SVG icon library tailored for modern UI design.

### ⚙️ Code Quality & Linters
- **ESLint 10** — Static code analysis tool for maintaining React Hooks & TypeScript standards.

### 🐳 DevOps & Deployment
- **Docker & Docker Compose** — Containerization platform for consistent environment build and orchestration.
- **Nginx** — Production web server for serving built static assets.

---

## ⚡ Quick Start Commands

### 1. Development Mode (Local)

Run from `lms.client` directory:

```bash
cd lms.client

# Install all dependencies
npm install

# Start local development server
npm run dev
```

### 2. Production Mode (Docker)

Run from the root directory of the repository:

```bash
docker compose up --build
```
