# Deployment Checklist

## Environment isolation

- Use separate Supabase projects, domains, provider credentials, storage buckets, and monitoring projects for development, staging, and production.
- Copy the appropriate `.env.*.example` to the platform secret manager; never commit populated environment files.
- Set `APP_ENV=staging` and `PINKRIDE_MODE=production` in staging; set both to `production` in production. Production always disables demo mode regardless of `PINKRIDE_MODE`.
- Use provider sandbox/test credentials in staging, separate from production.
- Expose only intentionally public values through `NEXT_PUBLIC_*`. Keep service-role, Razorpay secret, OTP, FCM, and Resend credentials server-side.

## Before deployment

- Validate and rotate environment variables; restrict service-role credentials to server runtime.
- Apply reviewed database migrations, RLS, and storage policies; test each role.
- Enable API authentication, authorization, request validation, idempotency, rate limits, and audit logs.
- Configure maps key restrictions, OTP, payment, email, and push providers.
- Configure Razorpay webhooks with signature verification and retry/idempotency coverage.
- Verify domain, HTTPS/SSL, security headers, error monitoring, alert ownership, backups, and rollback procedure.
- Pass build, lint, unit, integration, API, E2E, restore, failure tests; record legal/compliance sign-off.

## After deployment smoke checks

- Health reflects actual dependency reachability, not merely configured environment variables.
- Authentication, passenger/captain/admin authorization and suspended-account rejection.
- Ride booking, matching, location, reconnect recovery, PIN, completion, cancellation, and history.
- Payment success/failure/webhook retry/refund and one-time earnings using sandbox or approved controlled tests.
- Notification delivery, safety event escalation, admin audit trail, and private KYC access controls.
- Confirm logs contain no OTPs, credentials, private tokens, or unnecessary personal/document data.

## Current release gate

Production integrations are not implemented in this repository. API operations intentionally return 503 outside demo mode. This checklist is not evidence of a deployable production service; deploy only to isolated staging until blockers in `PRODUCTION_READINESS.md` are closed.