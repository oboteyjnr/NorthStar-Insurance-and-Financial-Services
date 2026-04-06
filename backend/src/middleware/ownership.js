const store = require('../data/store');
const { ROLES } = require('../config/constants');

function userHasAnyRole(user, roles) {
  return roles.some((role) => user.roles.includes(role));
}

function canViewUserProfile(viewer, target) {
  if (!target) {
    return false;
  }

  if (viewer.userId === target.userId || viewer.roles.includes(ROLES.ADMIN) || viewer.roles.includes(ROLES.COMPLIANCE_OFFICER)) {
    return true;
  }

  if (userHasAnyRole(viewer, [ROLES.AGENT, ROLES.CUSTOMER_SERVICE]) && target.userType === 'customer') {
    return (viewer.assignedCustomerIds || []).includes(target.userId);
  }

  return false;
}

function ensureProfileAccess(req, res, next) {
  const target = store.getUserById(req.params.userId);
  if (!canViewUserProfile(req.user, target)) {
    return res.status(403).json({ message: 'You are not allowed to access that profile.' });
  }

  return next();
}

function ensureSelfOrAdmin(req, res, next) {
  if (req.user.userId === req.params.userId || req.user.roles.includes(ROLES.ADMIN)) {
    return next();
  }

  return res.status(403).json({ message: 'Admin or owner access required.' });
}

function ensurePolicyAccess(req, res, next) {
  const policy = store.getPolicyById(req.params.policyId);
  if (!policy) {
    return res.status(404).json({ message: 'Policy not found.' });
  }

  const ownsPolicy = policy.customerId === req.user.userId;
  const internalRole = userHasAnyRole(req.user, [ROLES.ADMIN, ROLES.AGENT, ROLES.UNDERWRITER, ROLES.CLAIMS_ADJUSTER, ROLES.CUSTOMER_SERVICE, ROLES.COMPLIANCE_OFFICER]);

  if (!ownsPolicy && !internalRole) {
    return res.status(403).json({ message: 'Policy access denied.' });
  }

  req.record = policy;
  return next();
}

function ensureAmendmentAccess(req, res, next) {
  const amendment = store.getAmendmentById(req.params.amendmentId);
  if (!amendment) {
    return res.status(404).json({ message: 'Amendment request not found.' });
  }

  const policy = store.getPolicyById(amendment.policyId);
  const ownsRequest = amendment.requestedBy === req.user.userId;
  const canReview = userHasAnyRole(req.user, [ROLES.ADMIN, ROLES.UNDERWRITER]);
  const canViewInternal = userHasAnyRole(req.user, [ROLES.AGENT, ROLES.CUSTOMER_SERVICE, ROLES.COMPLIANCE_OFFICER]);

  if (!ownsRequest && !canReview && !canViewInternal && policy?.customerId !== req.user.userId) {
    return res.status(403).json({ message: 'Amendment access denied.' });
  }

  req.record = amendment;
  return next();
}

function ensureReductionAccess(req, res, next) {
  const reduction = store.getReductionById(req.params.reductionId);
  if (!reduction) {
    return res.status(404).json({ message: 'Reduction request not found.' });
  }

  const ownsRequest = reduction.requestedBy === req.user.userId;
  const canReview = userHasAnyRole(req.user, [ROLES.ADMIN, ROLES.UNDERWRITER]);
  const canViewInternal = userHasAnyRole(req.user, [ROLES.AGENT, ROLES.CUSTOMER_SERVICE, ROLES.COMPLIANCE_OFFICER]);

  if (!ownsRequest && !canReview && !canViewInternal) {
    return res.status(403).json({ message: 'Reduction access denied.' });
  }

  req.record = reduction;
  return next();
}

function ensureClaimAccess(req, res, next) {
  const claim = store.getClaimById(req.params.claimId);
  if (!claim) {
    return res.status(404).json({ message: 'Claim not found.' });
  }

  const ownsRequest = claim.submittedBy === req.user.userId;
  const canReview = userHasAnyRole(req.user, [ROLES.ADMIN, ROLES.CLAIMS_ADJUSTER]);
  const canViewInternal = userHasAnyRole(req.user, [ROLES.AGENT, ROLES.CUSTOMER_SERVICE, ROLES.COMPLIANCE_OFFICER, ROLES.UNDERWRITER]);

  if (!ownsRequest && !canReview && !canViewInternal) {
    return res.status(403).json({ message: 'Claim access denied.' });
  }

  req.record = claim;
  return next();
}

module.exports = {
  ensureProfileAccess,
  ensureSelfOrAdmin,
  ensurePolicyAccess,
  ensureAmendmentAccess,
  ensureReductionAccess,
  ensureClaimAccess
};
