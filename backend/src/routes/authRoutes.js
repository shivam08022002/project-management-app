const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUserProfile, refreshAccessToken } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);
router.get('/profile', protect, getUserProfile);

module.exports = router;
