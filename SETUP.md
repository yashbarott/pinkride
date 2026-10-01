# PinkRide Setup Guide

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment

Create a local environment file from the local demo template:

```bash
cp .env.local.example .env.local
```

The local template keeps demo mode enabled. Do not put production credentials in a local file. Staging and production require separate provider projects and server-side secrets; use `.env.staging.example` and `.env.production.example` as variable inventories, not as files containing credentials.

## 3. Start the app

```bash
npm run dev
```

## 4. Production build

```bash
npm run build
```

## 5. Automated tests

```bash
npm test
```

## 6. Deploying

Use Vercel or any Node-compatible deployment target. Do not commit real secrets.

Production APIs are intentionally unavailable until provider-backed authentication, database, ride, and payment services replace the demo fixtures. Review `docs/DEPLOYMENT.md` and `docs/PRODUCTION_READINESS.md` before deployment.
