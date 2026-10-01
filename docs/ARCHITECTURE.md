# PinkRide Architecture Audit

## Current architecture map

- **Passenger and captain UI:** `app/page.tsx` and prototype components under `components/`; one Next.js app currently contains both experiences.
- **Admin UI:** `app/admin/page.tsx`; fixture statistics were previously unauthenticated. The page is now available only in local demo mode and needs real server-authenticated admin access before deployment.
- **API:** Next.js App Router handlers under `app/api/` call `services/`. Production requests now fail closed where only fixtures exist.
- **Ride state and matching:** `services/rideService.ts` stores rides in a process-local array; `services/matchingService.ts` selects fixture captains. Neither survives restarts or coordinates multiple instances.
- **Authentication:** `services/authService.ts` provides fixed demo identities and OTP only. There is no provider-backed session, secure cookie, refresh, logout, recovery, or account deletion flow.
- **Payments:** `services/paymentService.ts` is a fixture. It does not create or verify Razorpay orders and has no webhook or refund handling.
- **Database / Supabase:** no migration/schema, Supabase client, RLS policy, storage policy, or Realtime subscription implementation was found.
- **Maps / location:** environment placeholders and UI models exist; there is no verified routing or live-location backend.
- **Other services:** notification, safety, wallet, support, and captain services are scaffolding/fixtures, not production integrations.
- **Configuration:** environment files are ignored; example files are explicitly allowlisted. Only blank templates belong in source control.
- **Feature flags:** server-side environment switches are defined in `lib/config.ts` and default off. They are not yet enforced across provider operations or exposed as authenticated admin settings.

## Production boundary

`lib/config.ts` separates deployment environment (`APP_ENV`) from app mode (`PINKRIDE_MODE`). Production always disables demo mode; staging can explicitly run demo mode without confusing it with `NODE_ENV=production`. Current API handlers return HTTP 503 with a stable error envelope when real implementations are unavailable. `/api/health` reports dependencies as degraded/unconfigured rather than healthy. This is a safety guard, not a production backend.

## Required next architecture steps

1. Adopt Supabase Auth as the server-verified identity source and establish role claims plus secure session cookies.
2. Add migrations, RLS policies, database-backed domain services, transactions, constraints, and indexes before enabling ride/payment APIs.
3. Implement server-only provider adapters for OTP, maps, payments/webhooks, notifications, monitoring, and analytics.
4. Add authorization and audit logging to every privileged operation; test each role against actual RLS policies.
5. Keep demo fixtures isolated from production modules and credentials; production readiness remains blocked until the two-device acceptance flow passes.