// strapi/config/plugins.js
module.exports = ({ env }) => ({
  // Upload plugin configuration
  upload: {
    config: {
      sizeLimit: 250 * 1024 * 1024, // 250MB
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
    },
  },
  
  // i18n plugin configuration
  i18n: {
    enabled: true,
    config: {
      locales: ['en', 'ru', 'kz'],
      defaultLocale: 'ru',
    },
  },
});
