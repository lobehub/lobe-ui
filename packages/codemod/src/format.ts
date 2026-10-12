import { DOCS_URL, type ReportItem, type RuleId } from './report';
import type { RunResult } from './run';

const RULE_TITLES: Record<RuleId, string> = {
  R1: 'ThemeProvider',
  R2: 'StyleProvider',
  R3: 'static-css and token helpers',
  R4: 'Removed exports',
  R5: 'Changed components',
  R6: 'antd imports',
  R7: 'Dependencies',
  R8: 'Theme hook fields',
  R9: 'antd class names',
  R10: 'Video props',
};

const groupByRule = (items: ReportItem[]) => {
  const groups = new Map<RuleId, ReportItem[]>();
  for (const id of Object.keys(RULE_TITLES) as RuleId[]) {
    const list = items.filter((item) => item.rule === id);
    if (list.length > 0) groups.set(id, list);
  }
  return groups;
};

const heading = (id: RuleId, list: ReportItem[]) =>
  `${id} ${RULE_TITLES[id]} (${list.length}${list.every((i) => i.level === 'info') ? ', info' : ''})`;

const summary = (result: RunResult, dry: boolean) => {
  const manual = result.items.filter((i) => i.level === 'error').length;
  const info = result.items.length - manual;
  const manualText =
    manual === 1 ? '1 item needs a manual fix' : `${manual} items need a manual fix`;
  const infoText = info === 0 ? '' : info === 1 ? ', 1 info item' : `, ${info} info items`;
  return `${dry ? 'Would rewrite' : 'Rewrote'} ${result.changed.length} of ${result.files} files. ${manualText}${infoText}.`;
};

export const formatText = (result: RunResult, { dry }: { dry: boolean }) => {
  const lines: string[] = [];
  for (const [id, list] of groupByRule(result.items)) {
    lines.push(heading(id, list));
    for (const item of list)
      lines.push(`  ${item.file}:${item.line}:${item.column}  ${item.message}`);
    lines.push('');
  }
  if (result.errors.length > 0) {
    lines.push(`Parse errors (${result.errors.length})`);
    for (const error of result.errors) lines.push(`  ${error.file}  ${error.message}`);
    lines.push('');
  }
  lines.push(summary(result, dry));
  if (dry && result.items.length > 0) lines.push('Line numbers refer to the rewritten files.');
  lines.push(`Guide: ${DOCS_URL}`);
  return lines.join('\n');
};

export const formatMarkdown = (result: RunResult) => {
  const lines = ['# @lobehub/ui v6 migration report', '', summary(result, false), ''];
  for (const [id, list] of groupByRule(result.items)) {
    lines.push(`## ${heading(id, list)}`, '');
    for (const item of list) {
      lines.push(
        `- [ ] \`${item.file}:${item.line}:${item.column}\` ${item.message} ([guide](${item.anchor}))`,
      );
    }
    lines.push('');
  }
  if (result.errors.length > 0) {
    lines.push(`## Parse errors (${result.errors.length})`, '');
    for (const error of result.errors) lines.push(`- [ ] \`${error.file}\` ${error.message}`);
    lines.push('');
  }
  return lines.join('\n');
};

export const formatJson = ({ diffs: _diffs, ...result }: RunResult) =>
  JSON.stringify(result, null, 2);
