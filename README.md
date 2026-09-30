# PinkRide Stage 3

PinkRide is a women-only mobility platform with a passenger app, captain app, and production-ready architecture scaffolding for the next phase of the product.

## Current status

This project keeps the Stage 1 and Stage 2 demo UI intact while introducing a production-oriented backend foundation for:

- real authentication abstractions
- database-ready models
- server-side ride states
- matching and eligibility services
- API routes for auth, rides, and payments
- admin dashboard foundation
- environment configuration and deployment documentation

## Project structure

- `app/` — Next.js App Router pages and API routes
- `components/` — passenger and captain UI
- `services/` — backend-facing service layer and mock production adapters
- `lib/` — environment, config, and eligibility checks
- `types/` — shared TypeScript models

## Demo mode

Demo mode remains active by default. The app still works without real service credentials and can be switched to production mode through environment config later.

## Environment

Copy `.env.example` to `.env.local` and fill in values when you connect Supabase, Razorpay, maps, or messaging providers.

## Useful commands

```bash
npm install
npm run dev
npm run build
```

## API routes introduced

- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/rides`
- `POST /api/rides/[id]/accept`
- `POST /api/payments/create`
- `POST /api/payments/verify`
- `GET /api/admin/dashboard`

## Important note

The frontend continues to render the demo UI, while the server-side service layer acts as the authoritative boundary for production-ready business logic. This keeps the demo behavior stable while preparing the app for real auth, payments, maps, and monitoring integration.
