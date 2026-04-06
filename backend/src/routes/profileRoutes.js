const express = require('express');
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/authenticate');
const { requireAnyRole } = require('../middleware/authorize');
const { ensureProfileAccess } = require('../middleware/ownership');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.get('/me', authenticate, profileController.getOwnProfile);
router.patch('/me', authenticate, profileController.updateOwnProfile);

router.get('/users', authenticate, requireAnyRole(ROLES.ADMIN, ROLES.COMPLIANCE_OFFICER), profileController.listUsers);
router.post('/users', authenticate, requireAnyRole(ROLES.ADMIN), profileController.createUser);
router.get('/users/:userId', authenticate, ensureProfileAccess, profileController.getUserById);
router.patch('/users/:userId', authenticate, requireAnyRole(ROLES.ADMIN), profileController.updateUserById);
router.patch('/users/:userId/activate', authenticate, requireAnyRole(ROLES.ADMIN), profileController.activateUser);
router.patch('/users/:userId/deactivate', authenticate, requireAnyRole(ROLES.ADMIN), profileController.deactivateUser);

module.exports = router;
