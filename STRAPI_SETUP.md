# Strapi Setup Guide with PostgreSQL, PM2, and Caddy

## Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running
- PM2 installed globally: `npm install -g pm2`
- Caddy installed

## Step 1: Install PostgreSQL (if not already installed)

### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### On macOS:
```bash
brew install postgresql@15
brew services start postgresql@15
```

## Step 2: Create PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE praktikoffice_strapi;
CREATE USER strapi_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE praktikoffice_strapi TO strapi_user;
\q
```

## Step 3: Create Strapi Project

```bash
# Create strapi directory in your project root
npx create-strapi-app@latest strapi --quickstart --no-run

# Or if you want to specify database during creation:
npx create-strapi-app@latest strapi \
  --dbclient=postgres \
  --dbhost=localhost \
  --dbport=5432 \
  --dbname=praktikoffice_strapi \
  --dbusername=strapi_user \
  --dbpassword=your_secure_password \
  --no-run
```

## Step 4: Configure Strapi Database Connection

The database configuration will be created in the next steps.

## Step 5: Install Required Strapi Plugins

```bash
cd strapi
npm install @strapi/plugin-i18n
npm install @strapi/plugin-upload
npm install pg
```

## Step 6: Configure Environment Variables

Create `.env` file in strapi directory (see .env.example)

## Step 7: Create Content Types

Copy the schema files from `strapi-schemas/` to `strapi/src/api/` and create the content types in Strapi admin panel, or use the schemas as reference.

## Step 8: Configure PM2

Use the `ecosystem.config.js` file in the root directory to manage both Next.js and Strapi with PM2.

## Step 9: Configure Caddy

Use the `Caddyfile` in the root directory to set up reverse proxy for both applications.

## Step 10: Start Services

```bash
# Start PostgreSQL (if not running)
sudo systemctl start postgresql

# Start applications with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

## Step 11: Access Strapi Admin

1. Open browser: `http://localhost:1337/admin`
2. Create your first admin user
3. Configure i18n plugin with locales: en, ru, kz

## Step 12: Create Content

1. Add Office entries with images and prices
2. Add Meeting Room entries with images and prices
3. Add Coworking Tariff entries
4. Publish all entries

## Step 13: Configure API Permissions

In Strapi Admin:
1. Go to Settings → Users & Permissions → Roles → Public
2. Enable find and findOne for:
   - Office
   - Meeting-room
   - Coworking-tariff
   - Gallery-category
   - Amenity

## Useful PM2 Commands

```bash
# View logs
pm2 logs

# View specific app logs
pm2 logs strapi
pm2 logs nextjs

# Restart apps
pm2 restart all
pm2 restart strapi
pm2 restart nextjs

# Stop apps
pm2 stop all

# Delete apps from PM2
pm2 delete all

# Monitor apps
pm2 monit
```

## Caddy Commands

```bash
# Start Caddy
sudo caddy start --config Caddyfile

# Reload Caddy configuration
sudo caddy reload --config Caddyfile

# Stop Caddy
sudo caddy stop
```

## Troubleshooting

### PostgreSQL Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Strapi Issues
```bash
# Clear Strapi cache
cd strapi
npm run strapi build --clean

# Check Strapi logs
pm2 logs strapi
```

### Port Already in Use
```bash
# Find process using port 1337
lsof -i :1337
# Kill the process
kill -9 <PID>
```
