# Deployment guide

## Recommended deployment target

- Vercel for Next.js frontend
- Supabase for Postgres + Auth + Storage + Realtime
- Razorpay for payment orchestration
- Google Maps or Mapbox for map and route data
- Firebase Cloud Messaging for push notifications

## Production checklist

- add real environment variables
- enable secure secrets handling
- validate route and auth server endpoints
- configure RLS and service role access carefully
- test payment signatures and webhooks
- keep demo mode active for safe local testing

## Build validation

```bash
npm run build
```

## Launch

```bash
npm run start
```
