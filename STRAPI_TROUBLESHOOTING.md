# Strapi Troubleshooting Guide

## Error: "Cannot read properties of null (reading 'useContext')"

This error typically occurs during Strapi admin panel registration/login. Here are the solutions:

### Solution 1: Clean Build (Most Common Fix)

```bash
cd strapi

# Stop Strapi if running
pm2 stop strapi
# or Ctrl+C if running in terminal

# Remove cache and build directories
rm -rf .cache
rm -rf build
rm -rf node_modules/.cache

# Rebuild
npm run build

# Start in development mode
npm run develop
```

### Solution 2: Check Node Version

Strapi requires Node.js 18.x or 20.x (LTS versions)

```bash
# Check your Node version
node -v

# If not 18.x or 20.x, install correct version
# Using nvm (recommended):
nvm install 20
nvm use 20

# Or using n:
npm install -g n
n lts
```

### Solution 3: Fresh Install

If the above doesn't work, do a fresh install:

```bash
# Backup your .env file
cp strapi/.env strapi/.env.backup

# Remove strapi directory
rm -rf strapi

# Reinstall
npx create-strapi-app@latest strapi \
  --dbclient=postgres \
  --dbhost=localhost \
  --dbport=5432 \
  --dbname=praktikoffice_strapi \
  --dbusername=strapi_user \
  --dbpassword=your_password \
  --no-run

# Restore .env
cp strapi/.env.backup strapi/.env

# Copy config files
cp strapi-config/database.js strapi/config/
cp strapi-config/server.js strapi/config/
cp strapi-config/middlewares.js strapi/config/
cp strapi-config/plugins.js strapi/config/

# Install and build
cd strapi
npm install
npm run build
npm run develop
```

### Solution 4: Use Production Mode

Sometimes development mode has issues. Try production mode:

```bash
cd strapi

# Build for production
NODE_ENV=production npm run build

# Start in production mode
NODE_ENV=production npm start
```

Then access: http://localhost:1337/admin

### Solution 5: Check Environment Variables

Make sure your `strapi/.env` file has all required variables:

```bash
# Check if .env exists
cat strapi/.env

# Should have these variables:
# HOST=0.0.0.0
# PORT=1337
# APP_KEYS=...
# API_TOKEN_SALT=...
# ADMIN_JWT_SECRET=...
# TRANSFER_TOKEN_SALT=...
# JWT_SECRET=...
# DATABASE_CLIENT=postgres
# DATABASE_HOST=127.0.0.1
# DATABASE_PORT=5432
# DATABASE_NAME=praktikoffice_strapi
# DATABASE_USERNAME=strapi_user
# DATABASE_PASSWORD=your_password
```

If any are missing, regenerate:

```bash
# Generate new keys
openssl rand -base64 32
```

### Solution 6: Check Database Connection

```bash
# Test PostgreSQL connection
psql -U strapi_user -d praktikoffice_strapi -c "SELECT version();"

# If connection fails, check PostgreSQL is running
# macOS:
brew services list
brew services start postgresql@15

# Linux:
sudo systemctl status postgresql
sudo systemctl start postgresql
```

### Solution 7: Port Conflict

Check if port 1337 is already in use:

```bash
# Check what's using port 1337
lsof -i :1337

# If something is using it, kill it
kill -9 <PID>

# Or change Strapi port in .env
# PORT=1338
```

## Recommended Approach

**For initial setup, use development mode:**

```bash
cd strapi

# Clean everything
rm -rf .cache build node_modules/.cache

# Rebuild
npm run build

# Start in development mode (better for first-time setup)
npm run develop
```

**After creating admin user and content types, switch to production:**

```bash
cd strapi

# Build for production
NODE_ENV=production npm run build

# Start with PM2
cd ..
pm2 start ecosystem.config.js
```

## Step-by-Step: Fresh Start

If nothing works, here's a complete fresh start:

```bash
# 1. Stop everything
pm2 stop all
pm2 delete all

# 2. Backup database (optional)
pg_dump -U strapi_user praktikoffice_strapi > backup.sql

# 3. Drop and recreate database
sudo -u postgres psql << EOF
DROP DATABASE IF EXISTS praktikoffice_strapi;
CREATE DATABASE praktikoffice_strapi;
GRANT ALL PRIVILEGES ON DATABASE praktikoffice_strapi TO strapi_user;
\q
EOF

# 4. Remove Strapi
rm -rf strapi

# 5. Create fresh Strapi
npx create-strapi-app@latest strapi --quickstart --no-run

# 6. Configure database
cat > strapi/config/database.js << 'EOF'
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'praktikoffice_strapi'),
      user: env('DATABASE_USERNAME', 'strapi_user'),
      password: env('DATABASE_PASSWORD', 'strapi'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
EOF

# 7. Install PostgreSQL client
cd strapi
npm install pg

# 8. Create .env file
cat > .env << 'EOF'
HOST=0.0.0.0
PORT=1337
APP_KEYS=GENERATE_KEY_1,GENERATE_KEY_2,GENERATE_KEY_3,GENERATE_KEY_4
API_TOKEN_SALT=GENERATE_SALT
ADMIN_JWT_SECRET=GENERATE_SECRET
TRANSFER_TOKEN_SALT=GENERATE_SALT
JWT_SECRET=GENERATE_SECRET
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=praktikoffice_strapi
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_password
NODE_ENV=development
EOF

# 9. Generate and replace keys
# Run this for each GENERATE_* placeholder:
openssl rand -base64 32

# 10. Build and start
npm run build
npm run develop
```

## Common Issues

### Issue: "Database connection error"
**Solution:** Check PostgreSQL is running and credentials are correct

### Issue: "Port 1337 already in use"
**Solution:** Kill the process or change port in .env

### Issue: "Module not found"
**Solution:** Delete node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Admin panel won't load"
**Solution:** Clear browser cache and cookies for localhost:1337

### Issue: "Cannot create admin user"
**Solution:** Check database permissions
```bash
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE praktikoffice_strapi TO strapi_user;
GRANT ALL ON SCHEMA public TO strapi_user;
```

## Verification Steps

After fixing, verify everything works:

```bash
# 1. Check Strapi is running
curl http://localhost:1337/_health

# 2. Access admin panel
open http://localhost:1337/admin

# 3. Create admin user

# 4. Check API works
curl http://localhost:1337/api/users-permissions/roles

# 5. If all good, proceed with content type creation
```

## Need More Help?

1. Check Strapi logs:
```bash
# If using PM2
pm2 logs strapi

# If running directly
# Logs are in terminal
```

2. Check database logs:
```bash
# macOS
tail -f /usr/local/var/log/postgresql@15.log

# Linux
sudo tail -f /var/log/postgresql/postgresql-*.log
```

3. Enable debug mode:
```bash
# In strapi/.env
NODE_ENV=development
DEBUG=strapi:*
```

## Quick Fix Script

Save this as `fix-strapi.sh`:

```bash
#!/bin/bash
cd strapi
echo "Cleaning Strapi..."
rm -rf .cache build node_modules/.cache
echo "Rebuilding..."
npm run build
echo "Starting in development mode..."
npm run develop
```

Run with:
```bash
chmod +x fix-strapi.sh
./fix-strapi.sh
```
