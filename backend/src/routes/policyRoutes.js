const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const { requireAnyRole } = require('../middleware/authorize');
const { ensurePolicyAccess } = require('../middleware/ownership');
const policyController = require('../controllers/policyController');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.get('/', authenticate, policyController.listPolicies);
router.get('/:policyId', authenticate, ensurePolicyAccess, policyController.getPolicy);
router.post('/', authenticate, requireAnyRole(ROLES.AGENT, ROLES.ADMIN), policyController.createPolicy);

module.exports = router;
