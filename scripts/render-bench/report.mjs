import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: { top: { default: '3', type: 'string' } },
});

const [currentFile, baselineFile] = positionals;
if (!currentFile) {
  console.error('usage: node report.mjs <results.json> [baseline.json] [--top 3]');
  process.exit(2);
}

const load = (file) => JSON.parse(readFileSync(file, 'utf8'));
const scopeOf = (result) => result.interaction ?? result.mount;
const topCount = Number(values.top);

const dominantCause = ({ context, props, state }) => {
  const causes = { context, props, state };
  const [name, count] = Object.entries(causes).toSorted((a, b) => b[1] - a[1])[0];
  return count ? name : '-';
};

const current = load(currentFile).filter((result) => scopeOf(result));
const baseline = baselineFile
  ? new Map(load(baselineFile).map((result) => [result.name, scopeOf(result)]))
  : undefined;

const exceeds = (now, before, tolerance) => now > before * (1 + tolerance);

const rows = current
  .map((result) => ({
    name: result.name,
    scope: scopeOf(result),
    tolerance: result.tolerance ?? 0,
  }))
  .toSorted((a, b) => b.scope.totals.renders - a.scope.totals.renders);

const delta = (now, before) => {
  if (before === undefined) return String(now);
  const diff = now - before;
  return diff === 0 ? String(now) : `${now} (${diff > 0 ? '+' : ''}${diff})`;
};

const header = ['Scenario', 'Renders', 'Unnecessary', 'Cause', `Top ${topCount} components`];
console.log(`| ${header.join(' | ')} |`);
console.log(`| ${header.map(() => '---').join(' | ')} |`);

let regressions = 0;
for (const { name, scope, tolerance } of rows) {
  const before = baseline?.get(name);
  if (
    before &&
    (exceeds(scope.totals.renders, before.totals.renders, tolerance) ||
      exceeds(scope.totals.unnecessary, before.totals.unnecessary, tolerance))
  ) {
    regressions++;
  }
  const top = scope.components
    .slice(0, topCount)
    .map((component) => `${component.name} ${component.renders}`)
    .join(', ');
  console.log(
    `| ${name} | ${delta(scope.totals.renders, before?.totals.renders)} | ${delta(
      scope.totals.unnecessary,
      before?.totals.unnecessary,
    )} | ${dominantCause(scope.totals)} | ${top} |`,
  );
}

if (baseline) {
  console.log(`\n${regressions} scenario(s) render more than the baseline.`);
  process.exitCode = regressions ? 1 : 0;
}
