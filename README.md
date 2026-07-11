# WAHA + Groq WhatsApp FAQ Bot

Small starter for a WhatsApp FAQ assistant using WAHA for WhatsApp Web automation and Groq for fast AI replies.

This is best for MVPs and demos. WAHA is not Meta's official WhatsApp Cloud API, so avoid spam, use a dedicated business number, and move serious/high-volume clients to the official API later.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Edit `.env`:

```bash
GROQ_API_KEY=your_groq_key_here
WAHA_API_KEY=make-this-a-random-long-string
BUSINESS_NAME=Your Client Business
BOT_NAME=Ask Your Business
```

4. Start the webhook bot:

```bash
npm run dev
```

5. In another terminal, start WAHA:

```bash
docker compose --env-file .env up
```

6. Open the WAHA dashboard/API:

```txt
http://localhost:3001
```

7. Start a WAHA session named `default`, scan the QR code with the WhatsApp number, then send a WhatsApp message to that number.

## Test without WhatsApp

Once `npm run dev` is running:

```bash
curl -s http://localhost:8080/test/reply \
  -H "Content-Type: application/json" \
  -d '{"message":"What time are you open?"}'
```

## Business knowledge

Edit:

```txt
src/knowledge.js
```

Replace the demo restaurant information with the client's approved information:

- hours
- location
- services
- pricing rules
- booking process
- payment instructions
- delivery/coverage
- human handoff details

The bot is instructed not to invent answers outside this file.

## Production notes

- Do not expose WAHA publicly without `WAHA_API_KEY`.
- Use HTTPS for hosted webhooks.
- Use a dedicated WhatsApp number, not a personal number.
- Reply only to inbound customer messages.
- Keep rate limits low and add human takeover for unclear cases.
- WAHA is useful for fast MVPs; official WhatsApp Cloud API is safer for serious production.

## Useful endpoints

- Bot health: `GET http://localhost:8080/health`
- Webhook receiver: `POST http://localhost:8080/webhook`
- Local AI test: `POST http://localhost:8080/test/reply`
- WAHA API/dashboard: `http://localhost:3001`
