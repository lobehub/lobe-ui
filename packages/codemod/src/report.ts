import type { File, Node } from '@babel/types';

import { parse } from './ast';

export const DOCS_URL = 'https://ui.lobehub.com/migration-v6';

export type RuleId =
  'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9' | 'R10' | 'R11' | 'R12' | 'R13';

export const V6_NEXT_STEPS = [
  {
    anchor: `${DOCS_URL}#verification`,
    message:
      'Finish each reported manual item and parse error. Only the selected paths and JS/TS/CSS/Less/Sass files were scanned; run `v6 .` to include config and tests, and search other file types / dynamically built selectors manually. No findings does not mean migration is complete.',
  },
  {
    anchor: `${DOCS_URL}#test-migration`,
    message:
      'Compare tests with a pre-upgrade baseline. Wrap Button / Drawer tests in MotionProvider with motion; preserve real exports in partial @lobehub/ui mocks (including createStaticStyles and Text); query InputNumber by role, not input order.',
  },
  {
    anchor: `${DOCS_URL}#verification`,
    message:
      'Run type-check, lint and relevant tests, then compare light/dark × desktop/mobile screenshots and exercise popups, form submission, close behavior and accessible names. Check app-owned neutral palettes, dividers and container backgrounds.',
  },
  {
    anchor: `${DOCS_URL}#known-issues`,
    message:
      'Use @lobehub/ui 6.0.1 or later for custom neutral hex and React 19 element.ref fixes. Recheck Switch aria-label and InputPassword toggle localization in the installed version. Remove temporary patches / CSS overrides only after verifying the replacement.',
  },
  {
    anchor: `${DOCS_URL}#installation-troubleshooting`,
    message:
      'Install from https://registry.npmjs.org and verify the resolved @lobehub/ui version in each consuming workspace. For 404 check registry availability; for pnpm minimumReleaseAge use a scoped exception only if needed; for a Vite white screen restart with --force.',
  },
];

export interface ReportItem {
  anchor: string;
  column: number;
  file: string;
  level: 'error' | 'info';
  line: number;
  message: string;
  rule: RuleId;
  snippet: string;
}

export interface ReportInput {
  anchor: string;
  level?: ReportItem['level'];
  message: string;
  rule: RuleId;
}

export interface ReportOptions {
  baseUiNames?: Set<string>;
}

export interface RuleContext {
  ast: File;
  options: ReportOptions;
  report: (node: Node, input: ReportInput) => void;
}

export type Rule = (ctx: RuleContext) => void;

export const collectReport = (
  code: string,
  filename: string,
  rules: Rule[],
  options: ReportOptions = {},
) => {
  const lines = code.split('\n');
  const items: ReportItem[] = [];
  const ast = parse(code, filename);
  const report = (node: Node, { anchor, level = 'error', message, rule }: ReportInput) => {
    const { column, line } = node.loc!.start;
    items.push({
      anchor: `${DOCS_URL}#${anchor}`,
      column: column + 1,
      file: filename,
      level,
      line,
      message,
      rule,
      snippet: lines[line - 1].trim(),
    });
  };
  for (const rule of rules) rule({ ast, options, report });
  return items.sort((a, b) => a.line - b.line || a.column - b.column);
};
