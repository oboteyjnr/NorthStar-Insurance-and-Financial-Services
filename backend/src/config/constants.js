const ROLES = {
  CUSTOMER: 'customer',
  AGENT: 'insurance-agent',
  UNDERWRITER: 'underwriter',
  CLAIMS_ADJUSTER: 'claims-adjuster',
  CUSTOMER_SERVICE: 'customer-service',
  COMPLIANCE_OFFICER: 'compliance-officer',
  ADMIN: 'admin'
};

const INSURANCE_TYPES = ['life', 'car', 'home'];

const ACCOUNT_STATUSES = ['active', 'inactive', 'suspended'];
const REQUEST_STATUSES = ['submitted', 'under-review', 'approved', 'rejected', 'cancelled'];

module.exports = {
  ROLES,
  INSURANCE_TYPES,
  ACCOUNT_STATUSES,
  REQUEST_STATUSES
};
