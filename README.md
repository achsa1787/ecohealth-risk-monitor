# 🌿 EcoHealth Risk Monitor

> Personalised environmental health risk assessments powered by real-time air quality data, weather conditions, and AI-driven analysis.

EcoHealth translates raw environmental data into personalised, actionable health guidance. Unlike generic AQI dashboards that treat all users identically, EcoHealth factors in individual health profiles — age, asthma, and chronic conditions — to compute a meaningful risk score with tailored recommendations.

---

## 🔗 About this repository

Team project for the Internet Solutions Engineering module, MSc Data Science, Maynooth University (2025–26). It was originally built on the university GitLab and is shared here as part of my portfolio.

📄 **Full technical report:** [docs/EcoHealth_Technical_Report.pdf](docs/EcoHealth_Technical_Report.pdf)

---

## 👥 Team

| Member    | Role               | Responsibility                                                   |
| --------- | ------------------ | ---------------------------------------------------------------- |
| Abhimanyu | Backend Developer  | Node.js/Express API, MongoDB, Docker, AI/risk engine integration |
| Tina      | Frontend Developer | React UI, Tailwind CSS, Leaflet map, Recharts, auth pages        |
| Achsa     | Frontend Developer | React components, page design, frontend testing                  |

---

## 🛠️ Tech Stack

| Layer          | Technology                                 |
| -------------- | ------------------------------------------ |
| Frontend       | React 18, Vite 5, Tailwind CSS 3           |
| Routing        | React Router v6                            |
| HTTP           | Axios (JWT interceptor)                    |
| Forms          | React Hook Form                            |
| Charts         | Recharts                                   |
| Maps           | Leaflet + React Leaflet                    |
| Backend        | Node.js 20, Express.js                     |
| Database       | MongoDB 7, Mongoose                        |
| Authentication | JWT + bcrypt                               |
| Validation     | Joi                                        |
| AI Engine      | Groq Llama 3.3 70B (rule-based fallback)   |
| Email          | Nodemailer + Gmail SMTP                    |
| Scheduler      | node-cron (every 30 minutes)               |
| Caching        | node-cache (10 min TTL)                    |
| Rate Limiting  | express-rate-limit                         |
| Deployment     | Docker, Nginx, docker-compose              |
| External APIs  | OpenAQ v3, OpenWeather, OpenCage Geocoding |

---

## ⚙️ Prerequisites

Before running the project make sure you have:

- **Docker Desktop** installed and running — [download here](https://www.docker.com/products/docker-desktop)
- API keys for the following services:
  - [OpenAQ](https://openaq.org) — air quality data
  - [OpenWeather](https://openweathermap.org/api) — weather data
  - [OpenCage](https://opencagedata.com) — geocoding
  - [Groq](https://console.groq.com) — AI risk engine (free tier)
- A Gmail account with **App Password** enabled for email alerts

---

## 🚀 How to Run

### Step 1 — Clone the repository

```bash
git clone https://github.com/achsa1787/ecohealth-risk-monitor.git
cd ecohealth-risk-monitor
```

### Step 2 — Set up environment variables

```bash
cp ecohealth_backend/.env.example ecohealth_backend/.env
```

Open `ecohealth_backend/.env` and fill in your API keys:

```env
PORT=5050
MONGO_URI=mongodb://mongodb:27017/ecohealth
JWT_SECRET=your_secret_key_here

OPENAQ_API_KEY=your_openaq_key
OPENWEATHER_API_KEY=your_openweather_key
GEOCODING_API_KEY=your_opencage_key
GROQ_API_KEY=your_groq_key

GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password

RISK_ENGINE_MODE=RULE
FRONTEND_URL=http://localhost
```

Also create a root `.env` file with the same values:

```bash
cp ecohealth_backend/.env.example .env
```

> 💡 To get a Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords

### Step 3 — Build and start all containers

```bash
docker-compose up --build
```

This builds and starts three containers:

- **MongoDB** — database (internal port 27017)
- **Backend API** — Express server (port 5050)
- **Frontend** — React app served via Nginx (port 80)

First build takes 3–5 minutes. You should see in the terminal:

```
MongoDB Connected
[DB] Indexes created successfully
[Scheduler] Alert scheduler started — running every 30 minutes
Server running on port 5050
```

### Step 4 — Access the application

| Service                 | URL                              |
| ----------------------- | -------------------------------- |
| **Frontend (main app)** | http://localhost                 |
| **Backend API**         | http://localhost:5050            |
| **Health check**        | http://localhost:5050/api/health |

---

## 👤 Creating a User Account

1. Go to **http://localhost/register**
2. Fill in your name, email and password
3. Optionally add your health profile (age, asthma, other conditions)
4. Click **Create Account** — you will be logged in automatically and taken to the dashboard

---

## 🔐 Creating an Admin Account

Admin accounts have access to the Admin Panel which shows system metrics, user management, API status monitoring and cache control.

**Step 1 — Register a normal account first** at http://localhost/register

**Step 2 — Open a terminal and connect to the MongoDB container:**

```bash
docker exec -it $(docker-compose ps -q mongodb) mongosh
```

**Step 3 — Inside the mongosh prompt run these commands:**

```js
use ecohealth

db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)

exit
```

You should see:

```
{ acknowledged: true, matchedCount: 1, modifiedCount: 1 }
```

**Step 4 — Logout and login again**

Go to http://localhost, logout, and login again with the same account. The **Admin** tab will now appear in the navbar.

**What admins can do:**

- View system uptime, memory usage, Node version and active risk engine mode
- See platform statistics — total users, average risk score, top locations, risk distribution
- Manage all users — view, delete, promote or demote roles
- Monitor external API status (OpenAQ and OpenWeather live ping)
- Force clear the data cache for specific locations or all locations
- View all alerts and risk history across all users

---

## 🔄 Stopping and Restarting

```bash
# Stop all containers (data is preserved in Docker volume)
docker-compose down

# Start again without rebuild
docker-compose up -d

# Start with rebuild after code changes
docker-compose up --build -d

# View live backend logs
docker-compose logs -f backend

# Check container status
docker-compose ps
```

---

## 🔑 Environment Variables Reference

| Variable              | Description                               | Required |
| --------------------- | ----------------------------------------- | -------- |
| `PORT`                | Backend server port (default 5050)        | Yes      |
| `MONGO_URI`           | MongoDB connection string                 | Yes      |
| `JWT_SECRET`          | Secret key for JWT token signing          | Yes      |
| `OPENAQ_API_KEY`      | OpenAQ v3 API key                         | Yes      |
| `OPENWEATHER_API_KEY` | OpenWeather API key                       | Yes      |
| `GEOCODING_API_KEY`   | OpenCage geocoding API key                | Yes      |
| `GROQ_API_KEY`        | Groq API key for AI risk engine           | Yes      |
| `GMAIL_USER`          | Gmail address for sending alerts          | Yes      |
| `GMAIL_APP_PASSWORD`  | Gmail app password (not account password) | Yes      |
| `RISK_ENGINE_MODE`    | `RULE` for rule-based, `AI` for Groq AI   | Yes      |
| `FRONTEND_URL`        | Frontend URL for password reset emails    | Yes      |

> ⚠️ Never commit your `.env` file. It is listed in `.gitignore`.

---

## 📁 Project Structure

```
ecohealth-risk-monitor/
├── docker-compose.yml              ← Orchestrates all three containers
├── docs/                           ← Technical report (PDF)
├── .gitignore
├── README.md
│
├── ecohealth_backend/
│   ├── server.js                   ← Entry point
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js                  ← Express setup, middleware chain
│       ├── config/
│       │   ├── db.js               ← MongoDB connection
│       │   ├── apiConfig.js        ← External API configuration
│       │   └── indexes.js          ← MongoDB compound indexes
│       ├── controllers/            ← Route handlers (MVC)
│       ├── services/               ← Business logic
│       │   └── risk/               ← Risk engine (Strategy Pattern)
│       │       ├── riskEngine.js
│       │       ├── strategies/
│       │       │   ├── ruleBased.strategy.js
│       │       │   └── ml.strategy.js
│       │       └── rules/
│       ├── models/                 ← Mongoose schemas
│       │   ├── user.model.js
│       │   ├── alert.model.js
│       │   └── riskHistory.model.js
│       ├── routes/                 ← Express routers
│       ├── middlewares/            ← Auth, validation, rate limiting
│       ├── utils/                  ← Cache, retry, JWT helpers
│       ├── validators/             ← Joi schemas
│       └── scheduler.js            ← node-cron alert scheduler
│
└── ecohealth_frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── .env.example
    ├── package.json
    └── src/
        ├── App.jsx                 ← Routes (public, protected, admin)
        ├── api/axios.js            ← Axios with JWT interceptor
        ├── context/AuthContext.jsx ← Auth state management
        ├── components/
        │   ├── common/Navbar.jsx
        │   └── dashboard/LocationMap.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── ForgotPassword.jsx
            ├── ResetPassword.jsx
            ├── Dashboard.jsx
            ├── Profile.jsx
            ├── Alerts.jsx
            ├── History.jsx
            ├── Admin.jsx
            └── NotFound.jsx
```

---

## 📡 Key API Endpoints

| Method | Endpoint                      | Description                                        | Auth     |
| ------ | ----------------------------- | -------------------------------------------------- | -------- |
| POST   | `/api/auth/register`          | Create account with optional health profile        | None     |
| POST   | `/api/auth/login`             | Login and receive JWT token                        | None     |
| POST   | `/api/auth/forgot-password`   | Send password reset email                          | None     |
| POST   | `/api/auth/reset-password`    | Reset password with token                          | None     |
| GET    | `/api/risk`                   | Personalised risk dashboard (auto-detect location) | Optional |
| GET    | `/api/risk?query=Dublin`      | Risk data for named location                       | Optional |
| GET    | `/api/risk?lat=53.3&lon=-6.2` | Risk data for coordinates                          | Optional |
| GET    | `/api/users/profile`          | Get current user profile                           | JWT      |
| PUT    | `/api/users/profile`          | Update health profile and saved locations          | JWT      |
| POST   | `/api/alerts`                 | Create new alert with threshold                    | JWT      |
| GET    | `/api/alerts`                 | List all alerts                                    | JWT      |
| DELETE | `/api/alerts/:id`             | Delete an alert                                    | JWT      |
| PATCH  | `/api/alerts/:id/toggle`      | Toggle alert active/paused                         | JWT      |
| GET    | `/api/history`                | Paginated risk history (max 50 records)            | JWT      |
| GET    | `/api/location?query=Dublin`  | Resolve location + environmental preview           | None     |
| GET    | `/api/admin/metrics`          | System uptime, memory, risk engine mode            | Admin    |
| GET    | `/api/admin/stats`            | Platform statistics                                | Admin    |
| GET    | `/api/admin/api-status`       | Live ping of external APIs                         | Admin    |
| POST   | `/api/admin/refresh`          | Clear cache                                        | Admin    |
| GET    | `/api/admin/users`            | All registered users                               | Admin    |
| DELETE | `/api/admin/users/:id`        | Delete a user                                      | Admin    |
| PATCH  | `/api/admin/users/:id/role`   | Promote or demote user role                        | Admin    |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│  PRESENTATION LAYER  (Port 80)          │
│  React 18 + Vite 5 + Tailwind CSS       │
│  Served via Nginx Alpine container      │
└──────────────────┬──────────────────────┘
                   │ REST API (Axios + JWT)
┌──────────────────┴──────────────────────┐
│  BUSINESS LOGIC LAYER  (Port 5050)      │
│  Node.js 20 + Express.js (MVC)          │
│  Risk Engine (Strategy Pattern)         │
│  JWT Auth + Joi Validation + Caching    │
└──────────────────┬──────────────────────┘
                   │ Mongoose ODM
┌──────────────────┴──────────────────────┐
│  DATA LAYER  (Port 27017)               │
│  MongoDB 7 (persistent Docker volume)   │
└──────────────────┬──────────────────────┘
                   │ External APIs
┌─────────────────────────────────────────┐
│  EXTERNAL SERVICES                      │
│  OpenAQ v3  ·  OpenWeather              │
│  OpenCage  ·  Groq  ·  Gmail           │
└─────────────────────────────────────────┘
```

### Design Patterns

| Pattern          | Where Applied                                               |
| ---------------- | ----------------------------------------------------------- |
| MVC              | Express controllers, services, Mongoose models              |
| Strategy         | Risk engine — swap AI/rule-based via `RISK_ENGINE_MODE`     |
| Repository       | Service layer abstracts all MongoDB access from controllers |
| Middleware Chain | Auth, validation, rate limiting, error handling             |
| Observer         | node-cron scheduler evaluates alerts every 30 minutes       |

---

## 🧠 Risk Engine

Two modes switchable via `RISK_ENGINE_MODE` in your `.env`:

**Rule-Based (`RISK_ENGINE_MODE=RULE`):**

```
Base Score = AQI Score + Weather Score
Final Score = Base Score × User Sensitivity Multiplier

Multipliers:
  Asthma:                +0.3
  Age > 60:              +0.2
  Other conditions:      +0.1 per condition
  No profile (guest):    ×1.0 (default)
```

**AI Mode (`RISK_ENGINE_MODE=AI`):**
Sends environmental data and user health profile to Groq Llama 3.3 70B.
Returns score, level, recommendations and a plain-English reasoning explanation.
Automatically falls back to rule-based if the Groq API is unavailable.

---

## ✨ Features

| Feature                 | Description                                                      |
| ----------------------- | ---------------------------------------------------------------- |
| Personalised Risk Score | AQI + weather + health profile = individual score 0–100          |
| AI Analysis             | Groq Llama 3.3 70B generates context-aware recommendations       |
| Interactive Map         | Click anywhere on Leaflet map to get risk data for that location |
| Location Search         | Search any city or place by name                                 |
| Auto-detect Location    | Browser geolocation or IP-based fallback                         |
| Email Alerts            | Notifications when risk exceeds your configured threshold        |
| Risk History            | Trend chart showing score changes over time (max 50 records)     |
| Health Profile          | Age, asthma, chronic conditions affect your personalised score   |
| Password Reset          | Secure email token-based password recovery (1 hour expiry)       |
| Admin Panel             | System metrics, user management, API monitoring, cache control   |

---

## ⚠️ Known Limitations

- Email alert templates are hardcoded (no admin template management UI)
- Logging uses console output only (no structured log storage)
- IP geolocation defaults to Dublin, Ireland on localhost during development
- Docker MongoDB is a fresh database — existing local data does not transfer automatically

---

## 🔮 Future Work

- CI/CD pipeline via GitHub Actions deploying to Docker Hub on merge to main
- Redis replacing node-cache for distributed multi-server caching
- WebSocket for real-time risk score updates without page refresh
- Progressive Web App (PWA) with offline support
- Push notifications via Web Push API
- Custom ML model trained on accumulated risk score data
- CSV/PDF export of risk history for sharing with healthcare providers
- Global default threshold management for administrators

---

## 📚 References

- World Health Organization (2021). WHO Global Air Quality Guidelines. Geneva: WHO Press.
- Cheng, S. et al. (2024). Variable importance measure for spatial ML models applied to air pollution. Environmental Health Perspectives.
- Institute for Health Metrics and Evaluation (2020). Global Burden of Disease: Air Pollution Risk Factors. Seattle: IHME.
- Zounemat-Kermani, N. et al. (2025). AI-driven framework for personalised health response to air pollution. Nature Digital Medicine.

---

_Internet Solutions Engineering — Department of Computer Science, Maynooth University — 2024–2025_
