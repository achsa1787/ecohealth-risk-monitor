# EcoHealth Risk Monitor — Frontend

A React + Vite frontend for the EcoHealth environmental health risk monitoring system.

## Tech Stack

- **Framework**: React 18 + Vite 5
- **Routing**: React Router v6
- **HTTP**: Axios
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Maps**: Leaflet + React Leaflet
- **Styling**: Tailwind CSS v3

## Prerequisites

- Node.js v20.14.0+
- EcoHealth backend running on port 5050

## Setup

### 1. Install
```bash
cd ecohealth_frontend
npm install
```

### 2. Run
```bash
npm run dev
```

App runs on `http://localhost:5173`

### 3. Build for production
```bash
npm run build
```

Output goes to `dist/` — served via Nginx in Docker.

## Pages

| Route | Access | Description |
|---|---|---|
| `/login` | Public | Sign in |
| `/register` | Public | Create account |
| `/dashboard` | Protected | Risk dashboard with map |
| `/alerts` | Protected | Configure alerts |
| `/history` | Protected | Risk score history and chart |
| `/profile` | Protected | Health profile and saved locations |
| `/admin` | Admin only | System monitoring |

## Features

- Personalised risk score with AI reasoning
- Interactive Leaflet map — click anywhere to get risk data
- Location search with auto-detect fallback
- Last searched location persisted in browser
- Email alert configuration
- Risk score trend chart (Recharts)
- Admin panel with system metrics

## Environment

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (default: http://localhost:5050/api) |