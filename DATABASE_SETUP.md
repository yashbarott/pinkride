# Database setup

PinkRide currently has no database schema, migration, client, RLS policy, or storage policy. The list below is a planning inventory only, not an implemented schema. Do not connect production user data until migrations and row-level policies have been reviewed and tested.

## Recommended tables

- users
- passenger_profiles
- captain_profiles
- vehicles
- captain_documents
- rides
- ride_locations
- ride_events
- payments
- transactions
- wallets
- wallet_transactions
- ratings
- emergency_contacts
- saved_places
- notifications
- support_tickets
- coupons
- promo_redemptions
- admin_users
- audit_logs

## Staging-only setup sequence

1. Create a Supabase project.
2. Enable Auth.
3. Configure Postgres tables and RLS.
4. Add storage buckets for profile images and verification documents.
5. Add server-side Supabase environment variables to a local secret file; never expose the service-role key through `NEXT_PUBLIC_*`.
6. Implement and apply reviewed migrations, grants, RLS, storage policies, constraints, and indexes.
7. Run negative cross-user and cross-role access tests before connecting API services.

## Notes

The frontend must never hold service-role secrets or payment credentials. See `docs/DATABASE_SECURITY.md` for required ownership rules and verification. No database policies are currently present to certify.
