const store = require('../data/store');
const { ROLES } = require('../config/constants');

function listPolicies(req, res) {
  const isCustomer = req.user.roles.includes(ROLES.CUSTOMER);
  const policies = isCustomer
    ? store.findPoliciesByCustomerId(req.user.userId)
    : store.policies;

  return res.json({ policies });
}

function getPolicy(req, res) {
  return res.json({ policy: req.record });
}

function createPolicy(req, res) {
  const required = ['policyNumber', 'insuranceType', 'customerId', 'coverageAmount', 'premiumAmount', 'effectiveDate', 'expiryDate'];
  const missing = required.filter((field) => !req.body[field]);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
  }

  const policy = store.createPolicy({
    ...req.body,
    createdBy: req.user.userId
  });

  return res.status(201).json({ policy });
}

module.exports = {
  listPolicies,
  getPolicy,
  createPolicy
};
