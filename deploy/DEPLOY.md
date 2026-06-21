# Deploying Yolotech88 to EC2 + GoDaddy domain

This is a static site, so the whole job is: run nginx on an EC2 box, copy the files there,
give the box a fixed (Elastic) IP, point GoDaddy DNS at that IP, then turn on HTTPS.

Total time: ~30 minutes. DNS propagation can take 5 min – a few hours.

---

## 1. Launch the EC2 instance

In the AWS Console → **EC2 → Launch instance**:

| Setting | Value |
|---|---|
| Name | `yolotech88-web` |
| AMI | **Ubuntu Server 24.04 LTS** (or 22.04) |
| Instance type | `t3.micro` (or `t2.micro` for free tier) |
| Key pair | Create/download one (e.g. `yolotech88.pem`) — you need it to SSH |
| Storage | 8–16 GB gp3 is plenty |

**Security group** — add inbound rules:

| Type | Port | Source |
|---|---|---|
| SSH | 22 | My IP (your IP only) |
| HTTP | 80 | Anywhere `0.0.0.0/0`, `::/0` |
| HTTPS | 443 | Anywhere `0.0.0.0/0`, `::/0` |

Launch it.

---

## 2. Give it a fixed IP (Elastic IP)

A plain EC2 public IP **changes on stop/start** — bad for DNS. Allocate a static one:

EC2 → **Elastic IPs → Allocate Elastic IP address** → **Associate** it with `yolotech88-web`.

Note this IP — e.g. `52.12.34.56`. This is what GoDaddy will point to.

---

## 3. Connect and run setup

From your machine (Git Bash / PowerShell with OpenSSH):

```bash
# fix key permissions once (Git Bash)
chmod 400 yolotech88.pem

ssh -i yolotech88.pem ubuntu@52.12.34.56     # use your Elastic IP
```

Copy the `deploy/` folder up first, or just paste the script. Easiest: from your **local** project
folder, upload everything:

```bash
# run locally, from c:\Raj\yolotech
scp -i yolotech88.pem -r index.html css js deploy ubuntu@52.12.34.56:/tmp/site
```

Then on the server:

```bash
cd /tmp/site/deploy
bash server-setup.sh
# copy the actual website files into the web root:
sudo cp -r /tmp/site/index.html /tmp/site/css /tmp/site/js /var/www/yolotech88/
```

Visit `http://52.12.34.56` in a browser — the site should load over HTTP. ✅

---

## 4. Point GoDaddy DNS at the server

GoDaddy → **My Products → Domains → yolotech88.com → DNS / Manage DNS**.

Delete any existing parked `A` record for `@`, then add:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `52.12.34.56` (your Elastic IP) | 600 |
| A | `www` | `52.12.34.56` (your Elastic IP) | 600 |

> If GoDaddy won't let you add an A record for `www`, use a **CNAME**: Name `www` → Value `yolotech88.com`.
> Remove GoDaddy's default "Domain Forwarding" if it's set, or it overrides these records.

Check propagation:

```bash
nslookup yolotech88.com
# or:  dig +short yolotech88.com
```

When it returns your Elastic IP, DNS is live. `http://yolotech88.com` now works.

---

## 5. Enable HTTPS (free, auto-renewing)

Once DNS resolves to the box, run on the server:

```bash
sudo certbot --nginx -d yolotech88.com -d www.yolotech88.com
```

Choose **redirect HTTP → HTTPS** when prompted. Certbot edits the nginx config, installs the
Let's Encrypt cert, and sets up auto-renewal (verify with `sudo certbot renew --dry-run`).

`https://yolotech88.com` is now live with a padlock. 🔒

---

## 6. Future updates (redeploy)

When you change the site, just re-upload the files:

```bash
# locally
scp -i yolotech88.pem -r index.html css js ubuntu@52.12.34.56:/tmp/new
# on server
sudo cp -r /tmp/new/index.html /tmp/new/css /tmp/new/js /var/www/yolotech88/
```

No nginx restart needed for content changes.

---

## Notes & alternatives

- **Cheaper/zero-maintenance option:** since this is a pure static site, **S3 + CloudFront** (or
  Cloudflare Pages / Netlify) would cost cents and need no server patching. EC2 is the right call
  only if you plan to host a backend/API on the same box later. Happy to write that path instead.
- **Keep the OS patched:** `sudo apt-get update && sudo apt-get upgrade -y` periodically.
- **Tailwind in production:** the site currently uses the Tailwind Play CDN. For best performance,
  compile Tailwind to a static CSS file (see the main `README.md`) before going live.
