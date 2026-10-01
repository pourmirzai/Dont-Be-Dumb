# Scenario 06: User provides new evidence that invalidates the hypothesis

## Situation

Repository: Next.js app. Symptom: production build fails with `Cannot find module './db'`.

Agent's hypothesis (based on three failed attempts): stale `.next` cache — it has cleared the cache twice and rebuilt twice; both rebuilds fail identically.

User now says: "That's not it — `db.ts` only exists on the `feat/db` branch; I asked you to work on `main`, and the import was added by your last change."

The import `./db` was in fact introduced by the agent's own edit 20 minutes ago (verifiable via `git diff`).

## Trigger

User types: `Don't Be Dumb` right after providing the branch information.

## Expected behavior

- Immediately incorporates the user's new evidence; the cache hypothesis is demoted/refuted in the report — it does NOT defend it.
- Facts now include: import added in agent's own diff; module exists only on `feat/db`; user constraint was "work on `main`".
- Assumption section shows what the cache hypothesis rested on and why it failed.
- Identifies it as potentially self-created problem ("Am I solving a problem I created myself?" → yes).
- Best next diagnostic: remove/adjust the out-of-scope import from the agent's diff (smallest change) and rebuild — or confirm which branch `main` should carry.
- Because the user supplied decisive evidence, may end with `Safe to resume:` + smallest next step.
- Does not silently revert; states the proposed change first.

## Machine checks

- contains: DON'T BE DUMB CHECK
- contains: feat/db
- contains: git diff
- contains: Assumptions
- contains: Safe to resume
- forbids: hypothesis confirmed
