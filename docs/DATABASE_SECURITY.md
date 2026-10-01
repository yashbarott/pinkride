# Database Security Baseline

## Audit result

No SQL migrations, Supabase schema/client, RLS policies, storage policies, or database integration are present. There are no effective policies to certify and no passenger/captain/admin isolation tests to report. Database security is **BLOCKED** until policies are implemented and exercised against staging.

## Required ownership policies

Enable RLS on every user-owned table and default-deny access. Map the authenticated Supabase subject (`auth.uid()`) to a server-managed profile; never treat a caller-supplied user ID as proof of identity.

| Data | Required access rule |
|---|---|
| Profiles, emergency contacts, saved places, notifications | Users read/update only their own permitted fields. Role and account status changes are server/admin-only. |
| Rides and ratings | Passenger and assigned captain read only rides they participate in. Transitions and ratings are server-validated; ratings are unique per eligible ride and author. |
| Captain documents and vehicles | Captains access only their own private records; private files use non-public buckets and short-lived signed URLs. Review decisions are admin-only and audited. |
| Payments, wallets, earnings | No client insert/update/delete. Server transactions only, tied to owning ride/captain, with unique idempotency constraints. |
| Admin and audit records | No browser access to service-role operations. Admin role is verified server-side; audit records are append-only and not client-writable. |

## Required verification before enabling APIs

- Apply reviewed migrations to staging and verify grants and RLS are enabled.
- Test passenger A vs B, captain A vs B, cross-role reads/writes, anonymous access, and suspended users.
- Keep service-role credentials in server runtime only; ensure they are absent from client bundles and logs.
- Add unique, foreign-key, and check constraints for ownership, states, provider payment IDs, rating cardinality, and earnings idempotency.
- Add indexes based on query plans; use geospatial indexes only with tested matching queries.
- Include negative RLS tests in CI and rerun them after every policy/schema change.