const express = require('express');
const router = express.Router();
const { register, login, googleAuth, forgotPassword, resetPassword, logout } = require('../controllers/authController');
const { protect, refreshTokenHandler } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { body } = require('express-validator');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post('/register', authLimiter, [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], register);

router.post('/login', authLimiter, login);
router.post('/google', googleAuth);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/refresh-token', refreshTokenHandler);
router.post('/logout', protect, logout);

module.exports = router;
