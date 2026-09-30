# PinkRide Setup Guide

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment

Create a local environment file from the example:

```bash
cp .env.example .env.local
```

Update values for your production integrations when ready.

## 3. Start the app

```bash
npm run dev
```

## 4. Production build

```bash
npm run build
```

## 5. Deploying

Use Vercel or any Node-compatible deployment target. Do not commit real secrets.
