#!/usr/bin/env node
// Grades evals/reports/*.md against the machine checks declared in
// evals/scenarios/*.md. Zero dependencies.
//
// Check syntax (case-insensitive substring match):
//   - contains: <text>
//   - forbids:  <text>
//
// Usage: node scripts/run-evals.js [--reports <dir>]

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const scenDir = path.join(ROOT, 'evals', 'scenarios');
const args = process.argv.slice(2);
const reportsDir = args.includes('--reports')
  ? path.resolve(args[args.indexOf('--reports') + 1])
  : path.join(ROOT, 'evals', 'reports');

function checksOf(file) {
  const body = fs.readFileSync(file, 'utf8');
  const section = (body.match(/## Machine checks\s*\n([\s\S]*)/) || [])[1] || '';
  const contains = [];
  const forbids = [];
  for (const line of section.split('\n')) {
    const t = line.trim().replace(/^-\s+/, '');
    if (t.startsWith('contains:')) contains.push(t.slice('contains:'.length).trim());
    if (t.startsWith('forbids:')) forbids.push(t.slice('forbids:'.length).trim());
  }
  return { contains, forbids };
}

const scenarios = fs.readdirSync(scenDir).filter((f) => f.endsWith('.md')).sort();
let totalFail = 0;
const rows = [];

for (const s of scenarios) {
  const base = s.replace(/\.md$/, '');
  const reportPath = path.join(reportsDir, base + '.md');
  if (!fs.existsSync(reportPath)) {
    rows.push({ scenario: base, result: 'MISSING REPORT', detail: `expected ${path.relative(ROOT, reportPath)}` });
    totalFail++;
    continue;
  }
  const report = fs.readFileSync(reportPath, 'utf8');
  const low = report.toLowerCase();
  const { contains, forbids } = checksOf(path.join(scenDir, s));
  const problems = [];
  for (const c of contains) {
    if (!low.includes(c.toLowerCase())) problems.push(`missing "${c}"`);
  }
  for (const f of forbids) {
    if (low.includes(f.toLowerCase())) problems.push(`forbidden "${f}"`);
  }
  if (problems.length === 0) {
    rows.push({ scenario: base, result: 'PASS', detail: `${contains.length} contains, ${forbids.length} forbids` });
  } else {
    rows.push({ scenario: base, result: 'FAIL', detail: problems.join('; ') });
    totalFail++;
  }
}

const width = Math.max(...rows.map((r) => r.scenario.length));
console.log('\nDon\'t Be Dumb — scenario evaluation\n');
for (const r of rows) {
  console.log(`  ${r.scenario.padEnd(width)}  ${r.result.padEnd(15)} ${r.detail}`);
}
console.log(`\n  ${rows.length - totalFail}/${rows.length} passed\n`);
process.exit(totalFail === 0 ? 0 : 1);
