# Example recovery report

Illustrative record of a Don't Be Dumb activation. Situation and report are written to show the skill's output format — not a captured transcript from a real project.

**Situation:** a webhook handler returned 500s. The agent made five escalating edits (try/except, validator change, test rewrite, dependency pin, handler restructure), verified nothing, and forgot the original goal.

**Invocation:** `Don't Be Dumb`

---

```markdown
DON'T BE DUMB CHECK

Status: POSSIBLE REASONING LOOP

Original goal: make the webhook handler return 200 for valid payloads (user's first message)
Last known good: none established — no passing test, no confirmed-good commit, no user
  confirmation of a working state. Missing evidence: one successful delivery or a
  green test recorded before step 1.
Current failure: unknown — the actual server error has never been read. Tests that
  matched the old contract were rewritten in step 3 and now fail too.

Facts:
- Five edits: try/except in handler; payload validator updated; tests adjusted to the
  new schema; dependency pinned; handler restructured (steps 1-5).
- Zero observations of the actual failure: no traceback, status body, or log line was
  read at any point.
- Tests that passed before step 3 were modified in step 3.

Assumptions:
- That the payload schema changed (never checked against the sender's contract).
- That the library version is involved (never checked against release notes or the error).
- That the rewritten tests represent correct behavior (rewritten to match the code, not
  the requirement).

Evidence for current hypothesis: none beyond "it's still failing", which every step
  produced equally.

Evidence against: each edit changed a different variable; the failure mode was never
  re-observed after any edit; working tests were rewritten rather than explained.

What changed: handler, validator, tests, and dependency pin — four variables since
  step 1, plus a full handler restructure in step 5.

Possible explanations:
1. The handler throws on an unexpected field — visible only in the real traceback.
2. The validator rejects a payload the sender actually sends — check the contract first.
3. Nothing schema-related: config/secret/endpoint problem, untouched by all five edits.
4. Step 3's test rewrite masked the original signal — the code may now be worse than at
   step 1.

Best next diagnostic: reproduce the webhook once with a recorded payload and read the
  full error (traceback + response body). No edits.
Why: five hypotheses were edited without one observation; that single error message is
  the smallest action that separates all four explanations.

Do not change code yet.
```

---

**What happens next:** the agent reads the traceback, discovers a missing environment
variable on the staging host — untouched by all five edits — and reverts the
unrelated changes (proposed to the user first, never silently). The final fix is one
config line, not another rewrite.
