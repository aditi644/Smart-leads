# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack + TypeScript.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-Mandatory-blue) ![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

### Core
- **JWT Authentication** — Register, Login, Protected Routes, bcrypt password hashing
- **Lead CRUD** — Create, Read, Update, Delete leads with full validation
- **Advanced Filtering** — Filter by Status, Source, search by Name/Email — all combined
- **Sorting** — Latest / Oldest
- **Backend Pagination** — 10 records/page with full metadata
- **Debounced Search** — 400ms debounce to avoid excessive API calls
- **CSV Export** — Export filtered leads as a downloadable CSV
- **Role-Based Access Control** — Admin sees all leads; Sales users see only their own
- **Dark Mode** — Toggleable, persisted to localStorage

### Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, TypeScript, TailwindCSS, Vite |
| State     | Zustand                                 |
| Backend   | Node.js, Express.js, TypeScript         |
| Database  | MongoDB + Mongoose                      |
| Auth      | JWT + bcrypt                            |
| Container | Docker + docker-compose                 |

---

## Project Structure

```
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   │   ├── auth.controller.ts
│   │   │   └── lead.controller.ts
│   │   ├── middleware/       # Auth, validation, error handling
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validate.ts
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   └── Lead.ts
│   │   ├── routes/           # Express routers
│   │   │   ├── auth.routes.ts
│   │   │   └── lead.routes.ts
│   │   ├── types/            # TypeScript interfaces & enums
│   │   ├── utils/            # Helpers (response builder)
│   │   ├── validators/       # express-validator chains
│   │   └── index.ts          # App entry point
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios services (auth, leads)
│   │   ├── components/
│   │   │   ├── auth/         # ProtectedRoute, PublicRoute
│   │   │   ├── layout/       # Sidebar + topbar Layout
│   │   │   ├── leads/        # LeadsTable, LeadForm, Filters, Pagination, DetailModal
│   │   │   └── ui/           # Spinner, Badges, Modal, EmptyState, Skeleton
│   │   ├── hooks/            # useLeads, useDebounce
│   │   ├── pages/            # LoginPage, RegisterPage, DashboardPage, LeadsPage
│   │   ├── store/            # Zustand (authStore, themeStore)
│   │   ├── types/            # Shared TypeScript types
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## Setup Instructions

### Option 1 — Docker (Recommended)

```bash
# Clone the repo
git clone <your-repo-url>
cd smart-leads-dashboard

# Copy and fill in backend env
cp backend/.env.example backend/.env
# Edit backend/.env — set JWT_SECRET to something strong

# Build and start all services
docker-compose up --build

# App will be available at:
# Frontend → http://localhost
# Backend  → http://localhost:5000
# MongoDB  → mongodb://localhost:27017
```

---

### Option 2 — Local Development

#### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`)

#### Backend

```bash
cd backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env — fill in MONGODB_URI, JWT_SECRET, etc.

# Run in development mode (ts-node-dev with hot reload)
npm run dev

# Build for production
npm run build
npm start
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# VITE_API_URL defaults to /api (proxied by Vite to localhost:5000)

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

All protected routes require:
```
Authorization: Bearer <token>
```

---

### Auth Endpoints

#### POST `/auth/register`
Create a new user account.

**Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "secret123",
  "role": "sales"
}
```
`role` is optional — defaults to `"sales"`. Accepted values: `"admin"` | `"sales"`.

**Response `201`:**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "token": "<jwt>",
    "user": { "id": "...", "name": "Rahul Sharma", "email": "...", "role": "sales" }
  }
}
```

---

#### POST `/auth/login`
Authenticate and receive a token.

**Body:**
```json
{ "email": "rahul@example.com", "password": "secret123" }
```

**Response `200`:**
```json
{
  "success": true,
  "data": { "token": "<jwt>", "user": { ... } }
}
```

---

#### GET `/auth/me` 🔒
Get the currently authenticated user.

---

#### GET `/auth/users` 🔒 Admin only
List all users.

---

### Leads Endpoints

#### GET `/leads` 🔒
Fetch paginated leads with optional filters.

**Query Parameters:**

| Param    | Type   | Description                          |
|----------|--------|--------------------------------------|
| `page`   | number | Page number (default: 1)             |
| `limit`  | number | Records per page (default: 10, max: 50) |
| `status` | string | `New` \| `Contacted` \| `Qualified` \| `Lost` |
| `source` | string | `Website` \| `Instagram` \| `Referral` |
| `search` | string | Searches name and email (case-insensitive) |
| `sort`   | string | `latest` (default) \| `oldest`       |

**Example:**
```
GET /leads?status=Qualified&source=Instagram&search=Rahul&page=1&sort=latest
```

**Response `200`:**
```json
{
  "success": true,
  "data": [ { ...lead }, ... ],
  "meta": {
    "currentPage": 1,
    "totalPages": 4,
    "totalRecords": 38,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### GET `/leads/stats` 🔒
Get counts grouped by status and source.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 42,
    "statusStats": [{ "_id": "New", "count": 12 }, ...],
    "sourceStats": [{ "_id": "Website", "count": 20 }, ...]
  }
}
```

---

#### GET `/leads/export/csv` 🔒
Export filtered leads as a CSV file. Accepts the same query params as `GET /leads`.

---

#### GET `/leads/:id` 🔒
Get a single lead by ID.

---

#### POST `/leads` 🔒
Create a new lead.

**Body:**
```json
{
  "name": "Priya Singh",
  "email": "priya@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Interested in enterprise plan"
}
```

---

#### PATCH `/leads/:id` 🔒
Partially update a lead. All fields optional.

---

#### DELETE `/leads/:id` 🔒
Delete a lead. Sales users can only delete their own leads.

---

### Standard Error Response

```json
{
  "success": false,
  "message": "Error description here."
}
```

Validation errors (`422`):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" }
  ]
}
```

---

## Role-Based Access Control

| Action               | Admin | Sales User          |
|----------------------|-------|---------------------|
| View all leads       | ✅    | ❌ (own only)       |
| View own leads       | ✅    | ✅                  |
| Create lead          | ✅    | ✅                  |
| Edit any lead        | ✅    | ❌ (own only)       |
| Delete any lead      | ✅    | ❌ (own only)       |
| Export CSV           | ✅    | ✅ (filtered)       |
| View all users       | ✅    | ❌                  |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable         | Description                        | Example                              |
|------------------|------------------------------------|--------------------------------------|
| `PORT`           | Server port                        | `5000`                               |
| `MONGODB_URI`    | MongoDB connection string          | `mongodb://localhost:27017/smart-leads` |
| `JWT_SECRET`     | Secret for signing JWTs            | `change_me_to_something_long`        |
| `JWT_EXPIRES_IN` | Token expiry                       | `7d`                                 |
| `NODE_ENV`       | Environment                        | `development` / `production`         |
| `FRONTEND_URL`   | Allowed CORS origin                | `http://localhost:5173`              |

### Frontend (`frontend/.env`)

| Variable        | Description             | Example                        |
|-----------------|-------------------------|--------------------------------|
| `VITE_API_URL`  | Backend API base URL    | `http://localhost:5000/api`    |

---

## Evaluation Checklist

- [x] TypeScript throughout (no plain JS)
- [x] Proper interfaces/types defined — `any` avoided entirely
- [x] RESTful API with correct status codes
- [x] Centralized error handling middleware
- [x] Request validation (express-validator)
- [x] JWT authentication + bcrypt
- [x] Protected routes (frontend + backend)
- [x] Role-Based Access Control (Admin / Sales)
- [x] Lead CRUD with full validation
- [x] Advanced filtering — status, source, search — all combinable
- [x] Backend pagination with metadata
- [x] Debounced search (400ms)
- [x] CSV export (with active filters applied)
- [x] Docker + docker-compose setup
- [x] Dark mode (toggleable, persisted)
- [x] Responsive UI
- [x] Loading states (skeleton loaders)
- [x] Empty states
- [x] Error states with retry
- [x] Form validation with field-level errors
- [x] Reusable component architecture
- [x] Clean folder structure
- [x] No hardcoded URLs/values
- [x] `.env.example` files provided
- [x] README with full setup + API docs

---

## Author

Built for the ServiceHive Full Stack Internship Assignment.
