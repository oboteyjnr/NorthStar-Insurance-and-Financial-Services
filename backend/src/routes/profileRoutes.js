const express = require('express');
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

router.get('/me', authenticate, profileController.getOwnProfile);
router.put('/me', authenticate, profileController.updateOwnProfile);
router.patch('/me', authenticate, profileController.updateOwnProfile);
router.patch('/me/suspend', authenticate, profileController.suspendOwnProfile);

module.exports = router;
