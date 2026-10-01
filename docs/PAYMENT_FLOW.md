# Payment Flow

## Current state

`services/paymentService.ts` is an in-memory demo fixture. It does not call Razorpay; its verify function constructs a successful payment without validating a provider response. Production API routes return 503 instead of exposing that fixture. No payment or wallet behavior is ready for real funds.

## Required production flow

1. Authenticate the passenger and load the ride from the database; require a payable terminal ride state.
2. Compute the payable amount server-side from persisted fare components. Ignore amount, ride owner, earnings, and payment status supplied by the browser.
3. Create one provider order with a stable idempotency key derived from the ride/payment attempt; persist pending state and provider order ID transactionally.
4. Return only the public Razorpay key ID, order ID, amount, and currency needed by the client.
5. Verify provider signatures server-side and treat webhooks as the authoritative asynchronous event source. Verify webhook signatures against the raw request body.
6. Make webhook processing idempotent with unique provider event/payment IDs and legal state transitions. Retries must not duplicate payments or earnings.
7. Reconcile timeouts and partial failures against provider state. Refunds and chargebacks require explicit states, audit events, and wallet reversal policy.
8. Only after verified payment/ride completion should one database transaction create captain earnings and platform/tax ledger entries.

## Required controls and tests

- Separate Razorpay test credentials in staging from production credentials; never expose the secret through `NEXT_PUBLIC_*`.
- Test invalid signatures, mismatched amount/currency/ride, duplicate webhook, out-of-order events, timeout, failure, refund, and concurrent verification.
- Reconcile provider settlement reports against internal ledger entries before pilot launch.
- Never mark payment successful from a client redirect/callback alone.