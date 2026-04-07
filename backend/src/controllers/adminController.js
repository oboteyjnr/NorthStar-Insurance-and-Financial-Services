const store = require('../data/store');
const bcrypt = require('bcryptjs');
const { ROLES, ACCOUNT_STATUSES } = require('../config/constants');

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

function getActiveAdminCount(excludingUserId) {
  return store.getUsers().filter((user) => {
    if (excludingUserId && user.userId === excludingUserId) {
      return false;
    }

    return user.status === 'active' && (user.roles || []).includes(ROLES.ADMIN);
  }).length;
}

function validateRoles(roles) {
  if (!Array.isArray(roles) || roles.length === 0) {
    return 'At least one role is required.';
  }

  const catalog = store.getRoles();
  const invalid = roles.filter((role) => !catalog.includes(role));
  if (invalid.length > 0) {
    return `Unknown roles: ${invalid.join(', ')}`;
  }

  return null;
}

function safeUser(user) {
  return store.withoutPassword(user);
}

function listRoles(req, res) {
  return res.json({ roles: store.getRoles() });
}

function listUsersWithRoles(req, res) {
  const users = store.getUsers().map((user) => ({
    ...safeUser(user),
    roles: user.roles
  }));

  return res.json({ users });
}

function getUserById(req, res) {
  const user = store.getUserById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.json({ profile: safeUser(user) });
}

function createUser(req, res) {
  const required = ['username', 'password', 'firstName', 'lastName', 'email', 'userType'];
  const missing = required.filter((field) => !req.body[field]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
  }

  if (store.getUserByUsername(req.body.username)) {
    return res.status(409).json({ message: 'Username already exists.' });
  }

  if (!isValidEmail(req.body.email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (!isValidPhone(req.body.phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format.' });
  }

  const status = String(req.body.status || 'active').toLowerCase();
  if (!ACCOUNT_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${ACCOUNT_STATUSES.join(', ')}` });
  }

  const roles = req.body.roles || [ROLES.CUSTOMER];
  const roleError = validateRoles(roles);
  if (roleError) {
    return res.status(400).json({ message: roleError });
  }

  const user = store.createUser({
    ...req.body,
    status,
    roles,
    passwordHash: bcrypt.hashSync(req.body.password, 10)
  });

  return res.status(201).json({ profile: safeUser(user) });
}

function updateUser(req, res) {
  const user = store.getUserById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (req.body.email !== undefined && !isValidEmail(req.body.email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (req.body.phoneNumber !== undefined && !isValidPhone(req.body.phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format.' });
  }

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
    'userType'
  ];

  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updated = store.updateUser(req.params.userId, updates);
  return res.json({ profile: safeUser(updated) });
}

function updateUserStatus(req, res) {
  const user = store.getUserById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const status = String(req.body.status || '').toLowerCase();
  if (!ACCOUNT_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${ACCOUNT_STATUSES.join(', ')}` });
  }

  const isAdminTarget = (user.roles || []).includes(ROLES.ADMIN);
  const isSelf = req.user.userId === user.userId;
  const isDeactivating = status !== 'active';

  if (isSelf && isAdminTarget && isDeactivating) {
    return res.status(400).json({ message: 'Admin cannot suspend or deactivate their own account.' });
  }

  if (isAdminTarget && user.status === 'active' && isDeactivating && getActiveAdminCount(user.userId) === 0) {
    return res.status(400).json({ message: 'Cannot suspend the last active admin account.' });
  }

  const updated = store.setUserStatus(req.params.userId, status);
  return res.json({ profile: safeUser(updated) });
}

function replaceUserRoles(req, res) {
  const user = store.getUserById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const roles = req.body.roles;
  const roleError = validateRoles(roles);
  if (roleError) {
    return res.status(400).json({ message: roleError });
  }

  const currentHasAdmin = (user.roles || []).includes(ROLES.ADMIN);
  const nextHasAdmin = roles.includes(ROLES.ADMIN);

  if (currentHasAdmin && !nextHasAdmin && user.status === 'active' && getActiveAdminCount(user.userId) === 0) {
    return res.status(400).json({ message: 'Cannot revoke admin from the last active admin account.' });
  }

  const updated = store.updateUser(user.userId, { roles: [...new Set(roles)] });
  return res.json({ profile: safeUser(updated) });
}

function assignRole(req, res) {
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ message: 'Role is required.' });
  }

  if (!store.getRoles().includes(role)) {
    return res.status(400).json({ message: 'Unknown role.' });
  }

  const user = store.getUserById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const updated = store.addRole(req.params.userId, role);
  return res.json({ profile: safeUser(updated) });
}

function removeRole(req, res) {
  const { role } = req.params;

  const user = store.getUserById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (!store.getRoles().includes(role)) {
    return res.status(400).json({ message: 'Unknown role.' });
  }

  const isRemovingAdmin = role === ROLES.ADMIN && (user.roles || []).includes(ROLES.ADMIN);
  if (isRemovingAdmin && user.status === 'active' && getActiveAdminCount(user.userId) === 0) {
    return res.status(400).json({ message: 'Cannot revoke admin from the last active admin account.' });
  }

  if ((user.roles || []).length === 1 && (user.roles || []).includes(role)) {
    return res.status(400).json({ message: 'A user must retain at least one role.' });
  }

  const updated = store.removeRole(req.params.userId, role);
  return res.json({ profile: safeUser(updated) });
}

module.exports = {
  listRoles,
  listUsersWithRoles,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
  replaceUserRoles,
  assignRole,
  removeRole
};
