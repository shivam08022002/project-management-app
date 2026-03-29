const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/authController');
const { getNotifications, respondToInvitation } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllUsers);
router.get('/notifications', protect, getNotifications);
router.post('/notifications/:id/respond', protect, respondToInvitation);

module.exports = router;
