const bcrypt = require('bcryptjs');
const store = require('../data/store');
const { signAccessToken } = require('../utils/token');

function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const user = store.getUserByUsername(username);
  if (!user || user.status !== 'active') {
    return res.status(401).json({ message: 'Invalid credentials or inactive account.' });
  }

  const passwordMatches = bcrypt.compareSync(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  user.lastLoginAt = new Date().toISOString();
  const token = signAccessToken(user);

  return res.json({
    token,
    user: store.withoutPassword(user)
  });
}

function me(req, res) {
  const user = store.getUserById(req.user.userId);
  return res.json({ user: store.withoutPassword(user) });
}

module.exports = { login, me };
