# PinkRide

PinkRide is a passenger and captain ride-booking prototype. The Stage 4 audit found that its API services are demo fixtures, not production integrations. Do not use it for real bookings, credentials, or payments.

## Current status

This project keeps the existing demo UI and includes scaffolding for:

- real authentication abstractions
- database-ready models
- ride state types and in-memory demo ride state
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
npm test
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

Production mode fails closed with HTTP 503 for API operations that do not have real provider-backed implementations. The current ride state is process-local, OTP is a fixed demo flow, payment verification is a fixture, and database/RLS, realtime, live location, and admin authorization are not implemented. See [docs/PRODUCTION_READINESS.md](docs/PRODUCTION_READINESS.md) before considering any pilot.

## Documentation

- [Architecture audit](docs/ARCHITECTURE.md)
- [Production readiness](docs/PRODUCTION_READINESS.md)
- [Database security](docs/DATABASE_SECURITY.md)
- [Payment flow](docs/PAYMENT_FLOW.md)
- [Testing and device checklist](docs/TESTING.md)
- [Backup and recovery](docs/BACKUP_AND_RECOVERY.md)
- [Deployment checklist](docs/DEPLOYMENT.md)
