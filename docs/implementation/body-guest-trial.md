# Guest body edit trial

Guests may complete one successful edit without signing in. Accounts always use their existing prepaid balance (15 credits/edit); the service passes `trialCredits: 0`. This change does not revoke old balances, implement checkout, or introduce subscriptions.

## Ownership and limits

`POST /api/body-edit/guest-session` requires an exact same-origin Origin header and creates/reuses a random 256-bit host-only cookie. It is HttpOnly, SameSite=Lax, scoped to `/api/body-edit`, Secure on HTTPS, and lasts one year. Only the token's SHA-256 owner identifier is persisted. Returning that identifier to the UI does not authorize any API: polling, recovery and download require the cookie or the owning account session. Guest results remain readable with the original cookie after login. Banned users and auth failures cannot fall back to guest execution.

`body_guest_edit` contains no auth user FK and creates no credit ledger rows. A unique partial index permits only one processing/succeeded job per guest. Failed jobs release the allowance; expired jobs become failed, and late output cannot revive them. An identical request UUID reuses the original job; changed input conflicts. Provider I/O occurs after the transaction commits, once per new reservation.

`config/body-guest.ts` bounds retries: three attempts per guest/hour, ten per network/hour, five processing/successful trials per network/24 hours. Failed attempts still count toward hourly budgets. PostgreSQL serializes reservations with network-then-guest transaction advisory locks; SQLite uses immediate transactions. Network identity uses HMAC-SHA256 with the existing `BETTER_AUTH_SECRET`, never a stored raw IP. Production trusts only the Worker-provided `CF-Connecting-IP`; missing trusted identity fails closed. Localhost uses one shared development network identity.

The allowance is per retained browser cookie, not proof of a person's identity. Clearing cookies or switching networks can bypass a browser-only identity; network caps bound common resets, and may also limit people sharing an IP. There is no claim of permanent person-level enforcement. Removing guest rows would reset their allowance; retain the quota record if a future result-deletion feature removes the image.

## Migration and runtime

Apply `0007_body_guest_edit.sql` for the selected PG/SQLite database before enabling the new code. It only adds the guest table and indexes. For a database managed by Drizzle, use its normal migration workflow. The currently configured development Neon database was set up without a Drizzle journal; on 2026-10-15 only this reviewed additive migration was applied, verifying 17 columns and four indexes, without replaying historical migrations. This does not deploy or migrate a separate production database. No new environment variables or bindings are required beyond the existing provider, private result storage, database and auth secret.

The browser initializes the cookie without generating, preserves its request UUID in session storage for interrupted-request recovery, and reads authoritative allowance from the server. First generation requires no login; exhausted guests see sign-in guidance. Signing in retains the selected original and always selects account billing. The $4.99 pack/checkout remains separate work.

## Verification

Unit coverage uses real SQLite transactions plus opt-in PostgreSQL tests in a random isolated schema (`GUEST_PG_TEST=true`). Browser coverage in `body-guest-trial.spec.ts` runs real handlers, service and SQLite repository; only provider, private object storage and auth session are fixtures. No live paid generation is needed for regression. See the guest entry in `tests/e2e/TEST-CATALOG.md` for current results.
