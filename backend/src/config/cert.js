const fs = require('fs');
const path = require('path');
const selfsigned = require('selfsigned');

function ensureHttpsCredentials() {
  const keyPath = path.resolve(process.cwd(), process.env.HTTPS_KEY_PATH || 'certs/dev-key.pem');
  const certPath = path.resolve(process.cwd(), process.env.HTTPS_CERT_PATH || 'certs/dev-cert.pem');

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
  }

  const attrs = [{ name: 'commonName', value: 'localhost' }];
  const pems = selfsigned.generate(attrs, {
    algorithm: 'sha256',
    days: 365,
    keySize: 2048,
    extensions: [
      {
        name: 'subjectAltName',
        altNames: [
          { type: 2, value: 'localhost' },
          { type: 2, value: '127.0.0.1' }
        ]
      }
    ]
  });

  fs.mkdirSync(path.dirname(keyPath), { recursive: true });
  fs.writeFileSync(keyPath, pems.private, 'utf8');
  fs.writeFileSync(certPath, pems.cert, 'utf8');

  return {
    key: Buffer.from(pems.private),
    cert: Buffer.from(pems.cert)
  };
}

module.exports = { ensureHttpsCredentials };
