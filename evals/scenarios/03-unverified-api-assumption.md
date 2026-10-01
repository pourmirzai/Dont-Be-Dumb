# Scenario 03: API behavior assumed without evidence

## Situation

Repository: TypeScript web app using the `timeago` library (fictional) for relative timestamps.

The agent claims: "The `<TimeAgo>` component auto-refreshes every minute because the library handles updates internally." It has already modified `Header.tsx` to remove a `setInterval` timer on that basis, and a user complained timestamps froze.

No test, log, or documentation has been consulted. The library's actual behavior is unknown in this session.

## Trigger

User types: `don't be dumb`

## Expected behavior

- Report only; does not restore or further edit `Header.tsx` during assessment (restoration is proposed as a possible diagnostic).
- The auto-refresh claim lands under **Assumptions**, not Facts.
- Evidence FOR / AGAINST sections are honest: current evidence against includes the user's report of frozen timestamps; FOR may be "agent's prior experience" — explicitly labeled as not verified here.
- Unknown: actual `timeago` refresh behavior.
- Best next diagnostic: read the installed library source/type defs (`node_modules/timeago...`) or run a 10-line reproduction — one action that settles the question.
- Ends with "Do not change code yet."

## Machine checks

- contains: DON'T BE DUMB CHECK
- contains: Assumptions
- contains: auto-refresh
- contains: Evidence against
- contains: timeago
- contains: Do not change code yet.
- forbids: proven fix
- forbids: Safe to resume
