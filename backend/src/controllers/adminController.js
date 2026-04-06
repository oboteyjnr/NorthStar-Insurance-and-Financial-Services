const store = require('../data/store');

function listRoles(req, res) {
  return res.json({ roles: store.getRoles() });
}

function listUsersWithRoles(req, res) {
  const users = store.getUsers().map((user) => ({
    ...store.withoutPassword(user),
    roles: user.roles
  }));

  return res.json({ users });
}

function assignRole(req, res) {
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ message: 'Role is required.' });
  }

  if (!store.getRoles().includes(role)) {
    return res.status(400).json({ message: 'Unknown role.' });
  }

  const updated = store.addRole(req.params.userId, role);
  return res.json({ profile: store.withoutPassword(updated) });
}

function removeRole(req, res) {
  const { role } = req.params;
  const updated = store.removeRole(req.params.userId, role);
  return res.json({ profile: store.withoutPassword(updated) });
}

module.exports = {
  listRoles,
  listUsersWithRoles,
  assignRole,
  removeRole
};
