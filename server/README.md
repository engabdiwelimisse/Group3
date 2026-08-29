# Kaalmo — Server

Node.js/Express + MongoDB backend for the Kaalmo fundraising platform (see `kaalmo-web-only-spec.md` for the full product/technical spec).

## Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set `MONGODB_URI` to a real MongoDB Atlas connection string. Also set real values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` (any long random string) before running anything beyond local dev.

### Sending real emails (optional)

By default, verification emails are only logged to the console (dev mode). To send real emails:

1. Create a free account at [resend.com](https://resend.com) and get an API key.
2. Set `RESEND_API_KEY` in `.env`.
3. Without a verified sending domain, Resend's test mode only delivers to the email address on your own Resend account — verify a domain in Resend to send to any address.

## Run

```bash
npm run dev
```

The server will fail to start until `MONGODB_URI` points to a reachable database.

## What's implemented (this phase)

- Mongoose models: User, Campaign, Beneficiary, Donation, Payment, PaymentTransaction, Withdrawal, PayoutAccount, Update, Comment, Verification.
- Auth: register, login, refresh, email verification (dev-mode console email). Phone/SMS OTP endpoint is stubbed (`501 NOT_IMPLEMENTED`) until an SMS gateway is chosen.
- Campaign CRUD + lifecycle transition guard (`draft → submitted → under_review → ...`), updates, comments.
- Donation + withdrawal endpoints wired to a `PaymentService` abstraction with only the `manual` (admin-recorded) provider implemented — real mobile money/card/bank providers are explicit `TODO`s pending provider verification (spec Section 14).
- Standardized error shape: `{ "error": { "code", "message", "fields" } }`.
- Security basics: helmet, CORS allowlist, rate limiting on auth/donation routes, bcrypt password hashing, JWT access+refresh.

## Not yet implemented

- Real payment provider integrations (mobile money, card, bank).
- Real SMS/OTP gateway.
- Admin dashboard, fraud scoring, notifications, React client.

## Example requests

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Amina Ali","email":"amina@example.com","phone":"+252611234567","password":"supersecret"}'

curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"amina@example.com","password":"supersecret"}'
```
