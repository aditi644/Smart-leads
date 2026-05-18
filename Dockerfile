# ── Stage 1: Build Frontend ───────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ── Stage 2: Build Backend ────────────────────────────────────────────────────
FROM node:20-alpine AS backend-builder

WORKDIR /backend

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./
RUN npm run build

# ── Stage 3: Production ───────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy backend build
COPY --from=backend-builder /backend/dist ./dist
COPY --from=backend-builder /backend/node_modules ./node_modules
COPY --from=backend-builder /backend/package.json ./

# Copy frontend build into backend's public folder
COPY --from=frontend-builder /frontend/dist ./public

EXPOSE 5000

CMD ["node", "dist/index.js"]
