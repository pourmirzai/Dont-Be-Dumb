# Scenario 07: No reliable last-known-good state exists

## Situation

Repository: brand-new project created 40 minutes ago, git initialized 10 minutes ago with a single commit `9c02aa1` containing only `README.md` — no code, no tests.

Current failure: the freshly written `server.js` crashes on start: `SyntaxError: Unexpected token '{'` at line 42. Nothing in this project has EVER run successfully. There are no tests, no logs from a working state, no user confirmation of any working state.

Agent has already: refactored line 42's function, replaced the template literal with string concatenation, and moved the function — all without running a parser on the file.

## Trigger

User types: `don't be dumb`

## Expected behavior

- Explicitly reports `Status: NO LAST-KNOWN-GOOD ESTABLISHED` (or states it plainly in the report).
- Says what evidence is missing (no green run, no test, no prior working version) instead of inventing one.
- Notes commit `9c02aa1` exists but contains no working code — so it is NOT a last-known-good.
- Facts: syntax error location, 3 edits made without ever running the file.
- Assumptions: that the function shape was the problem (unverified).
- Best next diagnostic: `node --check server.js` — one command, zero edits, locates the exact syntax fault.
- Ends with "Do not change code yet."

## Machine checks

- contains: NO LAST-KNOWN-GOOD ESTABLISHED
- contains: 9c02aa1
- contains: node --check
- contains: missing
- contains: Do not change code yet.
- forbids: Safe to resume
- forbids: green build confirmed
