const store = require('../data/store');
const { ROLES } = require('../config/constants');

const editableFields = [
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
  'addressLine1',
  'addressLine2',
  'city',
  'provinceOrState',
  'postalCode',
  'country',
  'preferredContactMethod',
  'emergencyContactName',
  'emergencyContactPhone'
];

function getOwnProfile(req, res) {
  const user = store.getUserById(req.user.userId);
  return res.json({ profile: store.withoutPassword(user) });
}

function isValidEmail(value) {
  if (!value) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
}

function isValidPhone(value) {
  if (!value) {
    return true;
  }

  return /^[+()\-\s0-9]{7,20}$/.test(String(value));
}

function updateOwnProfile(req, res) {
  const currentUser = store.getUserById(req.user.userId);

  if (!currentUser) {
    return res.status(404).json({ message: 'Profile not found.' });
  }

  if (req.body.email !== undefined && !isValidEmail(req.body.email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (req.body.phoneNumber !== undefined && !isValidPhone(req.body.phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format.' });
  }

  const updates = {};

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  store.updateUser(currentUser.userId, updates);
  return res.json({ profile: store.withoutPassword(store.getUserById(currentUser.userId)) });
}

function suspendOwnProfile(req, res) {
  const currentUser = store.getUserById(req.user.userId);

  if (!currentUser) {
    return res.status(404).json({ message: 'Profile not found.' });
  }

  if ((currentUser.roles || []).includes(ROLES.ADMIN)) {
    return res.status(403).json({ message: 'Admin accounts cannot self-suspend.' });
  }

  const updated = store.setUserStatus(currentUser.userId, 'suspended');
  return res.json({
    message: 'Account suspended. Please sign in through an administrator to reactivate.',
    profile: store.withoutPassword(updated)
  });
}

function listUsers(req, res) {
  const profiles = store.getUsers().map((user) => store.withoutPassword(user));
  return res.json({ users: profiles });
}

function getUserById(req, res) {
  return res.json({ profile: store.withoutPassword(req.record) });
}

function updateUserById(req, res) {
  const allowed = [
    'firstName',
    'lastName',
    'dateOfBirth',
    'email',
    'phoneNumber',
    'addressLine1',
    'addressLine2',
    'city',
    'provinceOrState',
    'postalCode',
    'country',
    'customerNumber',
    'employeeNumber',
    'preferredContactMethod',
    'emergencyContactName',
    'emergencyContactPhone',
    'department',
    'jobTitle',
    'supervisorName',
    'internalAccessStatus',
    'clientCategory',
    'linkedPolicies',
    'beneficiaryPlaceholder',
    'status'
  ];

  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updated = store.updateUser(req.params.userId, updates);
  return res.json({ profile: store.withoutPassword(updated) });
}

function activateUser(req, res) {
  const updated = store.setUserStatus(req.params.userId, 'active');
  return res.json({ profile: store.withoutPassword(updated) });
}

function deactivateUser(req, res) {
  const updated = store.setUserStatus(req.params.userId, 'inactive');
  return res.json({ profile: store.withoutPassword(updated) });
}

function createUser(req, res) {
  const required = ['username', 'password', 'firstName', 'lastName', 'email', 'userType'];
  const missing = required.filter((field) => !req.body[field]);

  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
  }

  const bcrypt = require('bcryptjs');
  const user = store.createUser({
    ...req.body,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    roles: req.body.roles || [ROLES.CUSTOMER]
  });

  return res.status(201).json({ profile: store.withoutPassword(user) });
}

module.exports = {
  getOwnProfile,
  updateOwnProfile,
  suspendOwnProfile,
  listUsers,
  getUserById,
  updateUserById,
  activateUser,
  deactivateUser,
  createUser
};
