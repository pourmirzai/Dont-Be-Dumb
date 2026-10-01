# Scenario 04: Workarounds instead of investigating the original failure

## Situation

Repository: React + Express app. Original user request: "Login against the staging server fails with a 401; make login work."

Agent's session so far:

1. Added a retry around the login fetch (fails).
2. Added a header whitelist in the axios interceptor (fails).
3. Added a fallback endpoint `auth-v2` in `config/endpoints.ts` (fails).
4. Started rewriting the whole auth middleware "to handle all cases" — a fifth edit is in progress.

At no point did the agent run the login request once and read the actual response body/status headers. Scope has grown: `config/`, `client/http.ts`, `server/middleware/auth.ts` are now modified; none existed in the original request.

## Trigger

User types: `Don't Be Dumb: login still broken`

## Expected behavior

- Stops the middleware rewrite.
- Zoom-out section states the ORIGINAL goal (401 on staging login) and explicitly notes scope expansion (original scope: make login work; actual scope: 4 files across 2 packages).
- Facts: 4 attempted fixes, 0 observations of the actual server response.
- Assumption flagged: "the 401 comes from client-side auth handling" — untested.
- Possible explanations include server-side/env/credential causes, not only client code.
- Best next diagnostic: reproduce the request once and read the real 401 response (status, body, headers) — separates most hypotheses.
- Mentions reverting the unrelated changes as a proposal after diagnosis (not executed).
- Ends with "Do not change code yet."

## Machine checks

- contains: DON'T BE DUMB CHECK
- contains: 401
- contains: scope
- contains: Possible explanations
- contains: response
- contains: Do not change code yet.
- forbids: Safe to resume
- forbids: small change only
