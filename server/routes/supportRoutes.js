const express = require('express');
const router = express.Router();
const { getUserConversation, sendUserMessage, getAllConversations, adminReply, closeConversation } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(protect);
router.get('/my', getUserConversation);
router.post('/my', sendUserMessage);
router.get('/', adminMiddleware, getAllConversations);
router.post('/:id/reply', adminMiddleware, adminReply);
router.put('/:id/close', adminMiddleware, closeConversation);

module.exports = router;
