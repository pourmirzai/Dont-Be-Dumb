DON'T BE DUMB CHECK

Status: POSSIBLE REASONING LOOP

Original goal: Land the `/users` pagination work (commit `a41c02e`, "add pagination to /users") and apply PR feedback (`e1f5a02`, HEAD) with `GET /users` still working; the user confirmed the endpoint worked before this session.

Last known good: Commit `a41c02e` - its message and the CI log excerpt in context document green tests and passing CI, and the user confirmed the endpoint worked before this session. First known bad: the current state (`GET /users` 500). The boundary between them has not been inspected yet.

Current failure: `GET /users` returns 500 with `TypeError: 'NoneType' object is not iterable`.

Facts:
- `a41c02e` ("add pagination to /users"): CI passed, tests green per commit message and CI log excerpt.
- `7be9d14` ("refactor user serialization") touches `api/serializers.py`.
- `e1f5a02` (HEAD, "apply PR feedback"); `git status` shows uncommitted edits to `api/views.py`.
- Current `GET /users` 500: `TypeError: 'NoneType' object is not iterable`; user confirmed it worked before this session.
- The agent so far: added a null guard in `api/views.py`, added a fallback in `api/serializers.py`, disabled one test.

Assumptions:
- That the `None` originates where the guard/fallback were placed (no traceback file:line has been captured).
- That the regression comes from this session's uncommitted `api/views.py` edits rather than `7be9d14` or `e1f5a02` (no diff against `a41c02e` has been taken).
- That disabling the test was legitimate rather than masking the regression.

Evidence for current hypothesis: Hypothesis - a `None` value reaches an iteration during views/serialization and guards will stop the 500. Supporting: the error is literally `'NoneType' object is not iterable`, and `7be9d14` touched `api/serializers.py`, adjacent to the likely origin.

Evidence against: The 500 is still the current failure after the null guard and fallback were added; no evidence shows any of the three changes helped. The disabled test removed a signal, and the `a41c02e` boundary was never diffed.

What changed: Since `a41c02e`: commits `7be9d14`, `e1f5a02`, plus uncommitted `api/views.py` edits; this session added a null guard (`api/views.py`), a fallback (`api/serializers.py`), and disabled one test.

Possible explanations:
1. `7be9d14` serialization refactor made a field `None` that `api/views.py` iterates (committed regression).
2. Uncommitted `api/views.py` edits from this session broke the iteration (working-tree regression).
3. `e1f5a02` "apply PR feedback" changed the response shape.
4. The guard/fallback mask the real `None` source while the disabled test hides the failing expectation - the root cause is untouched.
5. Data/config issue: `None` is produced outside these code changes entirely.

Best next diagnostic: Capture the full `GET /users` traceback (exact file:line of the `TypeError`) and run `git diff a41c02e` (working tree versus the green commit) plus `git diff` against HEAD - read-only; re-enabling the disabled test should be proposed to the user, not done silently.

Why: `a41c02e` is a credible last known good but the boundary has never been examined; the traceback plus that diff separate committed regressions (`7be9d14`, `e1f5a02`) from session edits before any further patching.

Do not change code yet.
