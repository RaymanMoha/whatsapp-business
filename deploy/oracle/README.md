# Oracle Always Free deployment

This deployment runs the dashboard, bot, WAHA, and HTTPS proxy on one ARM Ubuntu VM. MongoDB remains on Atlas M0.

## VM shape

- Ubuntu 24.04 ARM image
- VM.Standard.A1.Flex
- 2 OCPUs and 12 GB RAM within the current Always Free allowance
- At least 50 GB boot volume
- Open ingress ports 22, 80, and 443

## Install and start

```bash
sudo apt-get update
sudo apt-get install -y git ca-certificates curl
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
newgrp docker

git clone https://github.com/RaymanMoha/whatsapp-business.git
cd whatsapp-business
cp .env.production.example .env.production
nano .env.production
docker compose -f docker-compose.production.yml up -d --build
docker compose -f docker-compose.production.yml ps
```

Point the `DOMAIN` DNS A record to the VM public IPv4 before starting Caddy. Caddy obtains and renews HTTPS automatically.

## Connect the WhatsApp session

WAHA is not exposed publicly. From the local computer, open an SSH tunnel:

```bash
ssh -L 3001:127.0.0.1:3001 ubuntu@VM_PUBLIC_IP
```

Then open `http://localhost:3001/dashboard`, sign in, and scan the QR code. The session is stored in the `waha_sessions` Docker volume.

## Operations

```bash
docker compose -f docker-compose.production.yml logs -f --tail=100
docker compose -f docker-compose.production.yml restart
git pull
docker compose -f docker-compose.production.yml up -d --build
```
