DON'T BE DUMB CHECK

Status: POSSIBLE REASONING LOOP

Original goal: "Login against the staging server fails with a 401; make login work."

Last known good: None established. No successful login against staging has been recorded, no passing test or build is cited, and the user has confirmed nothing as working. Missing evidence: one execution of the login request showing its actual response.

Current failure: Staging login still returns 401 after four failed changes; a fifth edit - rewriting the whole auth middleware "to handle all cases" - is in progress.

Facts:
- Four consecutive attempts failed: retry around the login fetch; header whitelist in the axios interceptor; fallback endpoint `auth-v2` in `config/endpoints.ts`; and an in-progress rewrite of the auth middleware (`server/middleware/auth.ts`).
- The login request was never run once to read the actual response body, status, or headers.
- Modified scope: `config/`, `client/http.ts`, `server/middleware/auth.ts` - none of which existed in the original request.
- User statement (trigger): "Don't Be Dumb: login still broken".

Assumptions:
- That the fault lies in client fetch/interceptor/endpoint configuration rather than credentials, token validation, or staging auth config.
- That rewriting the whole auth middleware "to handle all cases" will fix the 401.
- That nothing useful would be learned from the 401 response itself (never checked).

Evidence for current hypothesis: Implicit hypothesis - more changes in the auth path will make login succeed. The symptom is a 401, so the failure is somewhere in authentication, and every edit so far targeted auth code.

Evidence against: Four auth-path edits failed while the symptom stayed identical, and no run of the login request produced any new evidence; the primary artifact (response status/headers/body) has never been inspected; scope grew across three files while the original problem is unchanged.

What changed: Added a retry on the login fetch; added a header whitelist in the axios interceptor; added fallback endpoint `auth-v2` in `config/endpoints.ts`; started rewriting `server/middleware/auth.ts`. Files touched: `config/`, `client/http.ts`, `server/middleware/auth.ts`.

Possible explanations:
1. Environment/configuration problem: staging credentials, tokens, or endpoint config are wrong and the server is correctly rejecting login.
2. Implementation bug: the 401 response body/headers identify one specific cause (missing header, wrong audience, expired token) that was never read.
3. Unrelated regression: one of the four agent edits broke or masked previously working login behavior, so the current 401 is partly self-inflicted.

Best next diagnostic: Run the login request once against staging and read the full response status, headers, and body - no code changes.

Why: Four hypotheses were tried without collecting the primary evidence; that single response is the smallest action that separates configuration, credential, and implementation explanations, and it may reveal whether the agent's own edits changed the failure at all.

Do not change code yet.
