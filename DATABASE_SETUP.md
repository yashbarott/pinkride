# Database setup

PinkRide is structured for PostgreSQL and Supabase-ready schemas. The current project keeps the frontend working in demo mode while the backend service layer is prepared for a production database integration.

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

## Recommended setup

1. Create a Supabase project.
2. Enable Auth.
3. Configure Postgres tables and RLS.
4. Add storage buckets for profile images and verification documents.
5. Link the environment variables in `.env.local`.

## Notes

All sensitive operations should be handled in server routes or server functions. The frontend should never hold service-role secrets or payment credentials.
