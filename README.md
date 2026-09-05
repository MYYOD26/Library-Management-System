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

## ✨ Features (Current)

- **🔐 Login & Roles (JWT Auth)** — เข้าสู่ระบบด้วย JWT Token, แยกสิทธิ์ 3 ระดับ:
  | Role | สิทธิ์ |
  | :--- | :--- |
  | **Admin** | ทุกอย่าง + จัดการผู้ใช้ระบบ (สร้างบัญชี, กำหนด Role, รีเซ็ตรหัสผ่าน) |
  | **Librarian** | จัดการหนังสือ / หมวดหมู่ / สมาชิก / บันทึกยืม-คืน |
  | **Member** | ดูข้อมูลหนังสือ, หมวดหมู่ และรายการยืม-คืน (อ่านอย่างเดียว) |

  บัญชีทดลอง (seed อัตโนมัติ): `admin / Admin123!`, `librarian / Librarian123!`, `member / Member123!`
  > ⚠️ JWT Key ตั้งไว้ใน `appsettings.json` → `Jwt:Key` เป็นค่า default สำหรับ dev — เปลี่ยนก่อนใช้ production (override ผ่าน env `Jwt__Key`)

- **📊 Dashboard** — สถิติภาพรวม (หนังสือทั้งหมด, กำลังยืม, ครบกำหนดวันนี้, สมาชิก) + หนังสือเข้าใหม่ล่าสุด ดึงข้อมูลจาก API จริง
- **📚 สำรวจหนังสือ (`/books`)** — ค้นหา (ชื่อ/ผู้แต่ง/ISBN), กรองตามหมวดหมู่และสถานะ, แบ่งหน้า, การ์ดแสดงจำนวนเล่มคงเหลือ พร้อม CRUD หนังสือและปุ่มบันทึกการยืม
- **🗂️ หมวดหมู่หนังสือ (`/categories`)** — เพิ่ม/แก้ไข/ลบหมวดหมู่ (ป้องกันการลบหมวดหมู่ที่มีหนังสืออยู่)
- **🔄 รายการยืม-คืน (`/borrowings`)** — แท็บ "กำลังยืม / เกินกำหนด / ประวัติการคืน", ค้นหา, ปุ่มรับคืน
- **👥 จัดการสมาชิก (`/members`)** — CRUD สมาชิก พร้อมรหัสสมาชิกอัตโนมัติ (LIB-0001) และสถานะเปิด/ปิดการใช้งาน
- **กฎการยืม** — ยืมได้เล่มละ 14 วัน, สมาชิกยืมค้างได้สูงสุด 3 เล่ม (ปรับได้ใน `appsettings.json` → `Borrowing`)

---

## 🗃️ Backend Structure (`lms.backend`)

```
lms.backend/
├── Controllers/        # Auth, Users, Books, Categories, Members, Borrowings, Dashboard
├── Entities/           # AppUser, Book, Category, Member, BorrowRecord (EF Core)
├── Dtos/               # Request/Response DTOs (C# records)
├── Data/               # AppDbContext + DbSeeder (ข้อมูลตัวอย่าง seed อัตโนมัติ)
├── Services/           # TokenService (ออก JWT)
├── Migrations/         # EF Core migrations (สร้าง schema อัตโนมัติตอน startup)
└── Program.cs          # DI wiring, CORS, JWT auth, auto-migrate + seed
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | สิทธิ์ |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | เข้าสู่ระบบ → รับ JWT | สาธารณะ |
| `GET` | `/api/auth/me` | ข้อมูลผู้ใช้ปัจจุบันจาก token | ทุก role |
| `POST` | `/api/auth/change-password` | เปลี่ยนรหัสผ่านของตัวเอง | ทุก role |
| `GET / POST` | `/api/users` | รายชื่อ / เพิ่มผู้ใช้ระบบ | Admin |
| `PUT / DELETE` | `/api/users/{id}` | แก้ไข / ลบผู้ใช้ระบบ | Admin |
| `POST` | `/api/users/{id}/reset-password` | รีเซ็ตรหัสผ่านให้ผู้ใช้อื่น | Admin |
| `GET` | `/api/books?search=&categoryId=&status=&page=&pageSize=` | รายการหนังสือ (ค้นหา + กรอง + แบ่งหน้า) | ทุก role |
| `POST / PUT / DELETE` | `/api/books` | เพิ่ม / แก้ไข / ลบหนังสือ | Admin, Librarian |
| `GET / POST` | `/api/categories` | หมวดหมู่ / เพิ่มหมวดหมู่ | GET ทุก role, POST Admin+Librarian |
| `PUT / DELETE` | `/api/categories/{id}` | แก้ไข / ลบหมวดหมู่ | Admin, Librarian |
| `GET / POST` | `/api/members?search=` | รายชื่อ / เพิ่มสมาชิก | GET ทุก role, POST Admin+Librarian |
| `PUT / DELETE` | `/api/members/{id}` | แก้ไข / ลบสมาชิก | Admin, Librarian |
| `GET` | `/api/borrowings?status=active\|overdue\|returned&search=` | รายการยืม-คืน | ทุก role |
| `POST` | `/api/borrowings/borrow` | บันทึกการยืม (body: `bookId`, `memberId`) | Admin, Librarian |
| `POST` | `/api/borrowings/{id}/return` | รับคืนหนังสือ | Admin, Librarian |
| `GET` | `/api/dashboard/stats` | สถิติแดชบอร์ด | ทุก role |
| `GET` | `/api/dashboard/recent-books` | หนังสือเข้าใหม่ล่าสุด | ทุก role |

> ทุก endpoint ยกเว้น `/api/auth/login` ต้องแนบ header `Authorization: Bearer <token>`

OpenAPI (Swagger) พร้อมใช้งานตอนรันโหมด Development ที่ `http://localhost:5139/openapi/v1.json`

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
