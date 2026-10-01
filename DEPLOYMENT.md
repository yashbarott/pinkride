# Deployment guide

## Recommended deployment target

- Vercel for Next.js frontend
- Supabase for Postgres + Auth + Storage + Realtime
- Razorpay for payment orchestration
- Google Maps or Mapbox for map and route data
- Firebase Cloud Messaging for push notifications

## Release status

Production providers and database security are not implemented. API operations fail closed outside demo mode. This repository is not ready for public launch or real-money transactions.

## Production checklist

- add real environment variables
- enable secure secrets handling
- validate route and auth server endpoints
- configure RLS and service role access carefully
- test payment signatures and webhooks
- set demo mode off in staging and production; demo fixtures must not serve production requests
- use test/sandbox credentials in staging and separate projects from production

## Build validation

```bash
npm run build
```

## Launch

```bash
npm run start
```

For the full pre/post-deployment gate, see `docs/DEPLOYMENT.md` and `docs/PRODUCTION_READINESS.md`.
