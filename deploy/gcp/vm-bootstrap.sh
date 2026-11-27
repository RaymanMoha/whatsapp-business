#!/usr/bin/env bash
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl git docker.io docker-compose-v2 docker-buildx
systemctl enable --now docker
if ! swapon --show=NAME --noheadings | grep -q '^/swapfile$'; then
  if [[ ! -f /swapfile ]]; then
    fallocate -l 4G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
  fi
  swapon /swapfile
  grep -q '^/swapfile ' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
if [[ ! -d /opt/whatsapp-business/.git ]]; then
  git clone https://github.com/RaymanMoha/whatsapp-business.git /opt/whatsapp-business
fi
# Provisioning does not start any app or WhatsApp session. Install private config,
# restore the database and transfer/relink WhatsApp before the application cutover.
echo 'VM prepared. Application remains stopped until migration and configuration are complete.'
