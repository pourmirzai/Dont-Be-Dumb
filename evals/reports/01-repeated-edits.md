DON'T BE DUMB CHECK

Status: POSSIBLE REASONING LOOP

Original goal: Make `paycli retry` survive transient network errors (small Node CLI `paycli`).

Last known good: None established. No commit was made this session (working tree dirty), no green `npm test` run is recorded, and no state has been confirmed working. Missing evidence: a passing run of `test/retry.test.js` or a committed baseline where the retry tests passed.

Current failure: `npm test` reports 4 failures in the latest run, all `expected 2 retries, received 3` from `test/retry.test.js`.

Facts:
- Four consecutive edits were made to `withRetry()` in `src/retry.js`: added exponential backoff; multiplied delay by 2; wrapped errors in a custom class; one further edit ("this should fix it").
- `npm test` results in order: 3 failures, 3 failures, 4 failures, 4 failures.
- Every failure message is `expected 2 retries, received 3` from `test/retry.test.js`.
- No test output has been read closely this session.
- No commit this session; working tree dirty.

Assumptions:
- That the failures are caused by the new backoff/error-wrapping code rather than a pre-existing expectation mismatch (no green baseline exists to compare against).
- That the 4th failure is a regression introduced by the custom error class (consistent with 3 -> 4, not proven).
- That `2 retries` is the correct expectation for the user's request.

Evidence for current hypothesis: Implicit hypothesis - adjusting `withRetry()` in `src/retry.js` will satisfy the tests. The failures are all in `test/retry.test.js` against retry behavior, and the edits target that exact function.

Evidence against: The failure message concerns retry *count*, not delay or error type - none of the four edits changed how many retries run. Failure count rose from 3 to 4 after the third edit. Four attempts on the same hypothesis produced no new evidence because output was never read closely.

What changed: `src/retry.js` `withRetry()` - four uncommitted modifications in a dirty working tree; nothing committed, so there is no session diff against HEAD beyond the working tree.

Possible explanations:
1. Implementation bug: the retry loop performs one extra attempt (off by one versus the expected 2).
2. Test/expectation problem: `test/retry.test.js` expects old behavior and the new backoff path changes attempt counting.
3. The custom error class broke a fourth test by changing error type/identity handling.
4. The request was already satisfied before this session; the added backoff changed counts unnecessarily.

Best next diagnostic: Run `npm test` and read one full failure output alongside `test/retry.test.js` to see exactly which tests fail and where the retry count is asserted; run `git diff HEAD` to view all four edit rounds at once.

Why: All failures share one message (`expected 2 retries, received 3`), which points at retry-count logic - the one thing the edits never touched. Reading the test separates an off-by-one implementation bug from a wrong expectation, and explains the 3 -> 4 jump, without changing code.

Do not change code yet.
