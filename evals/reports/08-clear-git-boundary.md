DON'T BE DUMB CHECK

Status: POSSIBLE REASONING LOOP

Original goal: Keep the Go service green — build and all tests passing — with `TestGetUser/missing_id` passing after `77d0e91` "handle nil cache miss".
Last known good: `31ab8ff` — "tune cache TTL + wire into handler" — CI GREEN (build + all tests). (`c5e17b2` "add cache to repo layer" was also CI GREEN.) FIRST KNOWN BAD: `77d0e91` (HEAD) — CI RED.
Current failure: `TestGetUser/missing_id` panics with nil map access at `77d0e91`; after six attempts the panic persists and two previously passing tests now fail.
Facts:
- CI: `c5e17b2` GREEN, `31ab8ff` GREEN, `77d0e91` (HEAD) RED — `TestGetUser/missing_id` panics with nil map access.
- Six attempts patched `handler.go`: nil checks, a mutex, a `recover()`, a default map, a sync.Once.
- Two previously passing tests now fail — net-new failures introduced by the agent's own patches on top of `77d0e91`.
- Git history was not inspected before patching; the `77d0e91` diff has never been looked at.
Assumptions:
- That a nil-map/concurrency interaction in `handler.go` is the root cause — never tested against the actual diff of `77d0e91`.
- That `handler.go` is where the fault lies, rather than in the repo/cache layer touched by this commit series — unverified.
Evidence for current hypothesis: The panic message "nil map access" is superficially consistent with the nil-map theory.
Evidence against: Six patches on that theory did not stop the panic; each round added failures instead of removing them; the decisive evidence — the diff between green `31ab8ff` and red `77d0e91` — has not been examined.
What changed: `31ab8ff..77d0e91` is the regression boundary; then six unverified `handler.go` patches layered on top, two of which broke previously passing tests.
Possible explanations:
1. Implementation bug in `77d0e91`'s "handle nil cache miss" change — a small, inspectable diff.
2. The agent's own patches interact badly with the cache/handler path, compounding the original failure.
3. Test or expectation problem in `TestGetUser/missing_id` — unlikely given the clean green history before `77d0e91`.
Best next diagnostic: `git diff 31ab8ff..77d0e91` (equivalently `git show 77d0e91`)
Why: CI already pinpoints the boundary; one look at the diff between FIRST KNOWN BAD and LAST KNOWN GOOD isolates the root cause — far more informative than a seventh patch. The two newly failing tests show the current path is making things worse.

Do not change code yet.
