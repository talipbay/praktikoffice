#!/bin/bash

echo "🔄 Resetting Caddy completely..."
echo ""

# Stop Caddy
echo "1. Stopping Caddy..."
caddy stop 2>/dev/null
pkill -9 caddy 2>/dev/null
sleep 2

# Remove all Caddy data
echo "2. Removing all Caddy data and certificates..."
rm -rf ~/.local/share/caddy
rm -rf ~/.config/caddy
rm -rf /root/.local/share/caddy
rm -rf /root/.config/caddy
rm -rf /var/lib/caddy
rm -rf /var/log/caddy

# Recreate log directory
echo "3. Creating fresh log directory..."
mkdir -p /var/log/caddy

echo ""
echo "✅ Caddy reset complete!"
echo ""
echo "Now start Caddy with:"
echo "  caddy start --config Caddyfile"
