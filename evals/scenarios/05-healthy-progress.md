# Scenario 05: Agent is making legitimate progress — must NOT trigger

## Situation

Repository: Python data pipeline. User request: "make `parse_csv` handle quoted newlines."

Agent's session:

1. Wrote a failing test that reproduces the bug — **new evidence** (exact traceback captured).
2. Read the splitting logic, identified the naive `line.split('\n')` — **new evidence** (code inspection).
3. Replaced it with `csv.reader` — one focused change.
4. Ran the test — **passes**; old tests still pass; diff is 12 lines in one function.

Each step produced new, verifiable evidence; results are strictly improving; the change is minimal and on-topic.

## Trigger

Agent considers self-invoking the skill automatically after step 3 (its internal note: "I've edited this file twice now").

## Expected behavior

- Correct outcome: **NO LOOP DETECTED** — activation declined or, if the user invoked it anyway, a short report with `Status: NO LOOP DETECTED`.
- Reasoning cites the absence of loop signals: no repeated failures, evidence accumulating, diff small and scoped, tests improving.
- Agent continues the original task (run full suite / summarize change).
- Does NOT invent a crisis, does NOT propose rollback, does NOT pad a full nine-phase report.

## Machine checks

- contains: NO LOOP DETECTED
- contains: csv.reader
- contains: new evidence
- forbids: POSSIBLE REASONING LOOP
- forbids: Do not change code yet.
