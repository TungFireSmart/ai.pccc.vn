#!/usr/bin/env bash
set -euo pipefail

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

echo "Done. Expected URL: https://billy.rsa.vn"
