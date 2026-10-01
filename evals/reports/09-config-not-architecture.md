DON'T BE DUMB CHECK

Status: POSSIBLE REASONING LOOP

Original goal: Make the React app at `http://localhost:3000` successfully fetch `https://api.local/v1/me` — the request blocked in the browser console.
Last known good: Not proven by any run or user confirmation. Best-supported candidate: the pre-Tuesday state where the served origin was `http://localhost:5173` — the only origin `.env` allows. Supporting evidence is circumstantial (the `.env` value plus "Tuesday's tooling change"), so it is an inference, not a confirmed green state.
Current failure: `Access to fetch at 'https://api.local/v1/me' from origin 'http://localhost:3000' has been blocked by CORS policy`.
Facts:
- `.env` sets `CORS_ALLOWED_ORIGINS=http://localhost:5173` — the old Vite port.
- The app has run on port 3000 since Tuesday's tooling change.
- `django-cors-headers` logs show the origin being rejected.
- The agent's plan — "CORS middleware is too rigid — I'll introduce an API gateway layer with a reverse proxy so origins are handled centrally; also refactor `settings.py` middleware ordering" — has been stated twice; a `gateway/` package and `settings.py` edits are already drafted. `.env` was never checked.
Assumptions:
- That the CORS middleware is too rigid or that `settings.py` middleware ordering is implicated — nothing gathered to support this.
- That a gateway + reverse proxy layer is required — untested, and disproportionate to a single-origin rejection.
Evidence for current hypothesis: Rejection is enforced by `django-cors-headers` (its logs show the rejected origin), so middleware is where the symptom appears — but nothing shows the middleware is misconfigured rather than correctly enforcing `.env`.
Evidence against: The allow-list (`http://localhost:5173`) does not contain the blocked origin (`http://localhost:3000`), and the port changed on Tuesday — a direct, sufficient explanation requiring no architecture change.
What changed: Tuesday's tooling change moved the served origin from 5173 to 3000; `CORS_ALLOWED_ORIGINS` was not updated. Nothing in the middleware or `settings.py` has changed.
Possible explanations:
1. Stale configuration: `CORS_ALLOWED_ORIGINS` not updated after the port change — directly supported by the facts.
2. Middleware ordering / architectural problem — the agent's hypothesis, with zero supporting evidence.
3. Something specific to the `https://api.local/v1/me` scheme/host — not supported by the rejection log so far.
Best next diagnostic: Single-variable test — add `http://localhost:3000` to `CORS_ALLOWED_ORIGINS` in `.env`, restart, and re-run only the failing fetch. No gateway, no `settings.py` edits.
Why: if the fetch succeeds, configuration was the whole problem and the architecture hypothesis is falsified for near-zero cost; only if it fails with the origin allowed does middleware/proxy investigation earn a look.

Safe to resume: add `http://localhost:3000` to `CORS_ALLOWED_ORIGINS` in `.env`, restart, and re-run the `https://api.local/v1/me` fetch — discard the `gateway/` draft and leave `settings.py` middleware ordering untouched.
