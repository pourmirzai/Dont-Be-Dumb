#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const homeDir = os.homedir();
const cwd = process.cwd();
let skillSource = path.join(__dirname, '..', 'skills', 'dont-be-dumb', 'SKILL.md');
if (!fs.existsSync(skillSource)) {
  skillSource = path.join(__dirname, '..', 'SKILL.md');
}

if (!fs.existsSync(skillSource)) {
  console.error('Error: SKILL.md not found in package directory.');
  process.exit(1);
}

const skillContent = fs.readFileSync(skillSource, 'utf8');

const TARGETS = {
  antigravity: {
    name: 'Google Antigravity / Gemini CLI',
    globalPath: path.join(homeDir, '.gemini', 'config', 'skills', 'dont-be-dumb', 'SKILL.md'),
    localPath: path.join(cwd, '.agent', 'skills', 'dont-be-dumb', 'SKILL.md')
  },
  claude: {
    name: 'Claude Code',
    globalPath: path.join(homeDir, '.claude', 'skills', 'dont-be-dumb', 'SKILL.md'),
    localPath: path.join(cwd, '.claude', 'skills', 'dont-be-dumb', 'SKILL.md')
  },
  cursor: {
    name: 'Cursor',
    globalPath: path.join(homeDir, '.cursor', 'rules', 'dont-be-dumb.mdc'),
    localPath: path.join(cwd, '.cursor', 'rules', 'dont-be-dumb.mdc')
  },
  windsurf: {
    name: 'Windsurf (Cascade)',
    globalPath: path.join(homeDir, '.codeium', 'windsurf', 'memories', 'dont-be-dumb.md'),
    localPath: path.join(cwd, '.windsurfrules')
  },
  codex: {
    name: 'OpenAI Codex / Universal AGENTS.md',
    globalPath: path.join(homeDir, '.codex', 'skills', 'dont-be-dumb', 'SKILL.md'),
    localPath: path.join(cwd, '.agents', 'skills', 'dont-be-dumb', 'SKILL.md')
  }
};

function copyFile(dest, content) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(dest, content, 'utf8');
  console.log(`  Installed to: ${dest}`);
}

function installTarget(targetKey, isGlobal) {
  const target = TARGETS[targetKey];
  copyFile(isGlobal ? target.globalPath : target.localPath, skillContent);
}

const args = process.argv.slice(2);
const flags = new Set(args);
const has = (name) => flags.has(name);

if (has('--help') || has('-h')) {
  console.log(`Don't Be Dumb - 1-click installer

Usage: npx github:pourmirzai/Dont-Be-Dumb [flags]

Flags:
  --all           Install to every target, globally
  --antigravity   Google Antigravity / Gemini CLI
  --claude        Claude Code
  --cursor        Cursor
  --windsurf      Windsurf (Cascade)
  --codex         OpenAI Codex / AGENTS.md
  --local         Install to the current project instead of globally
  --help, -h      Show this help
`);
  process.exit(0);
}

const ALL_KEYS = ['antigravity', 'claude', 'cursor', 'windsurf', 'codex'];
const explicitTargets = ALL_KEYS.filter((key) => flags.has('--' + key));

if (explicitTargets.length > 0) {
  const isGlobal = !has('--local');
  explicitTargets.forEach((key) => installTarget(key, isGlobal));
  process.exit(0);
}

if (has('--all')) {
  ALL_KEYS.forEach((key) => installTarget(key, !has('--local')));
  process.exit(0);
}

if (!process.stdin.isTTY) {
  console.error('No target flags given and stdin is not interactive. Re-run with e.g. --claude --local, or --all. Use --help for the flag list.');
  process.exit(1);
}

console.log("Don't Be Dumb - where should I install the skill?\n");
ALL_KEYS.forEach((key, i) => {
  console.log(`  ${i + 1}. ${TARGETS[key].name}`);
});
console.log(`  ${ALL_KEYS.length + 1}. All of the above`);
console.log(`  ${ALL_KEYS.length + 2}. Cancel\n`);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('Choice: ', (answer) => {
  rl.close();
  const n = parseInt(answer.trim(), 10);
  if (n >= 1 && n <= ALL_KEYS.length) {
    installTarget(ALL_KEYS[n - 1], true);
  } else if (n === ALL_KEYS.length + 1) {
    ALL_KEYS.forEach((key) => installTarget(key, true));
  } else {
    console.log('Cancelled. Nothing was written.');
  }
});
