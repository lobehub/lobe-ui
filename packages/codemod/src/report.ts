import type { File, Node } from '@babel/types';

import { parse } from './ast';

export const DOCS_URL = 'https://ui.lobehub.com/migration-v6';

export type RuleId = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8' | 'R9' | 'R10';

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
