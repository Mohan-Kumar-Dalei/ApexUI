# Backend: Node.js + Express + MongoDB

Match the backend to the project. A brand site with a contact form needs one validated route. A store needs everything below.

## Layout
```
server/
  .env.example      PORT, MONGO_URI, JWT_SECRET, CLIENT_ORIGIN
  src/config.js     loads server/.env by path, fails loudly when JWT_SECRET is missing
  src/db.js         MONGO_URI, or mongodb-memory-server with files in server/.data for local dev
  src/models.js     Product, User, Order, Appointment, Subscriber
  src/seed.js       the catalogue, looks; inserts missing items at start
  src/auth.js       JWT in an httpOnly cookie, readSession, requireUser
  src/routes.js     every endpoint, validated with zod
  src/index.js      helmet CSP, json limit, cookie parser, origin check, error shape, static client in production
```

## Endpoints
| Method | Path | Does |
| --- | --- | --- |
| GET | /api/products?category&colour&min&max&q&sort | list, filters from validated input only |
| GET | /api/filters | facets with counts, from the live catalogue |
| GET | /api/products/:slug | one product and related ones |
| GET | /api/looks | styled looks with their pieces |
| POST | /api/quote | prices a bag: lines, services, look discount, coupon, shipping |
| POST | /api/orders | validates, re-prices, takes stock atomically, returns the public order |
| POST | /api/orders/lookup | track by order number and phone (POST keeps the phone out of URLs and logs) |
| POST | /api/auth/register, /login, /logout; GET /api/auth/me | accounts |
| GET | /api/me/orders | the signed-in customer's orders |
| GET | /api/appointments/slots?date; POST /api/appointments | bookings; a unique index on date + slot stops double booking |
| POST | /api/newsletter | upsert an email |

## Rules that matter
- **Prices only from the database.** The client sends slugs, quantities and options; the server looks up prices. `templates/fashion/pricing.js` (looks) and `templates/food/server/pricing.js` (build-your-pack) have the line and total logic, including services (stitching, finishing), bundles (a look counts only when every piece is there) and coupons.
- **Options belong to the product.** Accessories never get garment services; a made-to-size option needs a size (reject the order otherwise).
- **Stock.** For each line `updateOne({ _id, stock: { $gte: qty } }, { $inc: { stock: -qty } })`; if any line fails, give back what was taken and return 409 with a plain message.
- **Validation.** zod on every body and query, with human messages ("Enter a 10 digit mobile number."). Express 5's simple query parser plus zod types means no `$` operators can arrive.
- **Accounts.** bcrypt cost 12; compare against a dummy hash when the email is unknown so both paths take the same time; JWT HS256 in an httpOnly, SameSite=Lax cookie (Secure in production), 7 days.
- **Abuse.** Rate limit auth, orders, bookings and newsletter (20 per 15 minutes). Reject writes whose Origin is not the site.
- **Headers.** helmet with a CSP that allows only your scripts, Google Fonts and your image host.
- **Errors.** One shape: `{ error, fields? }`. Details only in the server log.
- **Public objects.** Return orders through a function that drops internal ids and anything the customer should not see.

## Running it
- Dev: Vite on one port proxies `/api` to Express on another; cookies stay same-origin.
- Prod: build the client; Express serves `client/dist` and falls back to `index.html` for non-API routes. Set MONGO_URI (Atlas or your own) and a long JWT_SECRET.
- If the site must be static (a demo on a static host), put a browser-side mock behind the same `api()` function with the same rules, and say so on the page.
