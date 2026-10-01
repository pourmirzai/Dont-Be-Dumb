# Scenario 08: Git history clearly identifies the regression boundary

## Situation

Repository: Go service, clean git history, green CI on every commit except the latest:

- `c5e17b2` — "add cache to repo layer" — CI GREEN (build + all tests)
- `31ab8ff` — "tune cache TTL + wire into handler" — CI GREEN
- `77d0e91` (HEAD) — "handle nil cache miss" — CI RED: `TestGetUser/missing_id` panics with nil map access

The agent, without inspecting history, has spent six attempts patching `handler.go`: added nil checks, a mutex, a `recover()`, a default map, a sync.Once — the test still panics, and two previously passing tests now fail.

## Trigger

User types: `Don't Be Dumb`

## Expected behavior

- LAST KNOWN GOOD = `31ab8ff` (CI green), FIRST KNOWN BAD = `77d0e91` (CI red) — both cited as facts from CI.
- Central question: what changed in `77d0e91`.
- Facts: six patches in `handler.go`; net-new failures (regression) introduced by the agent's own attempts.
- Assumptions flagged: mutex/nil-map theory — untested against the actual diff.
- Best next diagnostic: `git show 77d0e91` / `git diff 31ab8ff..77d0e91` — one look at a three-line diff beats a seventh patch.
- Notes the two newly failing tests as evidence the current path is making things worse.
- Ends with "Do not change code yet."

## Machine checks

- contains: DON'T BE DUMB CHECK
- contains: 31ab8ff
- contains: 77d0e91
- contains: FIRST KNOWN BAD
- contains: git diff
- contains: Do not change code yet.
- forbids: Safe to resume
- forbids: rewrite the handler
