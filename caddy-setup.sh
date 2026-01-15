#!/bin/bash

echo "🧹 Fresh Caddy Setup for praktikoffice"
echo "========================================"
echo ""

# Stop any running Caddy instances
echo "1. Stopping existing Caddy..."
caddy stop 2>/dev/null || true
pkill caddy 2>/dev/null || true
sleep 2

# Clean up old Caddy data
echo "2. Cleaning up old Caddy data..."
rm -rf ~/.local/share/caddy
rm -rf ~/.config/caddy
rm -rf /var/lib/caddy 2>/dev/null || true

# Create log directory
echo "3. Creating log directory..."
sudo mkdir -p /var/log/caddy
sudo chown -R $USER:$USER /var/log/caddy 2>/dev/null || true

# Check DNS
echo ""
echo "4. Checking DNS..."
CURRENT_IP=$(dig +short praktikoffice.kz | tail -n1)
SERVER_IP=$(curl -s ifconfig.me)

echo "   Domain resolves to: $CURRENT_IP"
echo "   Server IP is: $SERVER_IP"

if [ "$CURRENT_IP" != "$SERVER_IP" ]; then
    echo ""
    echo "⚠️  WARNING: DNS mismatch!"
    echo "   Update your DNS A record to point to: $SERVER_IP"
    echo ""
    echo "   Using HTTP-only mode until DNS is fixed..."
    CONFIG="Caddyfile.local"
else
    echo "   ✓ DNS is correct!"
    CONFIG="Caddyfile"
fi

# Validate Caddyfile
echo ""
echo "5. Validating Caddyfile..."
if caddy validate --config $CONFIG; then
    echo "   ✓ Configuration is valid"
else
    echo "   ✗ Configuration has errors"
    exit 1
fi

# Check if PM2 app is running
echo ""
echo "6. Checking PM2 status..."
if pm2 list | grep -q "praktikoffice.*online"; then
    echo "   ✓ PM2 app is running"
else
    echo "   ⚠️  PM2 app is not running"
    echo "   Starting PM2..."
    pm2 start ecosystem.config.js
fi

# Start Caddy
echo ""
echo "7. Starting Caddy..."
caddy start --config $CONFIG

sleep 2

# Check if Caddy is running
if pgrep -x caddy > /dev/null; then
    echo "   ✓ Caddy is running"
else
    echo "   ✗ Caddy failed to start"
    exit 1
fi

# Test the setup
echo ""
echo "8. Testing setup..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "   ✓ Backend (port 3000) is responding"
else
    echo "   ⚠️  Backend might not be responding correctly"
fi

if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200"; then
    echo "   ✓ Caddy proxy is working"
else
    echo "   ⚠️  Caddy proxy might not be working correctly"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📊 Status:"
pm2 status
echo ""
echo "🌐 Access your site:"
if [ "$CONFIG" = "Caddyfile.local" ]; then
    echo "   http://$SERVER_IP"
    echo "   http://praktikoffice.kz (after DNS update)"
else
    echo "   https://praktikoffice.kz"
    echo "   http://$SERVER_IP"
fi
echo ""
echo "📝 Useful commands:"
echo "   View Caddy logs: caddy logs"
echo "   View PM2 logs: pm2 logs praktikoffice"
echo "   Restart Caddy: caddy reload --config $CONFIG"
echo "   Stop Caddy: caddy stop"
