#!/bin/bash

echo "🔒 Setting up HTTPS for praktikoffice.kz"
echo "=========================================="
echo ""

# Stop Caddy
echo "1. Stopping Caddy..."
caddy stop 2>/dev/null
pkill -9 caddy 2>/dev/null
sleep 2

# Remove all old Caddy data
echo "2. Cleaning old certificates and data..."
rm -rf ~/.local/share/caddy
rm -rf ~/.config/caddy
rm -rf /root/.local/share/caddy
rm -rf /root/.config/caddy

# Create directories
echo "3. Creating directories..."
mkdir -p /var/log/caddy
mkdir -p ~/.local/share/caddy

# Check DNS
echo ""
echo "4. Checking DNS configuration..."
DOMAIN_IP=$(dig +short praktikoffice.kz | tail -n1)
SERVER_IP=$(curl -s ifconfig.me)

echo "   Domain praktikoffice.kz resolves to: $DOMAIN_IP"
echo "   Your server IP is: $SERVER_IP"

if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    echo ""
    echo "   ⚠️  WARNING: DNS mismatch!"
    echo "   Please update your DNS A record to: $SERVER_IP"
    echo ""
    read -p "   Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check ports
echo ""
echo "5. Checking ports..."
if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "   ⚠️  Port 80 is in use"
    lsof -i :80
else
    echo "   ✓ Port 80 is available"
fi

if lsof -Pi :443 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "   ⚠️  Port 443 is in use"
    lsof -i :443
else
    echo "   ✓ Port 443 is available"
fi

# Check PM2
echo ""
echo "6. Checking backend service..."
if pm2 list | grep -q "praktikoffice.*online"; then
    echo "   ✓ PM2 app is running on port 3000"
else
    echo "   ⚠️  PM2 app is not running!"
    echo "   Starting PM2..."
    pm2 start ecosystem.config.js
    sleep 2
fi

# Test backend
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "   ✓ Backend is responding"
else
    echo "   ⚠️  Backend is not responding on port 3000"
fi

# Validate Caddyfile
echo ""
echo "7. Validating Caddyfile..."
if caddy validate --config Caddyfile; then
    echo "   ✓ Caddyfile is valid"
else
    echo "   ✗ Caddyfile has errors!"
    exit 1
fi

# Start Caddy
echo ""
echo "8. Starting Caddy with HTTPS..."
caddy start --config Caddyfile

sleep 3

# Check if Caddy started
if pgrep -x caddy > /dev/null; then
    echo "   ✓ Caddy is running"
else
    echo "   ✗ Caddy failed to start"
    exit 1
fi

# Monitor certificate acquisition
echo ""
echo "9. Monitoring SSL certificate acquisition..."
echo "   (This may take 30-60 seconds)"
echo ""

for i in {1..60}; do
    if caddy logs 2>&1 | grep -q "certificate obtained successfully"; then
        echo "   ✓ SSL certificates obtained!"
        break
    fi
    if caddy logs 2>&1 | grep -q "error"; then
        echo "   ⚠️  Errors detected in logs"
        break
    fi
    echo -n "."
    sleep 1
done

echo ""
echo ""

# Show status
echo "10. Final status check..."
echo ""

# Test HTTP
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://praktikoffice.kz 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "308" ]; then
    echo "   ✓ HTTP redirect working (code: $HTTP_CODE)"
elif [ "$HTTP_CODE" = "200" ]; then
    echo "   ✓ HTTP working (code: $HTTP_CODE)"
else
    echo "   ⚠️  HTTP not working (code: $HTTP_CODE)"
fi

# Test HTTPS
HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://praktikoffice.kz 2>/dev/null || echo "000")
if [ "$HTTPS_CODE" = "200" ]; then
    echo "   ✓ HTTPS working (code: $HTTPS_CODE)"
else
    echo "   ⚠️  HTTPS not ready yet (code: $HTTPS_CODE)"
    echo "      Certificate acquisition may still be in progress"
fi

echo ""
echo "=========================================="
echo "✅ Setup complete!"
echo ""
echo "🌐 Your site:"
echo "   https://praktikoffice.kz"
echo ""
echo "📊 Check status:"
echo "   pm2 status"
echo "   caddy logs"
echo ""
echo "📝 View logs:"
echo "   caddy logs | tail -50"
echo "   pm2 logs praktikoffice"
echo ""
echo "🔄 Reload Caddy:"
echo "   caddy reload --config Caddyfile"
echo ""

# Show recent Caddy logs
echo "Recent Caddy logs:"
echo "-------------------"
caddy logs 2>&1 | tail -20
