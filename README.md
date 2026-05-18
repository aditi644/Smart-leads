<div align="center">

# 🚀 Smart Leads Dashboard

### A Production-Ready Full Stack Lead Management System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based Login and Registration
- Password hashing with **bcrypt** (12 salt rounds)
- Auth middleware protecting all private routes
- Token auto-cleared on expiry

### 👥 Role-Based Access Control (RBAC)
- **Admin** — full access to all leads, all users, all operations
- **Sales User** — can only view, create, edit and delete their own leads
- Role enforced on both frontend (UI) and backend (API)

### 📋 Lead Management (Full CRUD)
- Create, Read, Update, Delete leads
- Fields: Name, Email, Status, Source, Notes
- Status: `New` → `Contacted` → `Qualified` → `Lost`
- Source: `Website` | `Instagram` | `Referral`
- Form validation with field-level error messages

### 🔍 Advanced Filtering & Search
- Search by name or email (case-insensitive)
- Filter by Status
- Filter by Source
- Sort by Latest or Oldest
- All filters work **simultaneously and combined**
- **Debounced search** — 400ms delay, no unnecessary API calls

### 📄 Pagination
- Backend pagination with `skip` and `limit`
- 10 records per page
- Full metadata in every response — `currentPage`, `totalPages`, `totalRecords`, `hasNextPage`, `hasPrevPage`

### 📊 Dashboard & Analytics
- Total leads count
- Qualified, Contacted, Lost breakdown
- Status-wise and Source-wise progress bars
- Real-time aggregation queries from MongoDB

### 📥 CSV Export
- Export all filtered leads as a `.csv` file
- Active filters are applied to the export
- One click download

### 🌙 Dark Mode
- Fully implemented dark and light themes
- Toggle persisted to `localStorage`
- Default: Dark mode

### 🐳 Docker Ready
- `Dockerfile` for both local and production
- `docker-compose.yml` wires MongoDB + backend + frontend together
- One command to run the entire stack locally

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Styling | TailwindCSS 3 |
| State Management | Zustand |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Build Tool | Vite |
| Backend | Node.js + Express.js + TypeScript |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcrypt |
| Validation | express-validator |
| Containerization | Docker + docker-compose |

---

## 🚀 Getting Started

### Option 1 — Docker (Recommended for local)

> Requires: [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/smart-leads-dashboard.git
cd smart-leads-dashboard

# 2. Set up backend environment
cp backend/.env.example backend/.env
# Open backend/.env and fill in your values

# 3. Start everything
docker-compose up --build
```

| Service | URL |
|---|---|
| 🌐 Frontend | http://localhost |
| ⚙️ Backend API | http://localhost:5000/api |
| 🗄️ MongoDB | mongodb://localhost:27017 |

---

### Option 2 — Local Development (without Docker)

**Prerequisites:** Node.js 18+, MongoDB running locally

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

---

### 🌱 Seed 100 Demo Leads

Populate the database with realistic data for demo purposes:

```bash
# With Docker (after docker-compose up)
docker exec -it smart-leads-backend npx ts-node src/seed.ts

# Without Docker (from backend/ folder)
npm run seed
```

**3 accounts are created:**

| Role | Email | Password |
|---|---|---|
| Admin | admin@smartleads.com | password123 |
| Sales | rahul@smartleads.com | password123 |
| Sales | priya@smartleads.com | password123 |

**100 leads are created with:**
- Realistic Indian names and company emails
- Weighted status distribution — New (35%), Contacted (30%), Qualified (20%), Lost (15%)
- Varied sources — Website (45%), Instagram (30%), Referral (25%)
- Spread across last 6 months so sorting works visibly

> ⚠️ The seed script clears existing data before inserting.

---

## ⚙️ Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=/api
```

---

## 🌐 Deployment (Render)

The app is deployed as a **single Web Service** on Render — frontend and backend served together from one container.

### Steps

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Set these settings:

| Field | Value |
|---|---|
| Root Directory | *(leave empty)* |
| Runtime | Docker |
| Dockerfile Path | `./Dockerfile` |

5. Add environment variables:

```
MONGODB_URI     = mongodb+srv://your-atlas-uri
JWT_SECRET      = your_secret
JWT_EXPIRES_IN  = 7d
NODE_ENV        = production
FRONTEND_URL    = *
```

6. Click **Deploy**

> Uses [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) as the cloud database.


