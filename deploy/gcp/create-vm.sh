#!/usr/bin/env bash
set -euo pipefail
project="${1:?Usage: create-vm.sh PROJECT_ID (after verifying an active, unupgraded Free Trial)}"
if [[ "${GCP_TRIAL_VERIFIED:-}" != true ]]; then
  echo 'Verify active Free Trial credit in Billing first, then set GCP_TRIAL_VERIFIED=true. This script does not activate or upgrade billing.' >&2
  exit 1
fi
zone="${GCP_ZONE:-us-central1-a}"
region="${zone%-*}"
instance="${GCP_INSTANCE:-whatsapp-demo}"
network=whatsapp-demo
subnet=whatsapp-demo
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
gcloud services enable compute.googleapis.com --project="$project"
if ! gcloud compute networks describe "$network" --project="$project" >/dev/null 2>&1; then
  gcloud compute networks create "$network" --subnet-mode=custom --project="$project"
fi
if ! gcloud compute networks subnets describe "$subnet" --region="$region" --project="$project" >/dev/null 2>&1; then
  gcloud compute networks subnets create "$subnet" --network="$network" --range=10.80.0.0/24 --region="$region" --project="$project"
fi
if ! gcloud compute firewall-rules describe whatsapp-demo-web --project="$project" >/dev/null 2>&1; then
  gcloud compute firewall-rules create whatsapp-demo-web --network="$network" --allow=tcp:80,tcp:443,udp:443 --source-ranges=0.0.0.0/0 --target-tags=whatsapp-demo --project="$project"
fi
if ! gcloud compute firewall-rules describe whatsapp-demo-iap --project="$project" >/dev/null 2>&1; then
  gcloud compute firewall-rules create whatsapp-demo-iap --network="$network" --allow=tcp:22 --source-ranges=35.235.240.0/20 --target-tags=whatsapp-demo --project="$project"
fi
if gcloud compute instances describe "$instance" --zone="$zone" --project="$project" >/dev/null 2>&1; then
  echo 'Instance already exists; it was not changed. Inspect it before continuing.' >&2
  exit 1
fi
gcloud compute instances create "$instance" --project="$project" --zone="$zone" \
  --machine-type=e2-medium --image-family=ubuntu-2404-lts-amd64 --image-project=ubuntu-os-cloud \
  --boot-disk-size=30GB --boot-disk-type=pd-standard --subnet="$subnet" --tags=whatsapp-demo \
  --no-service-account --metadata-from-file="startup-script=$script_dir/vm-bootstrap.sh"
gcloud compute instances describe "$instance" --zone="$zone" --project="$project" --format='value(networkInterfaces[0].accessConfigs[0].natIP)'
