# Testing and Pilot Verification

## Automated baseline

The repository now has `build`, `lint`, and `test` scripts. Vitest covers deployment-mode separation, fare arithmetic/validation, the ride transition matrix, client-supplied fare/status tampering, PIN gating, and duplicate completion in the in-memory demo service. Run `npm test`; the current suite has 31 passing tests. API authorization/RLS, provider integration, multi-instance integration, and browser E2E suites are not configured.

Before enabling real services, add automated tests for:

- Fare calculation, input validation, ride transition graph, client fare tampering, PIN gating, and duplicate completion are covered. Add eligibility, matching, earnings, permissions, rating, and persistent idempotency tests.
- API anonymous/wrong-role access, cross-user data access, invalid state/PIN, duplicate acceptance/completion/payment, provider signature failures, and rate limits.
- Integration from authenticated passenger booking through captain assignment, PIN, completion, verified payment, rating, and one wallet credit.
- E2E with two independently authenticated clients, backend-authoritative state, and recovery after refresh/reconnect.

## Two-device ride test record

This mandatory test has **not been run**. The existing demo-service integration test is not a two-device backend test. Do not mark the acceptance flow passed based on a single browser, mock data, or UI state.

| Field | Record |
|---|---|
| Build/commit | Pending |
| Environment | Staging required; production payments disabled |
| Passenger device/browser | Pending |
| Captain device/browser | Pending |
| Ride ID and timestamps | Pending |
| Booking through captain acceptance | Not tested |
| Live location and reconnect recovery | Not tested |
| Arrival, PIN, start, completion | Not tested |
| Payment verification, rating, earnings, history | Not tested |
| Result and defects | Not tested |

## Real-device and failure matrix

Record device model, OS/browser version, network, permissions, build, steps, expected/actual result, and defect ID for each run.

| Platform | Required coverage | Status |
|---|---|---|
| Android Chrome / low-, mid-, high-end | GPS, camera, notifications, background/lock, refresh/restart, network switch, permissions | NOT TESTED |
| Android WebView (if shipped) | Same matrix plus app lifecycle and WebView permission behavior | NOT TESTED |
| iPhone Safari / current supported iOS | GPS, camera, notifications, background/lock, refresh/restart, network switch, permissions | NOT TESTED |
| Older supported iPhone | Same matrix on minimum supported OS/device | NOT TESTED |

## Chaos cases

Exercise passenger/captain offline states at booking, request, navigation, PIN, active ride, completion, and payment; app close/restart; captain going offline/cancel; no eligible captains; GPS/maps failure; invalid PIN; payment timeout/failure; Realtime disconnect; duplicate calls; and server timeout. For every case verify visible recovery state, no duplicate side effect, and eventual server resynchronization.