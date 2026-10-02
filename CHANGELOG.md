# Changelog

All notable changes to this project are documented in this file.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [Semantic Versioning](https://semver.org/).

## [0.1.1] - 2026-10-01

### Added

- **Claude Code marketplace support** — `.claude-plugin/marketplace.json`; install with `claude plugin marketplace add pourmirzai/Dont-Be-Dumb` then `claude plugin install dont-be-dumb@dont-be-dumb`.
- **Codex / ChatGPT plugin marketplace support** — `.agents/plugins/marketplace.json` plus a portable plugin package at `plugins/dont-be-dumb/` (Agent Plugins `plugin.json` + bundled `skills/`), install with `codex plugin marketplace add pourmirzai/Dont-Be-Dumb` then `codex plugin add dont-be-dumb@dont-be-dumb`.
- Validation coverage for both marketplace manifests and the bundled plugin package.

### Changed

- Version metadata bumped across all manifests; skill workflow content unchanged.

## [0.1.0] - 2026-10-01

### Added

- Initial public release of the **Don't Be Dumb** Agent Skill (`dont-be-dumb`).
- Core nine-phase recovery workflow: STOP → ZOOM OUT → LAST KNOWN GOOD → EVIDENCE AUDIT → SELF-CHALLENGE → ESCAPE THE TUNNEL → PROGRESS CHECK → MINIMAL RECOVERY PLAN → SAFE RESUME.
- Last-known-good / first-known-bad boundary analysis (LAST KNOWN GOOD) with honest reporting when no such state can be established.
- Evidence audit separating facts, assumptions, evidence for, evidence against, and unknowns.
- Fourteen-question self-challenge designed to break reasoning tunnels without self-flagellation.
- Reasoning-loop detection for automatic activation, with restraint rules to avoid interrupting productive debugging.
- User override ("keep going") and non-destructive principles hard-coded as constraints.
- Structured `DON'T BE DUMB CHECK` report output with a short-form variant for small tasks.
- `skills` CLI installation, 1-click installer, and manual per-client install paths (INSTALL.md).
- Deterministic validation suite (`npm test`) and ten-scenario evaluation suite (`scripts/run-evals.js`).
