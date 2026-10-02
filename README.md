# EcoHealth Risk Monitor — Backend

A Node.js/Express REST API that provides personalised environmental health risk assessments based on air quality, weather data, and user health profiles.

## Tech Stack

- **Runtime**: Node.js v20+
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **AI Risk Engine**: Groq (Llama 3.3 70B) with rule-based fallback
- **External APIs**: OpenAQ, OpenWeather, OpenCage Geocoding
- **Email**: Nodemailer + Gmail
- **Scheduler**: node-cron (alerts every 30 minutes)
- **Caching**: node-cache (10 minute TTL)

## Prerequisites

- Node.js v20.14.0+
- MongoDB (local or Atlas)
- API keys for OpenAQ, OpenWeather, OpenCage, Groq

## Setup

### 1. Clone and install
```bash
git clone <repo-url>
cd ecohealth_backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Fill in all values in `.env`:

| Variable | Description |
|---|---|
| `PORT` | Server port (default 5050) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `OPENAQ_API_KEY` | OpenAQ v3 API key |
| `OPENWEATHER_API_KEY` | OpenWeather API key |
| `OPENCAGE_API_KEY` | OpenCage geocoding API key |
| `GMAIL_USER` | Gmail address for alerts |
| `GMAIL_APP_PASSWORD` | Gmail app password (not account password) |
| `GROQ_API_KEY` | Groq API key for AI risk engine |
| `RISK_ENGINE_MODE` | `RULE` for rule-based, `AI` for Groq AI |

### 3. Run
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5050`

## API Endpoints

### Auth

POST /api/auth/register
POST /api/auth/login

### Risk Dashboard
GET /api/risk                    # Auto-detect location
GET /api/risk?query=Dublin       # By location name
GET /api/risk?lat=53.3&lon=-6.2  # By coordinates

### User Profile
GET /api/users/profile
PUT /api/users/profile

### Alerts
GET    /api/alerts
POST   /api/alerts
DELETE /api/alerts/:id
PATCH  /api/alerts/:id/toggle

### History
GET /api/history?page=1&limit=20

### Admin (admin role required)
GET  /api/admin/metrics
GET  /api/admin/stats
GET  /api/admin/api-status
POST /api/admin/refresh
GET  /api/admin/users
GET  /api/admin/users/:id
DELETE /api/admin/users/:id
PATCH  /api/admin/users/:id/role
GET  /api/admin/users/:id/history
GET  /api/admin/history
GET  /api/admin/alerts

## Risk Engine

The system supports two risk calculation modes set via `RISK_ENGINE_MODE`:

- **RULE** — deterministic rule-based scoring using AQI, weather and sensitivity multipliers
- **AI** — Groq Llama 3.3 70B reasons over environmental and health data to produce a score, level, recommendations and reasoning. Falls back to rule-based if API is unavailable.

## Project Structure
src/
├── config/          # DB and API config
├── controllers/     # Route handlers
├── middlewares/     # Auth, validation, rate limiting
├── models/          # Mongoose schemas
├── routes/          # Express routers
├── services/        # Business logic
│   └── risk/        # Risk engine (rules, strategies, calculators)
├── utils/           # Helpers (cache, retry, JWT)
└── validators/      # Joi schemas

## Environment Notes

- Rate limiting: 100 req/15min general, 10 req/15min auth, 20 req/5min risk
- Cache TTL: 10 minutes per coordinate pair
- Alert scheduler: runs every 30 minutes
- Default fallback location: Dublin, Ireland (localhost only)