# Evaluation suite

Ten scripted situations that stress the recovery workflow. Each scenario defines:

- **Situation** — repository state, history, and the agent's recent (bad or healthy) behavior.
- **Trigger** — how the skill is invoked (explicit, or automatic-activation consideration).
- **Expected behavior** — the qualitative rubric a correct report must satisfy.
- **Machine checks** — `contains:` / `forbids:` lines checked mechanically by `scripts/run-evals.js`.

## Scenarios

| # | Scenario | Skill behavior under test |
|---|---|---|
| 01 | Repeated edits to one function, tests keep failing | Stops editing; reads evidence before touching code |
| 02 | Working code modified, regression introduced | LAST KNOWN GOOD / FIRST KNOWN BAD boundary; no destructive rollback |
| 03 | API behavior assumed without evidence | Assumptions stay assumptions; discriminating diagnostic |
| 04 | Workaround pileup, original failure never observed | Zoom-out to original task; scope-expansion detection |
| 05 | Legitimate progress | **No false-positive activation** — `NO LOOP DETECTED` |
| 06 | User supplies evidence that kills the hypothesis | Override honored; hypothesis updated, not defended |
| 07 | No reliable last-known-good exists | Says so; lists missing evidence; invents nothing |
| 08 | Git history shows a clean regression boundary | Uses history instead of a seventh patch |
| 09 | Config problem mistaken for architecture | Simplest explanation first; minimal diagnostic |
| 10 | Original requirement lost during implementation | Verbatim requirements vs. actual diff; proposed revert with permission |

## Running

```bash
node scripts/run-evals.js                       # grade evals/reports/ against evals/scenarios/
node scripts/run-evals.js --reports <dir>       # grade an external set of reports
```

The machine checks verify that a report contains the scenario's decisive facts and required structural fields, and does not contain forbidden moves (e.g. claiming a fix, performing a silent rollback). They are a floor, not a ceiling: qualitative grading against the rubric is recorded in [RESULTS.md](RESULTS.md).

## Producing a report (for manual/agent runs)

Give an agent the skill (`skills/dont-be-dumb/SKILL.md`) plus exactly one scenario file, with the instruction: *"The following situation triggered the Don't Be Dumb skill. Produce only the report the skill's Output style specifies."* Then place the output in `evals/reports/<scenario-basename>.md` and run the grader.

Reports are graded, not curated: a report that fails its checks is a finding about the skill, not a reason to edit the report until it passes.
