#!/bin/bash

# Quick start script for praktikoffice with PM2 and Caddy

echo "🚀 Starting praktikoffice deployment..."

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Build the application
echo "🔨 Building application..."
pnpm build

# Create logs directory
mkdir -p logs

# Start with PM2
echo "⚙️  Starting PM2..."
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Show status
echo ""
echo "✅ Application started!"
echo ""
pm2 status
echo ""
echo "📊 View logs: pm2 logs praktikoffice"
echo "🔍 Monitor: pm2 monit"
echo ""
echo "🌐 Next steps:"
echo "   1. Start Caddy: caddy run --config Caddyfile.local"
echo "   2. Or for production: caddy run --config Caddyfile (update domain first)"
echo "   3. Visit: http://localhost"
