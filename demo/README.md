# Nia Beauty Nairobi demo

A fictional Nairobi beauty shop, with 8 makeup, body-care, and fragrance products. The images and product names come from [DummyJSON](https://dummyjson.com/docs/products), a sample ecommerce dataset. `nia-beauty.json` records each source URL. Prices, availability, hours and delivery/return policies are illustrative demo values; no relationship with the pictured brands is claimed.

Set `DEMO_PROFILE=nia-beauty` and `MONGODB_DB=whatsapp_business_nia_demo` on both the dashboard and standalone bot. Run `npm run demo:seed` against that dedicated database, or let fresh collections initialise on first read. Existing merchant databases are not replaced. Product images are bundled locally and stored as image data, so WhatsApp image sending does not depend on a remote hotlink.

Demo checkout shows the cart and a clear preview message. It does not initiate M-Pesa, mark payments paid, create real orders, or book delivery. Disable the profile to return to ordinary commerce behaviour.

## Suggested walkthrough

1. `hi` — a short welcome and category suggestions.
2. `fragrance` — browse the matching products and actual photos.
3. `Gucci Bloom` — a single photo card with product details.
4. `add two` — add the product in context, without product codes.
5. `cart`, then `checkout` — a no-charge checkout preview.
6. `show pics of Red Lipstick` — a specific product photo.
7. `browse`, then `more` — continue discovering products.
8. `What does delivery cost?` — approved demo policy.

Red Nail Polish is deliberately sold out to demonstrate availability handling. No fake customers, testimonials, payment confirmations or delivery events are seeded.
