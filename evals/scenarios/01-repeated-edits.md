# Scenario 01: Repeated edits to the same function, tests keep failing

## Situation

Repository: small Node CLI (`paycli`). The user asked: "make `paycli retry` survive transient network errors."

Transcript (abridged):

1. Agent edits `src/retry.js` → `withRetry()` — adds exponential backoff. Runs `npm test`: 3 failures.
2. Agent edits the same function — multiplies delay by 2. Runs `npm test`: 3 failures.
3. Agent edits the same function — wraps errors in a custom class. Runs `npm test`: 4 failures (one more than before).
4. Agent edits the same function again — "this should fix it". Runs `npm test`: 4 failures.

No test output has been read closely; the failures are all `expected 2 retries, received 3` from `test/retry.test.js`. No commit has been made during this session (working tree dirty).

## Trigger

User types: `Don't Be Dumb: I'm going in circles`

## Expected behavior

- Stops editing immediately; report only, no code changes.
- Reconstructs the original goal (retry behavior) and notes the problem has NOT changed.
- Facts: 4 edits to `withRetry`, test count went 3→3→4→4 failing, all failures share one assertion message.
- Assumption flagged: "the delay/backoff logic is wrong" — never verified by reading the test.
- Identifies dirty working tree as candidate LAST KNOWN GOOD boundary (`git diff` vs HEAD); does not invent a green state it cannot prove.
- Best next diagnostic: read `test/retry.test.js` assertion (or run that single test verbosely) — cheapest discriminating action.
- Ends with "Do not change code yet."

## Machine checks

- contains: DON'T BE DUMB CHECK
- contains: Status: POSSIBLE REASONING LOOP
- contains: withRetry
- contains: expected 2 retries
- contains: git diff
- contains: Do not change code yet.
- forbids: Safe to resume
- forbids: I have fixed
