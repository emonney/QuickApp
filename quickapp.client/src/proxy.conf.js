// ---------------------------------------
// Email: quickapp@ebenmonney.com
// Templates: www.ebenmonney.com/templates
// (c) 2024 www.ebenmonney.com/mit-license
// ---------------------------------------

const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7085';

const PROXY_CONFIG = [
  {
    context: [
      "/api",
      "/swagger",
      "/connect",
      "/oauth",
      "/.well-known"
    ],
    target,
    secure: false
  }
]

module.exports = PROXY_CONFIG;
