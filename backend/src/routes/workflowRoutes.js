const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const { requireAnyRole } = require('../middleware/authorize');
const { ensureAmendmentAccess, ensureReductionAccess, ensureClaimAccess } = require('../middleware/ownership');
const workflowController = require('../controllers/workflowController');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.get('/amendments', authenticate, workflowController.listAmendments);
router.post('/amendments', authenticate, requireAnyRole(ROLES.CUSTOMER, ROLES.AGENT, ROLES.ADMIN), workflowController.submitAmendment);
router.patch('/amendments/:amendmentId/review', authenticate, requireAnyRole(ROLES.UNDERWRITER, ROLES.ADMIN), ensureAmendmentAccess, workflowController.reviewAmendment);

router.get('/reductions', authenticate, workflowController.listReductions);
router.post('/reductions', authenticate, requireAnyRole(ROLES.CUSTOMER, ROLES.ADMIN), workflowController.submitReduction);
router.patch('/reductions/:reductionId/review', authenticate, requireAnyRole(ROLES.UNDERWRITER, ROLES.ADMIN), ensureReductionAccess, workflowController.reviewReduction);

router.get('/claims', authenticate, workflowController.listClaims);
router.post('/claims', authenticate, requireAnyRole(ROLES.CUSTOMER, ROLES.ADMIN), workflowController.submitClaim);
router.patch('/claims/:claimId/review', authenticate, requireAnyRole(ROLES.CLAIMS_ADJUSTER, ROLES.ADMIN), ensureClaimAccess, workflowController.reviewClaim);

module.exports = router;
