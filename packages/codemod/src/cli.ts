import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

import { formatJson, formatMarkdown, formatText, type ReportArtifacts } from './format';
import { runCodemod } from './run';

const USAGE = `Usage: lobe-ui-codemod v6 [paths...] [--dry] [--report <file>] [--json]

  paths      files or directories to migrate (default: src)
  --dry      preview source changes and save a patch (reports are still written)
  --report   custom Markdown path; JSON and patch use the same basename
  --json     print only JSON to stdout (reports are still written)

Reports default to a new .lobe-ui-codemod/v6-*/ directory on each run.
Existing report files are never overwritten.`;

interface Io {
  cwd: string;
  log: (line: string) => void;
}

export const main = async (argv: string[], io: Io) => {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    args: argv,
    options: {
      dry: { type: 'boolean' },
      help: { short: 'h', type: 'boolean' },
      json: { type: 'boolean' },
      report: { type: 'string' },
    },
  });
  const [set, ...paths] = positionals;

  if (!set || values.help) {
    io.log(USAGE);
    return values.help ? 0 : 1;
  }
  if (set !== 'v6') {
    io.log(`Unknown transform set "${set}".\n\n${USAGE}`);
    return 1;
  }

  const dry = Boolean(values.dry);
  const scanPaths = paths.length > 0 ? paths : ['src'];
  let markdown: string;
  if (values.report) markdown = path.resolve(io.cwd, values.report);
  else {
    const root = path.join(io.cwd, '.lobe-ui-codemod');
    mkdirSync(root, { recursive: true });
    markdown = path.join(mkdtempSync(path.join(root, 'v6-')), 'report.md');
  }
  const base = markdown.replace(/\.md$/i, '');
  const artifacts: ReportArtifacts = { markdown, json: `${base}.json` };
  if (dry) artifacts.patch = `${base}.patch`;
  for (const file of Object.values(artifacts)) {
    if (existsSync(file))
      throw new Error(`Report file already exists: ${file}. Choose a new --report path.`);
  }
  mkdirSync(path.dirname(markdown), { recursive: true });
  const result = await runCodemod({ cwd: io.cwd, dry, paths: scanPaths });
  const context = { cwd: io.cwd, dry, paths: scanPaths, artifacts };
  const json = formatJson(result, context);

  writeFileSync(artifacts.markdown, formatMarkdown(result, context), { flag: 'wx' });
  writeFileSync(artifacts.json, `${json}\n`, { flag: 'wx' });
  if (artifacts.patch)
    writeFileSync(artifacts.patch, Object.values(result.diffs).join('\n'), { flag: 'wx' });

  if (values.json) {
    io.log(json);
  } else {
    io.log(formatText(result, context));
  }

  return result.errors.length > 0 ? 1 : 0;
};
