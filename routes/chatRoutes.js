const express = require('express');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require('../controllers/chatControllers');
const { protect } = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/', protect, accessChat);
router.get('/', protect, fetchChats);
router.post('/group', protect, createGroupChat)
router.put('/rename', protect, renameGroup)
router.put('/groupadd', protect, addToGroup);
router.put('/groupremove', protect, removeFromGroup)

module.exports = router;