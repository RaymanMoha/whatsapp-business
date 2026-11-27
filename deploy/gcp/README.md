# Google Cloud trial deployment

This deployment moves the bot, WAHA, dashboard, callback receiver and MongoDB to a single x86 Ubuntu VM. It has no dependency on the Mac, a local tunnel or Atlas. WhatsApp and database data live in persistent Docker volumes, and Docker starts on reboot.

## Account gate

Activate an eligible Google Cloud Free Trial yourself, complete billing verification and link it to the intended project. Verify remaining credit and the trial end date before creating resources. Do not upgrade to paid billing as part of this workflow. A project without linked billing cannot host the VM.

The default VM is `e2-medium` (4 GB RAM), chosen to fit the complete application and local database. **It is not an Always Free VM.** Its usage and public IPv4 consume trial credit. Keep the existing Vercel deployment as a fallback. Trial credits expire, and an unupgraded trial may stop its resources. A billing alert is informational, not a spending cap.

## Prepare the VM

Run from an authenticated Google Cloud Shell or local gcloud CLI:

```bash
GCP_TRIAL_VERIFIED=true bash deploy/gcp/create-vm.sh YOUR_PROJECT_ID
```

This creates a dedicated network, permits public HTTPS/HTTP and SSH from Google's IAP range only, and installs Docker. It leaves the application stopped. It creates no service-account credentials. Wait for the startup script to finish before deploying.

## Private configuration and migration

1. Create `.env.gcp` locally with mode 600, outside Git. Preserve the app's current `AUTH_SECRET`, settings encryption key and dashboard password hash when migrating encrypted settings. Supply the configured AI key and webhook signing key privately.
2. Set `MONGO_USERNAME=commerce`, generate a new random hexadecimal `MONGO_PASSWORD`, and set `MONGODB_URI=mongodb://commerce:PASSWORD@mongo:27017/?authSource=admin`. Preserve `MONGODB_DB`.
3. Set `DOMAIN` to an owned hostname or `whatsapp.VM_IPV4.sslip.io`. Set `MPESA_CALLBACK_URL=https://DOMAIN/api/commerce/payments/callback?token=CALLBACK_SECRET`. Retain the correct sandbox/production payment environment; do not invent credentials.
4. Set `WAHA_IMAGE=devlikeapro/waha:gows-2026.10.1`, `WAHA_API_KEY`, `WAHA_SESSION=default`, and `WHATSAPP_HOOK_HMAC_KEY`. The GCP image is x86, not the Mac's ARM image.
5. Copy the private file through an authenticated SSH/IAP connection. Install it as `/opt/whatsapp-business/.env.gcp` with mode 600. Do not put keys or WhatsApp session archives in VM metadata, Git, public URLs or browser logs.
6. Restore a fresh database dump before starting the bot. Stop the local bot/WAHA before transferring the WhatsApp session or relinking; never run both copies of the same WhatsApp session concurrently. If the transfer fails, scan a new cloud-session QR using the phone.

Run on the VM:

```bash
cd /opt/whatsapp-business
sudo docker compose --env-file .env.gcp -f deploy/gcp/compose.yml up -d --build
sudo docker compose --env-file .env.gcp -f deploy/gcp/compose.yml ps
```

WAHA is bound only to VM loopback. Reach its QR/session API through an SSH tunnel, not a public firewall port:

```bash
gcloud compute ssh whatsapp-demo --project=YOUR_PROJECT_ID --zone=us-central1-a \
  --tunnel-through-iap -- -L 3001:127.0.0.1:3001
```

Migration is complete only after verifying: MongoDB restored; bot healthy; WAHA WORKING; public dashboard and callback reachable over HTTPS; actual incoming WhatsApp product, number, quantity, photo and checkout flows; reboot persistence; and the same flow while local bot/WAHA are stopped. Take a fresh protected database backup and keep the recovery instructions before removing the local installation.

## Current status

Deployment files prepared; no Google Cloud VM has been created by these files. Billing/trial activation and cloud migration still require completion.
