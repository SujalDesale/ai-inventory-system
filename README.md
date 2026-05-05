# AI Inventory Pro (MERN + Tailwind)
Production-ready starter including auth, products, sales, invoices, usage, reports, notifications, AI placeholder, PDF & CSV utilities, Docker setup.

## Quick Start (Local)
```bash
# 1) Run Mongo locally or via Docker
docker compose up -d mongo

# 2) Backend
cd server
cp .env.example .env
npm install
npm run dev

# 3) Frontend
cd ../client
npm install
npm run dev
```
Open http://localhost:5173

## Quick Start (Docker full stack)
```bash
docker compose up --build
```

## Env vars
- Server: see `server/.env.example`
- Client: see `client/.env.example`

## Seed data
```bash
cd server
npm run seed
```

<!-- Updated Files  -->
Client\pages\
login.jsx
Dashboard.jsx
register.jsx
