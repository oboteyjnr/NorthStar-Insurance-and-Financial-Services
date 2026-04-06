const { ensureHttpsCredentials } = require('../src/config/cert');

ensureHttpsCredentials();
console.log('Development HTTPS certificates are ready.');
