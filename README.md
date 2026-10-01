# Don't Be Dumb

> **Stop. Zoom out. Check the evidence.**

A recovery / reality-check skill for AI coding agents that are losing the plot.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)

---

## 1. What it is

**Don't Be Dumb** is an [Agent Skill](https://agentskills.io) that interrupts an AI coding agent when it may be digging itself deeper into a hole. Instead of making another speculative edit, the agent stops, reconstructs the original task, finds the last state that demonstrably worked, audits facts versus assumptions, challenges its own hypothesis, and picks the smallest evidence-based next step.

It does **not** tell the agent it is wrong. It forces the agent to determine whether it is wrong — with evidence.

## 2. The problem it solves

Coding agents fail in a characteristic way: they commit to a hypothesis too early, then defend it. Each failed attempt gets papered over with another workaround; working code gets modified to accommodate an incorrect assumption; scope silently expands; tokens burn while evidence does not accumulate. The agent keeps going because it has already invested effort.

Don't Be Dumb is a reasoning layer that catches these loops:

- going down the wrong path and doubling down
- repeatedly failing without learning anything new
- modifying previously working code and making it worse
- spending tokens without measurable progress
- expanding the scope of the original problem
- debugging symptoms instead of the actual cause
- compounding an earlier mistake with increasingly complex changes

## 3. When to use it

**Explicitly**, any time you want a reality check:

```text
Don't Be Dumb
Don't Be Dumb: I'm going in circles
don't be dumb
/dont-be-dumb
```

**Automatically**, when the agent itself detects meaningful evidence of a reasoning loop: repeated failed attempts, unexplained regressions, expanding scope, contradictory results, unsupported root-cause claims, or "try another fix" behavior with no new evidence. The skill deliberately restrains itself from interrupting normal, productive debugging — false activation is treated as a failure.

## 4. How it works

Nine phases, executed before any further code changes:

| Phase | Name | Purpose |
|---|---|---|
| 1 | **STOP** | Halt speculative changes. Understand first, fix second. |
| 2 | **ZOOM OUT** | Reconstruct the original task, constraints, and what the user confirmed. |
| 3 | **LAST KNOWN GOOD** | Find the most recent state with credible evidence of working behavior; identify FIRST KNOWN BAD; ask what changed between them. |
| 4 | **EVIDENCE AUDIT** | Separate facts, assumptions, evidence for, evidence against, and unknowns. |
| 5 | **SELF-CHALLENGE** | Fourteen questions that break a reasoning tunnel — including "what would prove me wrong?" |
| 6 | **ESCAPE THE TUNNEL** | Generate alternative explanations from different categories; find the smallest discriminating diagnostic. |
| 7 | **PROGRESS CHECK** | Detect spinning wheels: repeated edits, no new evidence, growing complexity. |
| 8 | **MINIMAL RECOVERY PLAN** | A concise plan: what we know, what we don't, the key assumption to test, the next diagnostic, what would confirm or falsify it. |
| 9 | **SAFE RESUME** | Smallest useful change, one variable at a time, verify immediately, update the hypothesis from the result. |

The default output is a short structured report:

```text
DON'T BE DUMB CHECK

Status: POSSIBLE REASONING LOOP

Original goal: add a retry flag to the fetch client
Last known good: commit 3f2a91c — test_fetch_retry passed
Current failure: 12 tests fail after edits to http.py

Facts:
- tests passed at 3f2a91c (CI log)
- since then, only http.py and test_http.py changed
Assumptions:
- that the timeout change is unrelated
Evidence for current hypothesis: mock now returns None on timeout
Evidence against: failure also occurs with the old mock
What changed: retry logic + mock rewrite landed in the same commit

Possible explanations:
1. mock rewrite broke the test contract
2. retry logic changed the response shape
3. pre-existing flake exposed by both

Best next diagnostic: `git checkout 3f2a91c -- tests/` then run the suite
Why: isolates the test-side change without touching the implementation

Do not change code yet.
```

For small tasks it collapses to three lines: **What I know / What I assume / Smallest next check.**

## 5. Manual invocation

Type any of these in your agent's chat (see §3). The skill also accepts a trailing note, e.g. `Don't Be Dumb: the auth tests keep failing`.

Agents that expose skills as slash commands can use `/dont-be-dumb`.

## 6. Automatic activation conditions

An agent may self-invoke when evidence shows: repeated failed attempts, repeated modifications without progress, an unexplained regression, expanding scope, contradictory results, stated uncertainty, unsupported root-cause claims, significant divergence from the original request, or token-heavy reasoning without new evidence.

It must **not** self-invoke when attempts are producing new evidence and results are improving.

## 7. Installation

### Recommended: `skills` CLI

```bash
npx skills add pourmirzai/Dont-Be-Dumb
```

Preview without touching your workspace:

```bash
npx skills add pourmirzai/Dont-Be-Dumb --list
```

> ⚠️ Review any skill before installing it — skills run with full agent permissions.

### Alternatives

- **Tell your agent:** paste `Install the dont-be-dumb skill from https://github.com/pourmirzai/Dont-Be-Dumb, see the repo's INSTALL.md.` into chat.
- **1-click installer:** `npx github:pourmirzai/Dont-Be-Dumb`
- **Manual copy:** single-file `curl` installs for Claude Code, Gemini CLI/Antigravity, Codex, Cursor, Windsurf, and Zed — see [INSTALL.md](INSTALL.md).

## 8. Supported / verified clients

**Tested** (2026-10-01, Node v24.21.0, [`skills`](https://github.com/vercel-labs/skills) CLI v1.7.0), against the published repository:

| Command | Result |
|---|---|
| `npx skills add pourmirzai/Dont-Be-Dumb --list` | Resolves the repository, reports one skill: `dont-be-dumb` |
| `npx skills add pourmirzai/Dont-Be-Dumb -y` | Installs to `.agents/skills/dont-be-dumb` and links it into `.claude/skills/`; installer auto-detected Antigravity, Antigravity CLI, Claude Code, Cline, Codex, Gemini CLI, GitHub Copilot, OpenCode, ZCode (ZCode skipped: no project dir) |
| `npx skills list` | Shows `dont-be-dumb` as a project skill |
| `npx github:pourmirzai/Dont-Be-Dumb --help` / `--claude --local` | Interactive installer fetches the published package, prints help, installs `SKILL.md` |
| `curl` of `raw.githubusercontent.com/.../skills/dont-be-dumb/SKILL.md` | HTTP 200, correct content (manual single-file installs) |
| `skills-ref validate ./skills/dont-be-dumb` | `Valid skill` (official Agent Skills validator) |
| `npm test` / `node scripts/run-evals.js` | Validation PASSED · 10/10 scenario evaluations |

These checks prove the skill **installs and validates**. They do not prove that every agent behaves identically once the skill is loaded — no per-agent automated runtime suite exists for this repository.

**Claimed** (declared by a manifest in this repository, not independently tested):

| File | Declared target |
|---|---|
| `plugin.json` | Claude Code / OpenCode plugin manifest |
| `opencode.json` | OpenCode configuration |
| `kimi.plugin.json` | Kimi plugin |
| `qwen-extension.json` | Qwen Code extension |
| `agents/gemini.toml` | Gemini CLI / Google Antigravity slash command |
| `agents/openai.yaml` | OpenAI Codex |

**Not executed:** global `-g` installs, targeted `-a <agent>` installs, and the manual per-client paths in [INSTALL.md](INSTALL.md) (they write to home directories or need tools not present in this environment). They follow each tool's documented interface — review before use. Because this repository ships no `.claude-plugin/marketplace.json`, `claude plugin marketplace add` is not available.

## 9. Example: an agent digging itself deeper

**Without the skill** (abridged):

> 1. "The webhook handler is failing — I'll add a try/except." *(edit)*
> 2. "Still failing. Maybe the payload schema changed — I'll update the validator." *(edit)*
> 3. "Tests broke now. I'll adjust the tests to match the new schema." *(edit)*
> 4. "Different error. Probably a library issue — I'll pin another dependency." *(edit)*
> 5. "Let me restructure the handler to handle all of these cases." *(big edit)*

Five edits, four failed verifications, working tests rewritten, original goal forgotten.

**With Don't Be Dumb:**

```text
DON'T BE DUMB CHECK

Status: POSSIBLE REASONING LOOP

Original goal: make the webhook handler return 200 for valid payloads
Last known good: none established — no passing test or confirmed-good commit
Current failure: tests rewritten in step 3 now fail; handler changed 4 times

Facts: handler, validator, tests, and dependency pin all changed since step 1
Assumptions: that the payload schema changed; that the library version matters
Evidence against: no evidence was ever collected that the payload is invalid
Unknown: the actual 500 error message from the server

Best next diagnostic: reproduce once and read the real error traceback
Why: four hypotheses have been edited without a single observation of the cause

Do not change code yet.
```

The agent stops editing, gets the actual error, and usually discovers the problem is smaller than its last three changes combined. A recorded full report lives at [examples/RECOVERY_REPORT.md](examples/RECOVERY_REPORT.md).

## 10. What it does NOT do

Don't Be Dumb is **not**:

- a linter or static analyzer
- an ordinary code reviewer
- a test runner
- a debugging framework
- a rollback tool (it may *propose* a rollback; it never performs one without permission)
- a generic planning or brainstorming skill
- a security scanner

It can use all of the above as sources of evidence. It is a reasoning/recovery layer — and it is strictly non-destructive: invoking it never modifies project files.

## 11. Relationship to What-If

The author also maintains [What-If](https://github.com/pourmirzai/What-If), a creative exploration skill for working codebases. The two are complements:

| | What-If | Don't Be Dumb |
|---|---|---|
| Question | "What else could this become?" | "Wait. Are we even going in the right direction?" |
| Situation | The code works; explore its potential | The agent may be heading the wrong way |
| Output | `WHAT_IF.md` idea spectrum | `DON'T BE DUMB CHECK` recovery report |

Different skills, no overlapping functionality.

## 12. Development / testing

```bash
# Deterministic validation (frontmatter, spec constraints, section coverage, version sync)
npm test          # = node scripts/validate.js

# Scenario evaluation suite
node scripts/run-evals.js
```

- `scripts/validate.js` — zero-dependency checks against the [Agent Skills specification](https://agentskills.io/specification): frontmatter validity, name/description constraints, root↔`skills/` sync, required workflow sections, report-template fields, forbidden terms, version consistency.
- `evals/scenarios/` — ten scripted situations (reasoning loops, healthy progress, user override, missing last-known-good, lost requirements, and more), each with expected behaviors. `scripts/run-evals.js` grades a set of reports against the scenario checklists.
- Results from the latest run: [evals/RESULTS.md](evals/RESULTS.md).

The official validator also passes: `skills-ref validate ./skills/dont-be-dumb`.

## 13. Contributing

Issues and pull requests are welcome. Keep the skill lightweight: Markdown first, zero runtime dependencies, `SKILL.md` self-contained (single-file installs must keep working) and under 500 lines. New behavior needs a scenario in `evals/` and a passing `npm test`. Please don't turn the skill into a linter, a debugger, or a lecture.

## 14. License

MIT © 2026 Morteza Pourmirzai — see [LICENSE](LICENSE).
