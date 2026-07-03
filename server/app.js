const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorMiddleware = require('./middleware/errorMiddleware');
const { generalLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Morgan HTTP logging
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) },
}));

// Rate limiting
app.use('/api/', generalLimiter);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── SWAGGER DOCS ─────────────────────────────────────────────────
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── ROUTES ───────────────────────────────────────────────────────
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/cities', require('./routes/cityRoutes'));
app.use('/api/v1/places', require('./routes/placeRoutes'));
app.use('/api/v1/hotels', require('./routes/hotelRoutes'));
app.use('/api/v1/itineraries', require('./routes/itineraryRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));
app.use('/api/v1/hidden-gems', require('./routes/hiddenGemRoutes'));
app.use('/api/v1/blogs', require('./routes/blogRoutes'));
app.use('/api/v1/reviews', require('./routes/reviewRoutes'));
app.use('/api/v1/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/v1/support', require('./routes/supportRoutes'));
app.use('/api/v1/weather', require('./routes/weatherRoutes'));
app.use('/api/v1/budget', require('./routes/budgetRoutes'));
app.use('/api/v1/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));

// ─── HEALTH CHECK ─────────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Travel Buddy API is running', timestamp: new Date().toISOString() });
});

// ─── 404 HANDLER ──────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── ERROR MIDDLEWARE ─────────────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
