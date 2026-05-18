FROM node:20-alpine AS builder

WORKDIR /app

# Install frontend deps and build
COPY ../frontend/package*.json ./frontend/
RUN cd frontend && npm install

COPY ../frontend ./frontend
RUN cd frontend && npm run build

# Install backend deps and build
COPY ../backend/package*.json ./backend/
RUN cd backend && npm install

COPY ../backend ./backend
RUN cd backend && npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/public ./public
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package.json .

EXPOSE 5000

CMD ["node", "dist/index.js"]
