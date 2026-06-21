#!/usr/bin/env bash
# ============================================================
# Yolotech88 — one-shot server setup for Ubuntu 22.04/24.04 EC2
# Run this ON the EC2 instance (not your laptop), as a sudo user:
#   bash server-setup.sh
# It installs nginx + certbot and configures the site.
# Copy the website files into /var/www/yolotech88 (see DEPLOY.md) BEFORE running,
# or run it first and copy after — nginx will serve once files are present.
# ============================================================
set -euo pipefail

DOMAIN="yolotech88.com"
WEBROOT="/var/www/${DOMAIN}"

echo "==> Updating packages"
sudo apt-get update -y

echo "==> Installing nginx + certbot"
sudo apt-get install -y nginx certbot python3-certbot-nginx

echo "==> Creating web root: ${WEBROOT}"
sudo mkdir -p "${WEBROOT}"
sudo chown -R "$USER":"$USER" "${WEBROOT}"

echo "==> Installing nginx site config"
sudo cp ./nginx-yolotech88.conf /etc/nginx/sites-available/yolotech88
sudo ln -sf /etc/nginx/sites-available/yolotech88 /etc/nginx/sites-enabled/yolotech88
# Remove the default site so it doesn't shadow ours
sudo rm -f /etc/nginx/sites-enabled/default

echo "==> Testing & reloading nginx"
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl reload nginx

echo ""
echo "============================================================"
echo " nginx is up and serving ${WEBROOT} on port 80."
echo ""
echo " NEXT:"
echo "  1. Make sure your website files are in ${WEBROOT}/index.html"
echo "  2. Point GoDaddy DNS A records (@ and www) at this server's Elastic IP"
echo "  3. Once DNS resolves, enable HTTPS:"
echo "       sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo "============================================================"
