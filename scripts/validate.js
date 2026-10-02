#!/usr/bin/env node
// Zero-dependency validation for the Don't Be Dumb Agent Skill.
// Checks: Agent Skills spec constraints, root/skills sync, workflow coverage,
// report template fields, forbidden terms, version consistency, manifest sanity.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const errors = [];
const warnings = [];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function fail(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

// --- 1. Frontmatter -------------------------------------------------------

const SKILL_PATH = 'skills/dont-be-dumb/SKILL.md';
const rootSkill = read('SKILL.md');
const dirSkill = read(SKILL_PATH);

for (const [label, content] of [['SKILL.md (root)', rootSkill], [SKILL_PATH, dirSkill]]) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) {
    fail(`${label}: missing YAML frontmatter block`);
    continue;
  }
  const fm = m[1];
  const nameMatch = fm.match(/^name:\s*(.+)$/m);
  const descMatch = fm.match(/^description:\s*(.+)$/m);
  if (!nameMatch) fail(`${label}: frontmatter missing required "name"`);
  if (!descMatch) fail(`${label}: frontmatter missing required "description"`);

  if (nameMatch) {
    const name = nameMatch[1].trim();
    if (name.length > 64) fail(`${label}: name longer than 64 chars`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) fail(`${label}: name "${name}" violates lowercase/kebab-case rules`);
    if (label.startsWith(SKILL_PATH) && name !== 'dont-be-dumb') fail(`${label}: name must match parent directory "dont-be-dumb"`);
  }
  if (descMatch) {
    const desc = descMatch[1].trim();
    if (desc.length === 0 || desc.length > 1024) fail(`${label}: description length ${desc.length} (must be 1-1024)`);
    for (const kw of ['circles', 'last known-good', 'facts versus assumptions', "Don't Be Dumb"]) {
      if (!desc.includes(kw)) fail(`${label}: description missing activation keyword "${kw}"`);
    }
  }
  if (/^license:\s*MIT\s*$/m.test(fm) === false) warn(`${label}: license field not "MIT"`);
}

// --- 2. Root/skills sync --------------------------------------------------

const bundledSkillPath = 'plugins/dont-be-dumb/skills/dont-be-dumb/SKILL.md';
if (rootSkill !== dirSkill) fail('root SKILL.md and skills/dont-be-dumb/SKILL.md are not identical');
if (!fs.existsSync(path.join(ROOT, bundledSkillPath))) {
  fail(`${bundledSkillPath} missing (bundled plugin package)`);
} else if (read(bundledSkillPath) !== rootSkill) {
  fail(`${bundledSkillPath} is not identical to root SKILL.md`);
}

// --- 3. Workflow coverage -------------------------------------------------

const REQUIRED = [
  '# Don\'t Be Dumb',
  '## Invocation',
  '## Hard constraints',
  '## Phase 1 — STOP',
  '## Phase 2 — ZOOM OUT',
  '## Phase 3 — LAST KNOWN GOOD',
  '## Phase 4 — EVIDENCE AUDIT',
  '## Phase 5 — SELF-CHALLENGE',
  '## Phase 6 — ESCAPE THE TUNNEL',
  '## Phase 7 — PROGRESS CHECK',
  '## Phase 8 — MINIMAL RECOVERY PLAN',
  '## Phase 9 — SAFE RESUME',
  '## Automatic activation',
  '## User override',
  '## Output style',
  '## What this skill is not',
  'FIRST KNOWN BAD',
  'Evidence AGAINST',
  'Do not change code yet.',
  'NO LOOP DETECTED'
];
for (const s of REQUIRED) {
  if (!dirSkill.includes(s)) fail(`SKILL.md missing required content: "${s}"`);
}

// Report template must carry the Phase 8 fields.
const TEMPLATE_FIELDS = [
  'What we know', "What we don't know", 'Most important assumption to test',
  'Last known-good state', 'What changed afterward', 'Next diagnostic action',
  'confirm the hypothesis', 'falsify it'
];
for (const f of TEMPLATE_FIELDS) {
  if (!dirSkill.includes(f)) fail(`recovery plan missing field: "${f}"`);
}

// Safety / security obligations.
for (const s of ['untrusted', 'secrets', 'git reset', 'authorization', 'override']) {
  if (!dirSkill.toLowerCase().includes(s.toLowerCase())) fail(`SKILL.md missing safety content: "${s}"`);
}

// --- 4. Forbidden terms ---------------------------------------------------

const FORBIDDEN = [new RegExp(['W', 'T', 'F'].join(''), 'i'), new RegExp(['Un', 'fuck'].join(''), 'i')];
const SELF = path.join(__dirname, 'validate.js');
const allFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (p !== SELF) allFiles.push(p);
  }
})(ROOT);
for (const f of allFiles) {
  const body = fs.readFileSync(f, 'utf8');
  for (const re of FORBIDDEN) {
    if (re.test(body)) fail(`forbidden term ${re} found in ${path.relative(ROOT, f)}`);
  }
}

// --- 5. Size limits -------------------------------------------------------

const lines = dirSkill.split('\n').length;
if (lines > 500) fail(`skills/dont-be-dumb/SKILL.md has ${lines} lines (spec recommends <500)`);

// --- 6. Version consistency -----------------------------------------------

const pkg = JSON.parse(read('package.json'));
const changelog = read('CHANGELOG.md');
const fmVersion = (dirSkill.match(/^  version:\s*"(.+)"$/m) || [])[1];
if (fmVersion !== pkg.version) fail(`frontmatter version ${fmVersion} != package.json version ${pkg.version}`);
if (!changelog.includes(`## [${pkg.version}]`)) fail(`CHANGELOG.md missing section for ${pkg.version}`);
for (const mf of ['plugin.json', 'kimi.plugin.json', 'qwen-extension.json']) {
  const j = JSON.parse(read(mf));
  if (j.version !== pkg.version) fail(`${mf} version ${j.version} != ${pkg.version}`);
  if (!Array.isArray(j.skills) || !j.skills.includes('skills/dont-be-dumb')) fail(`${mf} must list skills/dont-be-dumb`);
}
JSON.parse(read('opencode.json'));
JSON.parse(read('qwen-extension.json'));

// --- 6b. Marketplace manifests & bundled plugin package -------------------

const PLUGIN_DIR = 'plugins/dont-be-dumb';

let claudeMarket;
try {
  claudeMarket = JSON.parse(read('.claude-plugin/marketplace.json'));
} catch (e) {
  fail(`.claude-plugin/marketplace.json is not valid JSON: ${e.message}`);
}
if (claudeMarket) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(claudeMarket.name || '')) fail('Claude marketplace: invalid "name"');
  if (!claudeMarket.owner || !claudeMarket.owner.name) fail('Claude marketplace: owner.name is required');
  if (claudeMarket.version !== pkg.version) fail(`Claude marketplace version ${claudeMarket.version} != ${pkg.version}`);
  const entry = (claudeMarket.plugins || []).find((p) => p.name === 'dont-be-dumb');
  if (!entry) fail('Claude marketplace: missing plugin entry "dont-be-dumb"');
  if (entry) {
    if (entry.source !== `./${PLUGIN_DIR}`) fail(`Claude marketplace: source must be "./${PLUGIN_DIR}"`);
    if (entry.version !== pkg.version) fail(`Claude marketplace plugin entry version ${entry.version} != ${pkg.version}`);
  }
}

let codexMarket;
try {
  codexMarket = JSON.parse(read('.agents/plugins/marketplace.json'));
} catch (e) {
  fail(`.agents/plugins/marketplace.json is not valid JSON: ${e.message}`);
}
if (codexMarket) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(codexMarket.name || '')) fail('Codex marketplace: invalid "name"');
  const entry = (codexMarket.plugins || []).find((p) => p.name === 'dont-be-dumb');
  if (!entry) fail('Codex marketplace: missing plugin entry "dont-be-dumb"');
  if (entry) {
    if (!entry.source || entry.source.source !== 'local' || entry.source.path !== `./${PLUGIN_DIR}`) {
      fail(`Codex marketplace: source must be {source:"local", path:"./${PLUGIN_DIR}"}`);
    }
    if (!entry.policy || entry.policy.installation !== 'AVAILABLE') fail('Codex marketplace: policy.installation must be "AVAILABLE"');
  }
}

let portableManifest;
try {
  portableManifest = JSON.parse(read(`${PLUGIN_DIR}/plugin.json`));
} catch (e) {
  fail(`${PLUGIN_DIR}/plugin.json is not valid JSON: ${e.message}`);
}
if (portableManifest) {
  if (portableManifest.name !== 'dont-be-dumb') fail(`${PLUGIN_DIR}/plugin.json: name must be "dont-be-dumb"`);
  if (portableManifest.version !== pkg.version) fail(`${PLUGIN_DIR}/plugin.json version ${portableManifest.version} != ${pkg.version}`);
  if (!portableManifest.description) fail(`${PLUGIN_DIR}/plugin.json: description required`);
}
if (!fs.existsSync(path.join(ROOT, PLUGIN_DIR, 'skills', 'dont-be-dumb', 'SKILL.md'))) {
  fail(`${PLUGIN_DIR}/skills/dont-be-dumb/SKILL.md missing (Codex/Claude discover skills from plugin-root skills/)`);
}

// --- 7. Eval suite sanity -------------------------------------------------

const scenDir = path.join(ROOT, 'evals', 'scenarios');
if (!fs.existsSync(scenDir)) {
  fail('evals/scenarios/ missing');
} else {
  const scenes = fs.readdirSync(scenDir).filter((f) => f.endsWith('.md'));
  if (scenes.length < 10) fail(`expected at least 10 eval scenarios, found ${scenes.length}`);
  for (const s of scenes) {
    const body = fs.readFileSync(path.join(scenDir, s), 'utf8');
    if (!body.includes('## Expected behavior')) fail(`evals/scenarios/${s}: missing "## Expected behavior"`);
    if (!body.includes('## Machine checks')) fail(`evals/scenarios/${s}: missing "## Machine checks"`);
  }
}

// --- 8. Installer sanity --------------------------------------------------

const cli = read('bin/cli.js');
if (!cli.includes('dont-be-dumb')) fail('bin/cli.js does not reference dont-be-dumb paths');
try {
  new Function(cli.replace(/^#!.*\n/, '')); // syntax check without executing
} catch (e) {
  fail(`bin/cli.js has a syntax error: ${e.message}`);
}

// --- Report ---------------------------------------------------------------

const pass = errors.length === 0;
console.log(`\nDon't Be Dumb — validation ${pass ? 'PASSED' : 'FAILED'}`);
console.log(`  skill lines: ${lines} | version: ${pkg.version} | scenarios checked: OK`);
for (const e of errors) console.log(`  ERROR: ${e}`);
for (const w of warnings) console.log(`  warn:  ${w}`);
console.log('');
process.exit(pass ? 0 : 1);
