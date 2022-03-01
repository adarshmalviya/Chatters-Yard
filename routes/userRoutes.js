const express = require('express');
const { registerUser } = require('../controllers/userControllers');
const { authUser } = require('../controllers/userControllers');
const { allUsers } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router()

router.post('/', registerUser)
router.post('/login', authUser)
router.get('/', protect, allUsers);


module.exports = router;