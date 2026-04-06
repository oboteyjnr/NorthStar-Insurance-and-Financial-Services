require('dotenv').config();
const https = require('https');
const http = require('http');
const app = require('./app');
const { ensureHttpsCredentials } = require('./config/cert');

const port = Number(process.env.PORT || 3443);
const useHttps = process.env.USE_HTTPS !== 'false';

if (useHttps) {
  const { key, cert } = ensureHttpsCredentials();
  https.createServer({ key, cert }, app).listen(port, () => {
    console.log(`NorthStar HTTPS API running at https://localhost:${port}`);
  });
} else {
  http.createServer(app).listen(port, () => {
    console.log(`NorthStar HTTP API running at http://localhost:${port}`);
  });
}
