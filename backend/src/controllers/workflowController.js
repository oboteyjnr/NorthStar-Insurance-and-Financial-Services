const store = require('../data/store');
const { ROLES } = require('../config/constants');

function listAmendments(req, res) {
  const items = req.user.roles.includes(ROLES.CUSTOMER)
    ? store.amendments.filter((amendment) => amendment.requestedBy === req.user.userId)
    : store.amendments;

  return res.json({ amendments: items });
}

function submitAmendment(req, res) {
  const required = ['policyId', 'requestType', 'currentValue', 'requestedValue', 'reason'];
  const missing = required.filter((field) => !req.body[field]);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
  }

  const amendment = store.createAmendment({
    ...req.body,
    requestedBy: req.user.userId
  });

  return res.status(201).json({ amendment });
}

function reviewAmendment(req, res) {
  const { status, reviewComment } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be approved or rejected.' });
  }

  const amendment = store.reviewAmendment(req.record.amendmentId, {
    status,
    reviewedBy: req.user.userId,
    reviewComment: reviewComment || ''
  });

  return res.json({ amendment });
}

function listReductions(req, res) {
  const items = req.user.roles.includes(ROLES.CUSTOMER)
    ? store.reductions.filter((reduction) => reduction.requestedBy === req.user.userId)
    : store.reductions;

  return res.json({ reductions: items });
}

function submitReduction(req, res) {
  const required = ['policyId', 'currentCoverage', 'requestedCoverage', 'reason'];
  const missing = required.filter((field) => !req.body[field]);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
  }

  const reduction = store.createReduction({
    ...req.body,
    requestedBy: req.user.userId
  });

  return res.status(201).json({ reduction });
}

function reviewReduction(req, res) {
  const { status, reviewComment } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be approved or rejected.' });
  }

  const reduction = store.reviewReduction(req.record.reductionId, {
    status,
    reviewedBy: req.user.userId,
    reviewComment: reviewComment || ''
  });

  return res.json({ reduction });
}

function listClaims(req, res) {
  const items = req.user.roles.includes(ROLES.CUSTOMER)
    ? store.claims.filter((claim) => claim.submittedBy === req.user.userId)
    : store.claims;

  return res.json({ claims: items });
}

function submitClaim(req, res) {
  const required = ['policyId', 'claimType', 'incidentDate', 'claimAmount', 'description'];
  const missing = required.filter((field) => !req.body[field]);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
  }

  const claim = store.createClaim({
    ...req.body,
    submittedBy: req.user.userId,
    assignedAdjuster: req.body.assignedAdjuster || 'u-adjuster-1'
  });

  return res.status(201).json({ claim });
}

function reviewClaim(req, res) {
  const { status, decisionComment } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be approved or rejected.' });
  }

  const claim = store.reviewClaim(req.record.claimId, {
    status,
    decisionComment: decisionComment || '',
    assignedAdjuster: req.user.userId
  });

  return res.json({ claim });
}

module.exports = {
  listAmendments,
  submitAmendment,
  reviewAmendment,
  listReductions,
  submitReduction,
  reviewReduction,
  listClaims,
  submitClaim,
  reviewClaim
};
