# WhatsApp Commerce Hub

Dashboard and WhatsApp bot for a small commerce assistant using WAHA for WhatsApp Web automation and Groq for AI replies.

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
AUTH_SECRET=make-this-a-random-long-string
BUSINESS_NAME=Your Client Business
BOT_NAME=Ask Your Business
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB=whatsapp_business
```

If `MONGODB_URI` is set, conversations and message templates are stored in MongoDB Atlas. If it is missing, the app falls back to local JSON files under `data/` for local development.

4. Start WAHA:

```bash
docker compose --env-file .env up
```

5. Start the WhatsApp webhook bot:

```bash
npm run bot:start
```

6. Start the admin dashboard:

```bash
npm run dev -- -p 3002
```

7. Open the admin dashboard:

```txt
http://localhost:3002
```

8. Open the WAHA dashboard/API:

```txt
http://localhost:3001
```

9. Start a WAHA session named `default`, scan the QR code with the WhatsApp number, then send a WhatsApp message to that number.

## Test without WhatsApp

Once `npm run bot:start` is running:

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

- Store dashboard data in MongoDB Atlas using `MONGODB_URI`.
- Do not commit `.env` or any MongoDB password.
- Do not expose WAHA publicly without `WAHA_API_KEY`.
- Use HTTPS for hosted webhooks.
- Use a dedicated WhatsApp number, not a personal number.
- Reply only to inbound customer messages.
- Keep rate limits low and add human takeover for unclear cases.
- WAHA is useful for fast MVPs; official WhatsApp Cloud API is safer for serious production.

## Useful endpoints

- Admin dashboard: `http://localhost:3002/dashboard`
- Products API: `GET http://localhost:3002/api/commerce/products`
- Runtime status API: `GET http://localhost:3002/api/commerce/status`
- Bot health: `GET http://localhost:8080/health`
- Webhook receiver: `POST http://localhost:8080/webhook`
- Local AI test: `POST http://localhost:8080/test/reply`
- WAHA API/dashboard: `http://localhost:3001`
