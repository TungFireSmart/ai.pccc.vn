# Deploy ai.pccc.vn review build on billy.rsa.vn

## Current app path
- Source: `/home/agent/.openclaw/workspace/ai-pccc/app`
- Static build output: `/home/agent/.openclaw/workspace/ai-pccc/app/dist`

## What Cindy already fixed
- Disabled `gateway.controlUi.dangerouslyDisableDeviceAuth`
- Added gateway auth rate limiting
- Tightened `/home/agent/.openclaw/credentials` permissions to `700`
- Re-validated OpenClaw config and re-ran security audit

## Remaining blocker
This session cannot use elevated/root shell from webchat, so installing a public reverse proxy must be run manually with sudo on the server.

## Recommended deployment method
Use **Caddy** to serve the built frontend directly on `billy.rsa.vn` with automatic HTTPS.

## One-shot commands (run on the server)
```bash
cd /home/agent/.openclaw/workspace/ai-pccc/app
npm run build

sudo apt-get update
sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list >/dev/null
sudo apt-get update
sudo apt-get install -y caddy

sudo tee /etc/caddy/Caddyfile >/dev/null <<'EOF'
billy.rsa.vn {
    encode gzip zstd
    root * /home/agent/.openclaw/workspace/ai-pccc/app/dist
    try_files {path} /index.html
    file_server
}
EOF

sudo systemctl enable --now caddy
sudo systemctl reload caddy || sudo systemctl restart caddy
```

## Expected result
- Public URL: `https://billy.rsa.vn`
- Caddy will request/install TLS automatically if ports 80/443 are reachable from the internet.

## If HTTPS certificate issuance fails
Check:
- router/cloud firewall allows inbound `80/tcp` and `443/tcp`
- the domain `billy.rsa.vn` still resolves to this server public IP
- no other service is already binding 80/443

## Quick verification
```bash
curl -I http://billy.rsa.vn
curl -I https://billy.rsa.vn
systemctl status caddy --no-pager
```

## Updating the site later
```bash
cd /home/agent/.openclaw/workspace/ai-pccc/app
npm run build
sudo systemctl reload caddy
```

## Rollback
```bash
sudo systemctl stop caddy
sudo rm -f /etc/caddy/Caddyfile
sudo apt-get remove -y caddy
```
