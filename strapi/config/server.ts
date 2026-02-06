export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // Remove url to prevent redirects - Caddy handles the domain
  // url: env('PUBLIC_URL', 'https://cms.praktikoffice.kz'),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
