import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

import { formatJson, formatMarkdown, formatText } from './format';
import { runCodemod } from './run';

const USAGE = `Usage: lobe-ui-codemod v6 [paths...] [--dry] [--report <file>] [--json]

  paths      files or directories to migrate (default: src)
  --dry      print a diff instead of writing files
  --report   also write the report as Markdown to <file>
  --json     print the result as JSON (for coding agents)`;

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
  const result = await runCodemod({ cwd: io.cwd, dry, paths: paths.length > 0 ? paths : ['src'] });

  if (values.report) writeFileSync(path.resolve(io.cwd, values.report), formatMarkdown(result));

  if (values.json) {
    io.log(formatJson(result));
  } else {
    for (const diff of Object.values(result.diffs)) io.log(diff);
    io.log(formatText(result, { dry }));
  }

  return result.errors.length > 0 ? 1 : 0;
};
