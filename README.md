# ✈️ Travel Buddy

A full-stack MERN travel planning platform — your all-in-one companion for planning trips, booking hotels & transport, and discovering hidden gems.

---

## 🚀 Features

- **AI Trip Planner** — Generate day-by-day itineraries with AI or build your own
- **Hotel Booking** — Real-time search via Amadeus API with room selection
- **Train Booking** — IRCTC API integration with visual seat maps
- **Bus Booking** — RedBus API integration with visual seat maps
- **Hidden Gems** — Curated local spots and famous food by expert contributors
- **Weather Forecast** — OpenWeatherMap integration per city/day
- **Budget Estimator** — Real-time cost breakdown for trips
- **Community Blog** — Travel stories from users
- **Leaderboard** — Top-rated places and hotels
- **Admin Dashboard** — Full content, user, booking, and analytics management
- **Dark/Light Mode** — Toggle in settings

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (CRA), React Bootstrap, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (auto-refresh), Google OAuth |
| Email | Nodemailer + Gmail SMTP |
| APIs | Amadeus, IRCTC, RedBus, Google Maps, OpenWeatherMap |
| Docs | Swagger/OpenAPI |
| Logging | Morgan + Winston |

---

## 📁 Project Structure

```
travel-buddy/
├── client/          # React frontend
│   └── src/
│       ├── api/     # Axios API service functions
│       ├── components/  # Reusable UI components
│       ├── context/     # Auth & Theme context
│       ├── pages/       # Page components
│       └── utils/       # Axios instance, helpers
└── server/          # Express backend
    ├── config/      # DB & Swagger config
    ├── controllers/ # Route handlers
    ├── middleware/  # Auth, error, rate limit, upload
    ├── models/      # Mongoose schemas
    ├── routes/      # Express route definitions
    ├── services/    # Third-party API integrations
    ├── seed/        # Database seed scripts
    └── utils/       # Logger, token generator
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- API keys (see Environment Variables)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/travel-buddy.git
cd travel-buddy
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env   # Fill in your environment variables
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm start
```

### 4. Seed the Database (optional)
```bash
cd server
npm run seed
```

This creates:
- Admin user: `admin@travelbuddy.com` / `admin123`
- Sample user: `user@travelbuddy.com` / `admin123`
- Sample cities, places, hotels, hidden gems, food shops

---

## 🔑 Environment Variables

Copy `server/.env` and fill in:

```env
# Server
PORT=5000
MONGO_URI=mongodb+srv://...

# JWT
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Google APIs
GOOGLE_MAPS_API_KEY=...
GOOGLE_PLACES_API_KEY=...

# Amadeus (Hotels)
AMADEUS_CLIENT_ID=...
AMADEUS_CLIENT_SECRET=...

# IRCTC (Trains via RapidAPI)
IRCTC_API_KEY=...

# RedBus (Buses via RapidAPI)
REDBUS_API_KEY=...

# OpenWeatherMap
OPENWEATHER_API_KEY=...

# Gmail SMTP
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

---

## 📚 API Documentation

Once the server is running, visit:
```
http://localhost:5000/api/v1/docs
```

---

## 🌐 API Endpoints

| Module | Base Route |
|--------|-----------|
| Auth | `/api/v1/auth` |
| Users | `/api/v1/users` |
| Cities | `/api/v1/cities` |
| Places | `/api/v1/places` |
| Hotels | `/api/v1/hotels` |
| Itineraries | `/api/v1/itineraries` |
| Bookings | `/api/v1/bookings` |
| Hidden Gems | `/api/v1/hidden-gems` |
| Blogs | `/api/v1/blogs` |
| Reviews | `/api/v1/reviews` |
| Wishlist | `/api/v1/wishlist` |
| Support | `/api/v1/support` |
| Weather | `/api/v1/weather` |
| Budget | `/api/v1/budget` |
| Leaderboard | `/api/v1/leaderboard` |
| Admin | `/api/v1/admin` |

---

## 👤 Default Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@travelbuddy.com | admin123 |
| User | user@travelbuddy.com | admin123 |

---

## 📝 License

MIT License — feel free to use and modify.
