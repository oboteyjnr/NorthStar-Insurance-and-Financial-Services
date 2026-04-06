const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const { ROLES } = require('../config/constants');

function now() {
  return new Date().toISOString();
}

function createId(prefix) {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}

function hash(password) {
  return bcrypt.hashSync(password, 10);
}

const users = [
  {
    userId: 'u-customer-1',
    username: 'customer1',
    passwordHash: hash('Password123!'),
    status: 'active',
    roles: [ROLES.CUSTOMER],
    lastLoginAt: null,
    tokenSubject: 'customer1-token',
    firstName: 'Maya',
    lastName: 'Singh',
    dateOfBirth: '1987-04-12',
    email: 'maya.singh@example.com',
    phoneNumber: '+1-416-555-0182',
    addressLine1: '145 King Street West',
    addressLine2: 'Unit 1204',
    city: 'Toronto',
    provinceOrState: 'ON',
    postalCode: 'M5H 1J8',
    country: 'Canada',
    customerNumber: 'C-10001',
    employeeNumber: '',
    userType: 'customer',
    preferredContactMethod: 'email',
    emergencyContactName: 'Arjun Singh',
    emergencyContactPhone: '+1-416-555-0144',
    createdAt: now(),
    updatedAt: now(),
    clientCategory: 'personal',
    linkedPolicies: ['pol-1', 'pol-2'],
    beneficiaryPlaceholder: 'Ava Singh',
    department: '',
    jobTitle: '',
    supervisorName: '',
    internalAccessStatus: ''
  },
  {
    userId: 'u-customer-2',
    username: 'customer2',
    passwordHash: hash('Password123!'),
    status: 'active',
    roles: [ROLES.CUSTOMER],
    lastLoginAt: null,
    tokenSubject: 'customer2-token',
    firstName: 'Noah',
    lastName: 'Brown',
    dateOfBirth: '1991-08-03',
    email: 'noah.brown@example.com',
    phoneNumber: '+1-604-555-0168',
    addressLine1: '82 Coastal Drive',
    addressLine2: '',
    city: 'Vancouver',
    provinceOrState: 'BC',
    postalCode: 'V6B 1A1',
    country: 'Canada',
    customerNumber: 'C-10002',
    employeeNumber: '',
    userType: 'customer',
    preferredContactMethod: 'phone',
    emergencyContactName: 'Emma Brown',
    emergencyContactPhone: '+1-604-555-0119',
    createdAt: now(),
    updatedAt: now(),
    clientCategory: 'personal',
    linkedPolicies: ['pol-3'],
    beneficiaryPlaceholder: 'Emma Brown',
    department: '',
    jobTitle: '',
    supervisorName: '',
    internalAccessStatus: ''
  },
  {
    userId: 'u-agent-1',
    username: 'agent1',
    passwordHash: hash('Password123!'),
    status: 'active',
    roles: [ROLES.AGENT],
    lastLoginAt: null,
    tokenSubject: 'agent1-token',
    firstName: 'Olivia',
    lastName: 'Chen',
    dateOfBirth: '1984-02-19',
    email: 'olivia.chen@northstar.local',
    phoneNumber: '+1-416-555-0201',
    addressLine1: '1 NorthStar Plaza',
    addressLine2: 'Floor 10',
    city: 'Toronto',
    provinceOrState: 'ON',
    postalCode: 'M5J 2N8',
    country: 'Canada',
    customerNumber: '',
    employeeNumber: 'E-20001',
    userType: 'internal',
    preferredContactMethod: 'email',
    emergencyContactName: 'Priya Chen',
    emergencyContactPhone: '+1-416-555-0202',
    createdAt: now(),
    updatedAt: now(),
    clientCategory: '',
    linkedPolicies: [],
    beneficiaryPlaceholder: '',
    department: 'Sales',
    jobTitle: 'Insurance Agent',
    supervisorName: 'Director of Sales',
    internalAccessStatus: 'enabled',
    assignedCustomerIds: ['u-customer-1', 'u-customer-2']
  },
  {
    userId: 'u-underwriter-1',
    username: 'underwriter1',
    passwordHash: hash('Password123!'),
    status: 'active',
    roles: [ROLES.UNDERWRITER],
    lastLoginAt: null,
    tokenSubject: 'underwriter1-token',
    firstName: 'Liam',
    lastName: 'Patel',
    dateOfBirth: '1980-11-30',
    email: 'liam.patel@northstar.local',
    phoneNumber: '+1-416-555-0211',
    addressLine1: '1 NorthStar Plaza',
    addressLine2: 'Floor 8',
    city: 'Toronto',
    provinceOrState: 'ON',
    postalCode: 'M5J 2N8',
    country: 'Canada',
    customerNumber: '',
    employeeNumber: 'E-20002',
    userType: 'internal',
    preferredContactMethod: 'email',
    emergencyContactName: 'Sara Patel',
    emergencyContactPhone: '+1-416-555-0212',
    createdAt: now(),
    updatedAt: now(),
    clientCategory: '',
    linkedPolicies: [],
    beneficiaryPlaceholder: '',
    department: 'Underwriting',
    jobTitle: 'Senior Underwriter',
    supervisorName: 'Chief Underwriting Officer',
    internalAccessStatus: 'enabled'
  },
  {
    userId: 'u-adjuster-1',
    username: 'adjuster1',
    passwordHash: hash('Password123!'),
    status: 'active',
    roles: [ROLES.CLAIMS_ADJUSTER],
    lastLoginAt: null,
    tokenSubject: 'adjuster1-token',
    firstName: 'Sophia',
    lastName: 'Reed',
    dateOfBirth: '1988-06-14',
    email: 'sophia.reed@northstar.local',
    phoneNumber: '+1-416-555-0221',
    addressLine1: '1 NorthStar Plaza',
    addressLine2: 'Floor 7',
    city: 'Toronto',
    provinceOrState: 'ON',
    postalCode: 'M5J 2N8',
    country: 'Canada',
    customerNumber: '',
    employeeNumber: 'E-20003',
    userType: 'internal',
    preferredContactMethod: 'email',
    emergencyContactName: 'Marcus Reed',
    emergencyContactPhone: '+1-416-555-0222',
    createdAt: now(),
    updatedAt: now(),
    clientCategory: '',
    linkedPolicies: [],
    beneficiaryPlaceholder: '',
    department: 'Claims',
    jobTitle: 'Claims Adjuster',
    supervisorName: 'Claims Operations Manager',
    internalAccessStatus: 'enabled'
  },
  {
    userId: 'u-csr-1',
    username: 'csr1',
    passwordHash: hash('Password123!'),
    status: 'active',
    roles: [ROLES.CUSTOMER_SERVICE],
    lastLoginAt: null,
    tokenSubject: 'csr1-token',
    firstName: 'Emma',
    lastName: 'Garcia',
    dateOfBirth: '1990-09-21',
    email: 'emma.garcia@northstar.local',
    phoneNumber: '+1-416-555-0231',
    addressLine1: '1 NorthStar Plaza',
    addressLine2: 'Floor 6',
    city: 'Toronto',
    provinceOrState: 'ON',
    postalCode: 'M5J 2N8',
    country: 'Canada',
    customerNumber: '',
    employeeNumber: 'E-20004',
    userType: 'internal',
    preferredContactMethod: 'phone',
    emergencyContactName: 'Carlos Garcia',
    emergencyContactPhone: '+1-416-555-0232',
    createdAt: now(),
    updatedAt: now(),
    clientCategory: '',
    linkedPolicies: [],
    beneficiaryPlaceholder: '',
    department: 'Customer Support',
    jobTitle: 'Customer Service Representative',
    supervisorName: 'Service Manager',
    internalAccessStatus: 'enabled',
    assignedCustomerIds: ['u-customer-1', 'u-customer-2']
  },
  {
    userId: 'u-compliance-1',
    username: 'compliance1',
    passwordHash: hash('Password123!'),
    status: 'active',
    roles: [ROLES.COMPLIANCE_OFFICER],
    lastLoginAt: null,
    tokenSubject: 'compliance1-token',
    firstName: 'Ava',
    lastName: 'Walker',
    dateOfBirth: '1982-01-08',
    email: 'ava.walker@northstar.local',
    phoneNumber: '+1-416-555-0241',
    addressLine1: '1 NorthStar Plaza',
    addressLine2: 'Floor 12',
    city: 'Toronto',
    provinceOrState: 'ON',
    postalCode: 'M5J 2N8',
    country: 'Canada',
    customerNumber: '',
    employeeNumber: 'E-20005',
    userType: 'internal',
    preferredContactMethod: 'email',
    emergencyContactName: 'Ethan Walker',
    emergencyContactPhone: '+1-416-555-0242',
    createdAt: now(),
    updatedAt: now(),
    clientCategory: '',
    linkedPolicies: [],
    beneficiaryPlaceholder: '',
    department: 'Compliance',
    jobTitle: 'Compliance Officer',
    supervisorName: 'Chief Risk Officer',
    internalAccessStatus: 'enabled'
  },
  {
    userId: 'u-admin-1',
    username: 'admin1',
    passwordHash: hash('Password123!'),
    status: 'active',
    roles: [ROLES.ADMIN],
    lastLoginAt: null,
    tokenSubject: 'admin1-token',
    firstName: 'Jordan',
    lastName: 'King',
    dateOfBirth: '1979-12-02',
    email: 'jordan.king@northstar.local',
    phoneNumber: '+1-416-555-0251',
    addressLine1: '1 NorthStar Plaza',
    addressLine2: 'Executive Floor',
    city: 'Toronto',
    provinceOrState: 'ON',
    postalCode: 'M5J 2N8',
    country: 'Canada',
    customerNumber: '',
    employeeNumber: 'E-10001',
    userType: 'internal',
    preferredContactMethod: 'email',
    emergencyContactName: 'Morgan King',
    emergencyContactPhone: '+1-416-555-0252',
    createdAt: now(),
    updatedAt: now(),
    clientCategory: '',
    linkedPolicies: [],
    beneficiaryPlaceholder: '',
    department: 'Administration',
    jobTitle: 'Platform Administrator',
    supervisorName: 'Chief Operating Officer',
    internalAccessStatus: 'enabled'
  }
];

const policies = [
  {
    policyId: 'pol-1',
    policyNumber: 'LIFE-10001',
    insuranceType: 'life',
    customerId: 'u-customer-1',
    coverageAmount: 250000,
    premiumAmount: 110,
    currency: 'CAD',
    effectiveDate: '2025-01-01',
    expiryDate: '2026-01-01',
    status: 'active',
    createdBy: 'u-agent-1',
    beneficiaryName: 'Ava Singh',
    vehicleInfo: '',
    propertyAddress: '',
    createdAt: now(),
    updatedAt: now()
  },
  {
    policyId: 'pol-2',
    policyNumber: 'CAR-10002',
    insuranceType: 'car',
    customerId: 'u-customer-1',
    coverageAmount: 60000,
    premiumAmount: 84,
    currency: 'CAD',
    effectiveDate: '2025-02-01',
    expiryDate: '2026-02-01',
    status: 'active',
    createdBy: 'u-agent-1',
    beneficiaryName: '',
    vehicleInfo: '2024 Honda Civic, VIN 1HGBH41JXMN109186',
    propertyAddress: '',
    createdAt: now(),
    updatedAt: now()
  },
  {
    policyId: 'pol-3',
    policyNumber: 'HOME-10003',
    insuranceType: 'home',
    customerId: 'u-customer-2',
    coverageAmount: 750000,
    premiumAmount: 142,
    currency: 'CAD',
    effectiveDate: '2025-03-01',
    expiryDate: '2026-03-01',
    status: 'active',
    createdBy: 'u-agent-1',
    beneficiaryName: '',
    vehicleInfo: '',
    propertyAddress: '82 Coastal Drive, Vancouver, BC',
    createdAt: now(),
    updatedAt: now()
  }
];

const amendments = [
  {
    amendmentId: 'amd-1',
    policyId: 'pol-1',
    requestedBy: 'u-customer-1',
    requestType: 'coverage-increase',
    currentValue: '250000',
    requestedValue: '300000',
    reason: 'New family protection requirement',
    status: 'submitted',
    reviewedBy: '',
    reviewComment: '',
    createdAt: now(),
    updatedAt: now()
  }
];

const reductions = [
  {
    reductionId: 'red-1',
    policyId: 'pol-2',
    requestedBy: 'u-customer-1',
    currentCoverage: 60000,
    requestedCoverage: 50000,
    reason: 'Vehicle value reduced',
    status: 'submitted',
    reviewedBy: '',
    reviewComment: '',
    createdAt: now(),
    updatedAt: now()
  }
];

const claims = [
  {
    claimId: 'clm-1',
    policyId: 'pol-3',
    submittedBy: 'u-customer-2',
    claimType: 'property-damage',
    incidentDate: '2025-11-22',
    claimAmount: 8200,
    description: 'Wind damage to roof shingles and exterior siding.',
    status: 'submitted',
    assignedAdjuster: 'u-adjuster-1',
    decisionComment: '',
    createdAt: now(),
    updatedAt: now()
  }
];

function getUsers() {
  return users;
}

function getRoles() {
  return Object.values(ROLES);
}

function getUserById(userId) {
  return users.find((user) => user.userId === userId);
}

function getUserByUsername(username) {
  return users.find((user) => user.username === username);
}

function withoutPassword(user) {
  if (!user) {
    return null;
  }

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function updateUser(userId, updates) {
  const user = getUserById(userId);
  if (!user) {
    return null;
  }

  Object.assign(user, updates, { updatedAt: now() });
  return user;
}

function createUser(input) {
  const user = {
    userId: input.userId || createId('u'),
    username: input.username,
    passwordHash: input.passwordHash,
    status: input.status || 'active',
    roles: input.roles || [ROLES.CUSTOMER],
    lastLoginAt: null,
    tokenSubject: input.tokenSubject || `${input.username}-token`,
    firstName: input.firstName || '',
    lastName: input.lastName || '',
    dateOfBirth: input.dateOfBirth || '',
    email: input.email || '',
    phoneNumber: input.phoneNumber || '',
    addressLine1: input.addressLine1 || '',
    addressLine2: input.addressLine2 || '',
    city: input.city || '',
    provinceOrState: input.provinceOrState || '',
    postalCode: input.postalCode || '',
    country: input.country || '',
    customerNumber: input.customerNumber || '',
    employeeNumber: input.employeeNumber || '',
    userType: input.userType || 'customer',
    preferredContactMethod: input.preferredContactMethod || 'email',
    emergencyContactName: input.emergencyContactName || '',
    emergencyContactPhone: input.emergencyContactPhone || '',
    createdAt: now(),
    updatedAt: now(),
    clientCategory: input.clientCategory || '',
    linkedPolicies: input.linkedPolicies || [],
    beneficiaryPlaceholder: input.beneficiaryPlaceholder || '',
    department: input.department || '',
    jobTitle: input.jobTitle || '',
    supervisorName: input.supervisorName || '',
    internalAccessStatus: input.internalAccessStatus || '',
    assignedCustomerIds: input.assignedCustomerIds || []
  };

  users.push(user);
  return user;
}

function addRole(userId, role) {
  const user = getUserById(userId);
  if (!user) {
    return null;
  }

  if (!user.roles.includes(role)) {
    user.roles.push(role);
    user.updatedAt = now();
  }

  return user;
}

function removeRole(userId, role) {
  const user = getUserById(userId);
  if (!user) {
    return null;
  }

  user.roles = user.roles.filter((existingRole) => existingRole !== role);
  user.updatedAt = now();
  return user;
}

function setUserStatus(userId, status) {
  const user = getUserById(userId);
  if (!user) {
    return null;
  }

  user.status = status;
  user.updatedAt = now();
  return user;
}

function findPoliciesByCustomerId(customerId) {
  return policies.filter((policy) => policy.customerId === customerId);
}

function getPolicyById(policyId) {
  return policies.find((policy) => policy.policyId === policyId);
}

function createPolicy(input) {
  const policy = {
    policyId: input.policyId || createId('pol'),
    policyNumber: input.policyNumber,
    insuranceType: input.insuranceType,
    customerId: input.customerId,
    coverageAmount: Number(input.coverageAmount),
    premiumAmount: Number(input.premiumAmount),
    currency: input.currency || 'CAD',
    effectiveDate: input.effectiveDate,
    expiryDate: input.expiryDate,
    status: input.status || 'active',
    createdBy: input.createdBy,
    beneficiaryName: input.beneficiaryName || '',
    vehicleInfo: input.vehicleInfo || '',
    propertyAddress: input.propertyAddress || '',
    createdAt: now(),
    updatedAt: now()
  };

  policies.push(policy);
  return policy;
}

function getAmendmentById(amendmentId) {
  return amendments.find((item) => item.amendmentId === amendmentId);
}

function createAmendment(input) {
  const amendment = {
    amendmentId: createId('amd'),
    policyId: input.policyId,
    requestedBy: input.requestedBy,
    requestType: input.requestType,
    currentValue: input.currentValue,
    requestedValue: input.requestedValue,
    reason: input.reason,
    status: 'submitted',
    reviewedBy: '',
    reviewComment: '',
    createdAt: now(),
    updatedAt: now()
  };

  amendments.push(amendment);
  return amendment;
}

function reviewAmendment(amendmentId, updates) {
  const amendment = getAmendmentById(amendmentId);
  if (!amendment) {
    return null;
  }

  Object.assign(amendment, updates, { updatedAt: now() });
  return amendment;
}

function getReductionById(reductionId) {
  return reductions.find((item) => item.reductionId === reductionId);
}

function createReduction(input) {
  const reduction = {
    reductionId: createId('red'),
    policyId: input.policyId,
    requestedBy: input.requestedBy,
    currentCoverage: Number(input.currentCoverage),
    requestedCoverage: Number(input.requestedCoverage),
    reason: input.reason,
    status: 'submitted',
    reviewedBy: '',
    reviewComment: '',
    createdAt: now(),
    updatedAt: now()
  };

  reductions.push(reduction);
  return reduction;
}

function reviewReduction(reductionId, updates) {
  const reduction = getReductionById(reductionId);
  if (!reduction) {
    return null;
  }

  Object.assign(reduction, updates, { updatedAt: now() });
  return reduction;
}

function getClaimById(claimId) {
  return claims.find((item) => item.claimId === claimId);
}

function createClaim(input) {
  const claim = {
    claimId: createId('clm'),
    policyId: input.policyId,
    submittedBy: input.submittedBy,
    claimType: input.claimType,
    incidentDate: input.incidentDate,
    claimAmount: Number(input.claimAmount),
    description: input.description,
    status: 'submitted',
    assignedAdjuster: input.assignedAdjuster || '',
    decisionComment: '',
    createdAt: now(),
    updatedAt: now()
  };

  claims.push(claim);
  return claim;
}

function reviewClaim(claimId, updates) {
  const claim = getClaimById(claimId);
  if (!claim) {
    return null;
  }

  Object.assign(claim, updates, { updatedAt: now() });
  return claim;
}

module.exports = {
  users,
  policies,
  amendments,
  reductions,
  claims,
  getRoles,
  getUsers,
  getUserById,
  getUserByUsername,
  withoutPassword,
  updateUser,
  createUser,
  addRole,
  removeRole,
  setUserStatus,
  findPoliciesByCustomerId,
  getPolicyById,
  createPolicy,
  getAmendmentById,
  createAmendment,
  reviewAmendment,
  getReductionById,
  createReduction,
  reviewReduction,
  getClaimById,
  createClaim,
  reviewClaim
};
