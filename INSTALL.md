# Installation Guide for Don't Be Dumb

Choose your coding assistant or agent harness below.

> **Verification status** — see the table at the top of this file after publish; commands marked ✅ were executed against the public repository, ⬜ were not. Skills run with full agent permissions: review any skill before installing.

---

<details open>
<summary><strong>Universal Agent Skills installer (Claude Code, OpenCode, Codex, Gemini CLI, Cursor, Copilot, Cline, ...)</strong></summary>

Works with any harness supporting the [Agent Skills specification](https://agentskills.io/specification).

### Install

```bash
# Current workspace:
npx skills add pourmirzai/Dont-Be-Dumb

# Preview only (no files written):
npx skills add pourmirzai/Dont-Be-Dumb --list

# Globally for all projects:
npx skills add pourmirzai/Dont-Be-Dumb -g

# Target a specific harness:
npx skills add pourmirzai/Dont-Be-Dumb -a claude-code -y
npx skills add pourmirzai/Dont-Be-Dumb -a opencode -y
```

### Verify

```bash
npx skills list
```

### Update / Uninstall

```bash
npx skills update dont-be-dumb
npx skills remove dont-be-dumb
```

</details>

---

<details>
<summary><strong>1-Click Installer (any harness)</strong></summary>

Interactive menu that writes `SKILL.md` to the target you choose (Google Antigravity / Gemini CLI, Claude Code, Cursor, Windsurf, Codex, or the current project).

```bash
npx github:pourmirzai/Dont-Be-Dumb
```

Non-interactive equivalents:

```bash
npx github:pourmirzai/Dont-Be-Dumb --all           # every target, globally
npx github:pourmirzai/Dont-Be-Dumb --claude --local # one target, current project
```

Supported flags: `--all`, `--antigravity`, `--claude`, `--cursor`, `--windsurf`, `--codex`, `--local` (omit `--local` for a global install).

### Uninstall

Delete the `SKILL.md` path the installer reported, e.g. `rm -rf ~/.claude/skills/dont-be-dumb`.

</details>

---

<details>
<summary><strong>Claude Code</strong></summary>

```bash
# Via the universal installer:
npx skills add pourmirzai/Dont-Be-Dumb -a claude-code -y

# Or copy the single file directly:
mkdir -p ~/.claude/skills/dont-be-dumb
curl -sL https://raw.githubusercontent.com/pourmirzai/Dont-Be-Dumb/main/skills/dont-be-dumb/SKILL.md -o ~/.claude/skills/dont-be-dumb/SKILL.md
```

> ⚠️ `claude plugin marketplace add pourmirzai/Dont-Be-Dumb` is **not** available — this repository has no `.claude-plugin/marketplace.json`. Use one of the two methods above.

**Verify:** start a new session and type `/dont-be-dumb` or `Don't Be Dumb`.

**Uninstall:** `npx skills remove dont-be-dumb`, or `rm -rf ~/.claude/skills/dont-be-dumb`.

</details>

---

<details>
<summary><strong>Google Antigravity & Gemini CLI</strong></summary>

**Global:**

```bash
mkdir -p ~/.gemini/config/skills/dont-be-dumb
curl -sL https://raw.githubusercontent.com/pourmirzai/Dont-Be-Dumb/main/skills/dont-be-dumb/SKILL.md -o ~/.gemini/config/skills/dont-be-dumb/SKILL.md
```

**Project scope:**

```bash
mkdir -p .agent/skills/dont-be-dumb
curl -sL https://raw.githubusercontent.com/pourmirzai/Dont-Be-Dumb/main/skills/dont-be-dumb/SKILL.md -o .agent/skills/dont-be-dumb/SKILL.md
```

**As a slash command** (optional): copy `agents/gemini.toml` to `~/.gemini/commands/dont-be-dumb.toml`, then type `/dont-be-dumb`.

**Verify:** type `Don't Be Dumb` in chat; the agent should produce a `DON'T BE DUMB CHECK` report without editing files.

</details>

---

<details>
<summary><strong>OpenAI Codex / AGENTS.md</strong></summary>

```bash
mkdir -p .agents/skills/dont-be-dumb
curl -sL https://raw.githubusercontent.com/pourmirzai/Dont-Be-Dumb/main/skills/dont-be-dumb/SKILL.md -o .agents/skills/dont-be-dumb/SKILL.md
```

**Verify:** trigger with `$dont-be-dumb` or `Don't Be Dumb` in Codex chat.

</details>

---

<details>
<summary><strong>Cursor</strong></summary>

```bash
mkdir -p .cursor/rules
curl -sL https://raw.githubusercontent.com/pourmirzai/Dont-Be-Dumb/main/skills/dont-be-dumb/SKILL.md -o .cursor/rules/dont-be-dumb.mdc
```

**Verify:** ask Cursor: `Don't Be Dumb`.

</details>

---

<details>
<summary><strong>Windsurf (Cascade)</strong></summary>

Append the skill to `.windsurfrules` at your workspace root (or Windsurf's global memories):

```bash
curl -sL https://raw.githubusercontent.com/pourmirzai/Dont-Be-Dumb/main/skills/dont-be-dumb/SKILL.md >> .windsurfrules
```

**Verify:** ask Cascade: `Don't Be Dumb`.

</details>

---

<details>
<summary><strong>OpenCode</strong></summary>

```bash
npx skills add pourmirzai/Dont-Be-Dumb -a opencode -y
```

or copy the file into the project's `.opencode/skills/dont-be-dumb/SKILL.md`.

**Verify:** type `Don't Be Dumb` in an OpenCode session.

</details>

---

<details>
<summary><strong>Zed</strong></summary>

In the Agent Panel, open the Skills manager → **Create skill from URL**:

```text
https://github.com/pourmirzai/Dont-Be-Dumb/blob/main/skills/dont-be-dumb/SKILL.md
```

or:

```bash
mkdir -p ~/.agents/skills/dont-be-dumb
curl -sL https://raw.githubusercontent.com/pourmirzai/Dont-Be-Dumb/main/skills/dont-be-dumb/SKILL.md -o ~/.agents/skills/dont-be-dumb/SKILL.md
```

</details>
