# Backup and Recovery

## Current state

There is no configured production database or storage, so no backup schedule or recovery capability can currently be verified. Ride and payment fixtures are process-local and are lost on restart. Recovery readiness is **NOT_STARTED**.

## Before staging or production data

- Configure automated encrypted database backups and point-in-time recovery according to an approved retention and RPO/RTO policy.
- Define storage backup/versioning for private KYC objects separately from public assets; preserve access controls on restore.
- Store infrastructure configuration and migration artifacts in version control; keep credentials in the deployment secret manager.
- Document restore approvers and maintain an out-of-band incident contact list.

## Recovery runbook

1. Declare incident severity, stop unsafe booking/payment mutations, and preserve provider/database audit evidence.
2. Select a recovery point within the approved RPO; restore into an isolated environment first.
3. Validate schema/migration version, row counts, ownership/RLS, storage references, and payment ledger/provider reconciliation.
4. Obtain incident-owner approval before routing traffic; rotate credentials if compromise is suspected.
5. Re-enable traffic gradually and run health, authentication, ride, payment, notification, and safety smoke tests.
6. Record data-loss window, recovered version, actions, and follow-up. Do not claim recovery readiness until a timed restore drill succeeds.

Schedule and record restore drills before the controlled pilot; document measured RPO/RTO and migration rollback procedures here.