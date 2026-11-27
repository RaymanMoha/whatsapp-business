#!/usr/bin/env bash
set -euo pipefail
project="${1:?Usage: create-vm.sh PROJECT_ID (after verifying an active, unupgraded Free Trial)}"
case "${GCP_BILLING_MODE:-trial}" in
  trial)
    if [[ "${GCP_TRIAL_VERIFIED:-}" != true ]]; then
      echo 'Verify active Free Trial credit in Billing first, then set GCP_TRIAL_VERIFIED=true.' >&2
      exit 1
    fi
    ;;
  approved)
    if [[ ! "${GCP_APPROVED_MONTHLY_BUDGET:-}" =~ ^[0-9]+([.][0-9]+)?$ ]]; then
      echo 'Paid billing requires an explicitly approved GCP_APPROVED_MONTHLY_BUDGET.' >&2
      exit 1
    fi
    echo "Paid billing approved with a monthly budget of ${GCP_APPROVED_MONTHLY_BUDGET}. Budget alerts are not a hard spending cap."
    ;;
  *) echo 'GCP_BILLING_MODE must be trial or approved.' >&2; exit 1 ;;
esac
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
  --machine-type="${GCP_MACHINE_TYPE:-e2-small}" --image-family=ubuntu-2404-lts-amd64 --image-project=ubuntu-os-cloud \
  --boot-disk-size=30GB --boot-disk-type=pd-standard --subnet="$subnet" --tags=whatsapp-demo \
  --no-service-account --network-tier=STANDARD --metadata-from-file="startup-script=$script_dir/vm-bootstrap.sh"
gcloud compute instances describe "$instance" --zone="$zone" --project="$project" --format='value(networkInterfaces[0].accessConfigs[0].natIP)'
