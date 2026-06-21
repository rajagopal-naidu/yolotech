#!/usr/bin/env bash
# ============================================================
# Take vendora88.com OUT of maintenance mode (restore the live app).
# Run on the EC2 box after your vendora changes/deploy are done.
# ============================================================
set -euo pipefail

ENABLED=/etc/nginx/sites-enabled
AVAILABLE=/etc/nginx/sites-available
LIVE_APP=vendero88        # <-- the vendora app config to restore

echo "==> Disabling maintenance page"
sudo rm -f "${ENABLED}/maintenance"

echo "==> Re-enabling live app (${LIVE_APP})"
sudo ln -sf "${AVAILABLE}/${LIVE_APP}" "${ENABLED}/${LIVE_APP}"

echo "==> Testing & reloading nginx"
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Maintenance mode OFF — vendora88.com is live again."
