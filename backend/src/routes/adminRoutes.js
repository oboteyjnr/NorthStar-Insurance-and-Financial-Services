const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const { requireAnyRole } = require('../middleware/authorize');
const adminController = require('../controllers/adminController');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(authenticate, requireAnyRole(ROLES.ADMIN));

router.get('/rbac/roles', adminController.listRoles);
router.get('/roles', adminController.listRoles);

router.get('/users', adminController.listUsersWithRoles);
router.get('/users/:userId', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:userId', adminController.updateUser);
router.patch('/users/:userId', adminController.updateUser);
router.put('/users/:userId/status', adminController.updateUserStatus);
router.patch('/users/:userId/status', adminController.updateUserStatus);

router.put('/rbac/users/:userId/roles', adminController.replaceUserRoles);

router.post('/users/:userId/roles', adminController.assignRole);
router.delete('/users/:userId/roles/:role', adminController.removeRole);

module.exports = router;
