# Deployment Guide - Caddy + PM2

This guide explains how to deploy the praktikoffice Next.js application using PM2 and Caddy.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **pnpm** (or npm/yarn)
3. **PM2** - Process manager for Node.js
4. **Caddy** - Web server with automatic HTTPS

## Installation

### Install PM2

```bash
npm install -g pm2
```

### Install Caddy

**macOS:**

```bash
brew install caddy
```

**Linux (Debian/Ubuntu):**

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

## Setup Steps

### 1. Build the Application

```bash
# Install dependencies
pnpm install

# Build for production
pnpm build
```

### 2. Start with PM2

```bash
# Start the application
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs praktikoffice

# Monitor
pm2 monit
```

### 3. Configure PM2 to Start on Boot

```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save
```

### 4. Configure Caddy

**For Production (with domain):**

1. Edit `Caddyfile` and replace `your-domain.com` with your actual domain
2. Start Caddy:

```bash
# Test configuration
caddy validate --config Caddyfile

# Run Caddy (foreground)
caddy run --config Caddyfile

# Or run as service (background)
sudo caddy start --config Caddyfile
```

**For Local Testing:**

```bash
# Use the local configuration
caddy run --config Caddyfile.local
```

### 5. Setup Caddy as System Service (Linux)

```bash
# Copy Caddyfile to system location
sudo cp Caddyfile /etc/caddy/Caddyfile

# Enable and start Caddy service
sudo systemctl enable caddy
sudo systemctl start caddy

# Check status
sudo systemctl status caddy
```

## PM2 Commands

```bash
# Start application
pm2 start ecosystem.config.js

# Stop application
pm2 stop praktikoffice

# Restart application
pm2 restart praktikoffice

# Delete from PM2
pm2 delete praktikoffice

# View logs
pm2 logs praktikoffice

# Clear logs
pm2 flush

# Monitor resources
pm2 monit

# List all processes
pm2 list
```

## Caddy Commands

```bash
# Start Caddy
caddy start --config Caddyfile

# Stop Caddy
caddy stop

# Reload configuration (zero downtime)
caddy reload --config Caddyfile

# Validate configuration
caddy validate --config Caddyfile

# View logs (if using systemd)
sudo journalctl -u caddy -f
```

## Environment Variables

You can customize the application by setting environment variables in `ecosystem.config.js`:

```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3000,
  // Add more variables as needed
}
```

## Troubleshooting

### PM2 Issues

**Application won't start:**

```bash
# Check logs
pm2 logs praktikoffice --lines 100

# Check if port 3000 is available
lsof -i :3000
```

**High memory usage:**

- Adjust `max_memory_restart` in `ecosystem.config.js`

### Caddy Issues

**Port 80/443 already in use:**

```bash
# Check what's using the ports
sudo lsof -i :80
sudo lsof -i :443
```

**SSL certificate issues:**

- Ensure your domain DNS is pointing to your server
- Check Caddy logs: `sudo journalctl -u caddy -f`

**Permission denied:**

```bash
# Caddy needs permission to bind to ports 80/443
sudo setcap cap_net_bind_service=+ep $(which caddy)
```

## Updating the Application

```bash
# Pull latest changes
git pull

# Install dependencies
pnpm install

# Build
pnpm build

# Restart PM2
pm2 restart praktikoffice

# Reload Caddy (if config changed)
caddy reload --config Caddyfile
```

## Monitoring

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Web-based monitoring (optional)
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
```

### Logs Location

- PM2 logs: `./logs/`
- Caddy logs: `/var/log/caddy/` (or check systemd journal)

## Security Checklist

- [ ] Update domain in Caddyfile
- [ ] Enable firewall (allow ports 80, 443)
- [ ] Set up log rotation
- [ ] Configure PM2 to restart on system reboot
- [ ] Review security headers in Caddyfile
- [ ] Set up monitoring/alerts
- [ ] Regular backups

## Quick Start Commands

```bash
# Complete deployment
pnpm install
pnpm build
pm2 start ecosystem.config.js
pm2 save
caddy start --config Caddyfile

# Check everything is running
pm2 status
curl http://localhost:3000
```
