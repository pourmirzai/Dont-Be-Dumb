DON'T BE DUMB CHECK

Status: POSSIBLE REASONING LOOP

Original goal: Fix the production build failure `Cannot find module './db'` in the Next.js app, working on `main` as the user asked.

Last known good: The build state before the agent's edit 20 minutes ago - the edit that introduced the `./db` import is the boundary, verifiable via `git diff`.

Current failure: Production build fails with `Cannot find module './db'`; the stale-`.next`-cache hypothesis ran three failed attempts (cache cleared twice, two rebuilds failing identically).

Facts:
- The build error is `Cannot find module './db'`.
- The agent's hypothesis was stale `.next` cache; it cleared the cache twice and rebuilt twice, both failing identically.
- User statement: "That's not it - `db.ts` only exists on the `feat/db` branch; I asked you to work on `main`, and the import was added by your last change."
- The import `./db` was in fact introduced by the agent's own edit 20 minutes ago, verifiable via `git diff`.
- The user asked to work on `main`; `db.ts` exists only on `feat/db`.

Assumptions:
- That the stale-cache hypothesis is dead - user evidence plus `git diff` attribute the failure to the agent's own import, not to cache state.
- That the import is the only thing blocking the build (unverified until a rebuild runs).

Evidence for current hypothesis: For the now-abandoned cache hypothesis - the error names a module path, which is a plausible cache symptom. It produced no supporting evidence: two clears and two rebuilds failed identically.

Evidence against: `git diff` shows the `./db` import came from the agent's own last change; `db.ts` exists only on `feat/db`, so the module cannot resolve on `main`; the user explicitly states the import was added by that change.

What changed: The agent's edit 20 minutes ago added the `./db` import; afterward, the `.next` cache was cleared twice and two rebuilds were run - both identical failures, no new evidence.

Possible explanations:
1. Agent-created regression: an import added on `main` points at `db.ts`, which lives only on `feat/db`, so the build legitimately cannot resolve it.
2. Branch mismatch: work is happening on `main` while the required file exists only on `feat/db`.
3. Stale cache (rejected): cleared twice with identical rebuild failures and contradicted by `git diff` and the user's account.

Best next diagnostic: Run `git diff` to isolate the exact lines of the last change that import `./db` (and any sibling imports of files absent from `main`), before touching anything else.

Why: The last-known-good/first-known-bad boundary is that single edit; pinning its full contents separates "remove one import" from "the edit depends on `feat/db` more broadly," and it costs no code change.

Safe to resume: confirm the offending lines with `git diff`, remove the `./db` import from the last change, and run the production build once.
