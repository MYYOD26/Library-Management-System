# 📚 Library Management System (LMS)

![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-4169E1?logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=ffffff)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=ffffff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?logo=tailwind-css&logoColor=ffffff)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

ระบบบริหารจัดการห้องสมุด (Library Management System) พร้อมโครงสร้างแบบ Full-stack (React Client + .NET Backend + PostgreSQL Database) ที่ถูกปรับแต่งให้พร้อมรันผ่าน Docker และ Visual Studio ได้ทันที

---

## 🏗️ Architecture & Services Overview

ระบบถูกแบ่งออกเป็น 3 บริการหลัก (Services) ผ่าน Docker Compose:

| Service Container | Technology | Internal Port | Host Port | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **`LMS-CLIENT`** | React 19 + Vite + Nginx | `80` | **`3000`** | Web Frontend Dashboard (`http://localhost:3000`) |
| **`LMS-BACKEND`** | .NET 9 Web API (C#) | `8080` | **`5000`** | RESTful API (`http://localhost:5000`) |
| **`LMS-DB`** | PostgreSQL 16 | `5432` | **`5433`** | Database Connection (`localhost:5433`) |

---

## 🛠️ Tech Stack & Frameworks

### 🟢 Backend & Database
- **[.NET 9 Web API](https://dotnet.microsoft.com/)** — C# Backend API Framework.
- **[PostgreSQL 16](https://www.postgresql.org/)** — Relational Database Management System.

### 🔵 Frontend Client (`lms.client`)
- **[React 19](https://react.dev/)** — Main UI framework for component-based rendering.
- **[Vite 8](https://vite.dev/)** — Modern and fast frontend build tool.
- **[TypeScript 6](https://www.typescriptlang.org/)** — Type-safe JavaScript application development.
- **[React Router Dom 7](https://reactrouter.com/)** — Declarative SPA client-side routing.
- **[Material UI (MUI v6)](https://mui.com/) & [Tailwind CSS 4](https://tailwindcss.com/)** — Responsive UI design system.
- **[Lucide Icons](https://lucide.dev/)** — Modern SVG icon system.

### 🐳 Containerization & Tools
- **Docker & Docker Compose** — Orchestration for client, API, and database services.
- **Nginx** — Production web server serving built static assets.

---

## ⚡ Quick Start Guide

### 1. รันผ่าน Docker Compose (แนะนำ)

สั่งรันระบบทั้งหมด (Frontend, Backend, Database) จากโฟลเดอร์ Root:

```bash
# บิวด์และรันคอนเทนเนอร์ในแบบ Background (-d)
docker compose up -d --build
```

หากต้องการตรวจสอบสถานะการทำงาน:
```bash
docker compose ps
```

หากต้องการหยุดการทำงาน:
```bash
docker compose down
```

---

### 2. รันจาก Visual Studio (สำหรับ Debug / Development)

1. ดับเบิ้ลคลิกเปิดไฟล์ solution หลัก: **`Library-Management-System.sln`**
2. ตรวจสอบปุ่มด้านบนของ Visual Studio ให้เป็น **`docker-compose`**
3. กด **Play (F5)** เพื่อรันระบบพร้อมกับการ Debug (Breakpoints, Hot Reload)

---

### 3. รันแบบ Local Development (แยกทีละตัว)

#### Frontend Client:
```bash
cd lms.client
npm install
npm run dev
```

#### Backend API:
```bash
cd lms.backend
dotnet run
```

---

## 🗄️ Database Connection Guide

สามารถใช้โปรแกรมจัดการฐานข้อมูล เช่น **DBeaver**, **pgAdmin 4**, **TablePlus** หรือ **Azure Data Studio** เชื่อมต่อไปยังฐานข้อมูลได้โดยใช้ข้อมูลดังนี้:

- **Host / Server**: `localhost` (หรือ `127.0.0.1`)
- **Port**: `5433`
- **Database Name**: `LMS-DB`
- **Username**: `postgres`
- **Password**: `postgres`

### เชื่อมต่อผ่าน CLI (psql):
```bash
docker exec -it LMS-DB psql -U postgres -d LMS-DB
```
