#!/usr/bin/env bash
# ============================================================
# Put vendora88.com into MAINTENANCE mode.
# Run on the EC2 box before you start deploying/changing the vendora app.
#
# It swaps the live vendora site out for the maintenance page:
#   - disables the live app config (vendero88)
#   - enables the maintenance config (serves /var/www/html/maintenance.html, HTTP 503)
#
# yolotech88.com is NOT affected — it has its own server_name and keeps serving.
# ============================================================
set -euo pipefail

ENABLED=/etc/nginx/sites-enabled
AVAILABLE=/etc/nginx/sites-available
LIVE_APP=vendero88        # <-- the currently-enabled vendora app config

echo "==> Enabling maintenance page"
sudo ln -sf "${AVAILABLE}/maintenance" "${ENABLED}/maintenance"

echo "==> Disabling live app (${LIVE_APP})"
sudo rm -f "${ENABLED}/${LIVE_APP}"

echo "==> Testing & reloading nginx"
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Maintenance mode ON — vendora88.com now shows the maintenance page."
