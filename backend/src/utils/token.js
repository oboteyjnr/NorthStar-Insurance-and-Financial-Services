const jwt = require('jsonwebtoken');

function signAccessToken(user) {
  return jwt.sign(
    {
      userId: user.userId,
      username: user.username,
      roles: user.roles
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
      issuer: 'northstar-insurance'
    }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, { issuer: 'northstar-insurance' });
}

module.exports = {
  signAccessToken,
  verifyAccessToken
};
