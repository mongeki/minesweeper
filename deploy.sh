#!/bin/bash

SERVER="root@185.58.204.217"
REMOTE_PATH="/var/www/minesweeper"

echo "🧹 Cleaning dist..."
rm -rf dist

echo "🏗 Building Angular..."
ng build --configuration production

echo "📦 Uploading build..."

scp -r dist/*/browser/* $SERVER:$REMOTE_PATH

echo "🔁 Restart nginx..."
ssh $SERVER "systemctl reload nginx"

echo "✅ Deploy finished"
