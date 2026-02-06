# Strapi Setup Checklist

Use this checklist to track your setup progress.

## ✅ Prerequisites

- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed
- [ ] PM2 installed globally (`npm install -g pm2`)
- [ ] Caddy installed (optional, for production)

## ✅ Database Setup

- [ ] PostgreSQL service running
- [ ] Database `praktikoffice_strapi` created
- [ ] User `strapi_user` created with password
- [ ] Permissions granted to user
- [ ] Test connection: `psql -U strapi_user -d praktikoffice_strapi`

## ✅ Strapi Installation

- [ ] Run setup script: `./scripts/setup-strapi.sh` OR
- [ ] Manual: Create Strapi project with `npx create-strapi-app`
- [ ] Configuration files copied to `strapi/config/`
- [ ] Environment variables configured in `strapi/.env`
- [ ] App keys generated (use `openssl rand -base64 32`)
- [ ] Dependencies installed: `cd strapi && npm install`
- [ ] Strapi built: `npm run build`

## ✅ Strapi Configuration

- [ ] Start Strapi: `npm run develop`
- [ ] Access admin: http://localhost:1337/admin
- [ ] Create first admin user
- [ ] Configure i18n plugin:
  - [ ] Add English (en)
  - [ ] Add Russian (ru) - set as default
  - [ ] Add Kazakh (kz)

## ✅ Content Types Creation

### Office Content Type
- [ ] Create collection type: `office`
- [ ] Add field: `name` (Text, required, localized)
- [ ] Add field: `slug` (UID, target: name)
- [ ] Add field: `size` (Text, required, localized)
- [ ] Add field: `capacity` (Text, required, localized)
- [ ] Add field: `price` (Text, required, localized)
- [ ] Add field: `description` (Rich Text, localized)
- [ ] Add field: `features` (JSON, localized)
- [ ] Add field: `isAvailable` (Boolean, default: true)
- [ ] Add field: `images` (Media, multiple, images only)
- [ ] Save content type

### Meeting Room Content Type
- [ ] Create collection type: `meeting-room`
- [ ] Add field: `name` (Text, required, localized)
- [ ] Add field: `slug` (UID, target: name)
- [ ] Add field: `size` (Text, required, localized)
- [ ] Add field: `capacity` (Text, required, localized)
- [ ] Add field: `price` (Text, required, localized)
- [ ] Add field: `description` (Rich Text, localized)
- [ ] Add field: `workingHours` (Text, localized)
- [ ] Add field: `specialFeature` (Text, localized)
- [ ] Add field: `features` (JSON, localized)
- [ ] Add field: `isAvailable` (Boolean, default: true)
- [ ] Add field: `images` (Media, multiple, images only)
- [ ] Save content type

### Coworking Tariff Content Type
- [ ] Create collection type: `coworking-tariff`
- [ ] Add field: `name` (Text, required, localized)
- [ ] Add field: `slug` (UID, target: name)
- [ ] Add field: `schedule` (Text, required, localized)
- [ ] Add field: `price` (Text, required, localized)
- [ ] Add field: `description` (Rich Text, localized)
- [ ] Add field: `features` (JSON, localized)
- [ ] Add field: `isActive` (Boolean, default: true)
- [ ] Save content type

## ✅ API Permissions

- [ ] Go to Settings → Users & Permissions → Roles → Public
- [ ] Enable `find` for Office
- [ ] Enable `findOne` for Office
- [ ] Enable `find` for Meeting-room
- [ ] Enable `findOne` for Meeting-room
- [ ] Enable `find` for Coworking-tariff
- [ ] Enable `findOne` for Coworking-tariff
- [ ] Save permissions

## ✅ Content Creation - Offices

Create entries for all offices in all 3 languages (ru, en, kz):

- [ ] Office K10 (Офис К10)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Images uploaded (3-6 images)
  - [ ] Published

- [ ] Office K11 (Офис К11)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Images uploaded
  - [ ] Published

- [ ] Office K14 (Офис К14)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Images uploaded
  - [ ] Published

- [ ] Office K17 (Офис К17)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Images uploaded
  - [ ] Published

- [ ] Office K18 (Офис К18)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Images uploaded
  - [ ] Published

- [ ] Office K19 (Офис К19)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Images uploaded
  - [ ] Published

- [ ] Office K31 (Офис К31)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Images uploaded
  - [ ] Published

- [ ] Office K38 (Офис К38)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Images uploaded
  - [ ] Published

- [ ] Office K41 (Офис К41)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Images uploaded
  - [ ] Published

## ✅ Content Creation - Meeting Rooms

Create entries for all meeting rooms in all 3 languages:

- [ ] Meeting Room P6 (П6)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Images uploaded
  - [ ] Published

- [ ] Meeting Room P8 (П8)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Images uploaded
  - [ ] Published

- [ ] Meeting Room P10 (П10)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Images uploaded
  - [ ] Published

- [ ] Meeting Room P12 (П12)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Images uploaded
  - [ ] Published

- [ ] Meeting Room P16 (П16)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Images uploaded
  - [ ] Published

## ✅ Content Creation - Coworking

- [ ] Nomad Tariff (Тариф Номад)
  - [ ] Russian content
  - [ ] English content
  - [ ] Kazakh content
  - [ ] Published

## ✅ Next.js Configuration

- [ ] Update `.env.local` with Strapi URL
- [ ] Add `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`
- [ ] Test API connection
- [ ] Build Next.js: `npm run build`

## ✅ Testing

- [ ] Test Strapi API: `curl http://localhost:1337/api/offices?populate=*`
- [ ] Test with locale: `curl http://localhost:1337/api/offices?populate=*&locale=ru`
- [ ] Test Next.js pages:
  - [ ] http://localhost:3000/ru/offices
  - [ ] http://localhost:3000/ru/meeting-room
  - [ ] http://localhost:3000/ru/open-space
  - [ ] http://localhost:3000/en/offices
  - [ ] http://localhost:3000/kz/offices
- [ ] Verify images load correctly
- [ ] Verify prices display correctly
- [ ] Test language switching

## ✅ PM2 Setup

- [ ] Create logs directory: `mkdir -p logs`
- [ ] Test PM2 config: `pm2 start ecosystem.config.js`
- [ ] Check status: `pm2 list`
- [ ] Check logs: `pm2 logs`
- [ ] Save PM2 config: `pm2 save`
- [ ] Setup startup: `pm2 startup` (follow instructions)
- [ ] Reboot and verify services start automatically

## ✅ Caddy Setup (Production Only)

- [ ] Update `Caddyfile` with your domain
- [ ] Configure DNS records:
  - [ ] praktikoffice.kz → your server IP
  - [ ] cms.praktikoffice.kz → your server IP
  - [ ] api.praktikoffice.kz → your server IP (optional)
- [ ] Test Caddy config: `caddy validate --config Caddyfile`
- [ ] Start Caddy: `sudo caddy start --config Caddyfile`
- [ ] Verify HTTPS certificates
- [ ] Test website: https://praktikoffice.kz
- [ ] Test Strapi admin: https://cms.praktikoffice.kz/admin

## ✅ Production Environment

- [ ] Update `strapi/.env` with production values:
  - [ ] NODE_ENV=production
  - [ ] PUBLIC_URL=https://cms.praktikoffice.kz
  - [ ] Strong passwords
  - [ ] Secure app keys
- [ ] Update `.env.local` with production Strapi URL
- [ ] Build both applications:
  - [ ] `cd strapi && npm run build`
  - [ ] `npm run build`
- [ ] Start with PM2: `pm2 restart all`

## ✅ Security

- [ ] Strong PostgreSQL password
- [ ] Strong Strapi admin password
- [ ] Firewall configured (allow only 80, 443, 22)
- [ ] PostgreSQL only accepts local connections
- [ ] Strapi API token generated (if needed)
- [ ] CORS configured correctly
- [ ] Security headers enabled in Caddy
- [ ] Regular backups configured

## ✅ Monitoring & Maintenance

- [ ] Setup database backups (cron job)
- [ ] Setup log rotation
- [ ] Monitor disk space
- [ ] Monitor PM2 processes: `pm2 monit`
- [ ] Setup alerts (optional)
- [ ] Document admin credentials securely

## ✅ Documentation

- [ ] Team trained on Strapi admin
- [ ] Content update procedures documented
- [ ] Backup/restore procedures documented
- [ ] Emergency contacts listed

## 🎉 Launch

- [ ] Final testing on production
- [ ] Verify all pages load
- [ ] Verify all images load
- [ ] Verify all languages work
- [ ] Monitor logs for errors
- [ ] Announce launch!

---

## Quick Commands Reference

```bash
# Start services
pm2 start ecosystem.config.js

# View logs
pm2 logs

# Restart services
pm2 restart all

# Stop services
pm2 stop all

# Database backup
pg_dump -U strapi_user praktikoffice_strapi > backup_$(date +%Y%m%d).sql

# Caddy
sudo caddy start --config Caddyfile
sudo caddy reload --config Caddyfile
```
