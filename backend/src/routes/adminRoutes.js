const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const { requireAnyRole } = require('../middleware/authorize');
const { ensureProfileAccess, ensureSelfOrAdmin } = require('../middleware/ownership');
const adminController = require('../controllers/adminController');
const profileController = require('../controllers/profileController');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(authenticate, requireAnyRole(ROLES.ADMIN));

router.get('/roles', adminController.listRoles);
router.get('/users', adminController.listUsersWithRoles);
router.get('/users/:userId', ensureProfileAccess, profileController.getUserById);
router.post('/users', profileController.createUser);
router.patch('/users/:userId', ensureSelfOrAdmin, profileController.updateUserById);
router.patch('/users/:userId/status', ensureSelfOrAdmin, (req, res) => {
  const status = req.body.status || 'active';
  const updated = require('../data/store').setUserStatus(req.params.userId, status);
  return res.json({ profile: require('../data/store').withoutPassword(updated) });
});
router.post('/users/:userId/roles', ensureSelfOrAdmin, adminController.assignRole);
router.delete('/users/:userId/roles/:role', ensureSelfOrAdmin, adminController.removeRole);

module.exports = router;
