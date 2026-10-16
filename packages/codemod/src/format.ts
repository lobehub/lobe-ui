import { createHash } from 'node:crypto';

import packageInfo from '../package.json';
import { type ReportItem, type RuleId, V6_NEXT_STEPS } from './report';
import type { RunResult } from './run';

export interface ReportArtifacts {
  json: string;
  markdown: string;
  patch?: string;
}

interface ReportContext {
  artifacts?: ReportArtifacts;
  cwd?: string;
  dry?: boolean;
  paths?: string[];
}

interface Task {
  anchor: string;
  id: string;
  kind: 'manual-fix' | 'review';
  locations: { file: string; line: number; column: number }[];
  message: string;
  rule: RuleId;
}

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
  R11: 'Table / ProTable props',
  R12: 'DatePicker props',
  R13: 'Test mocks',
};

const groupTasks = (items: ReportItem[]) => {
  const groups = new Map<string, Task>();
  for (const item of items) {
    const key = JSON.stringify([item.rule, item.level, item.message, item.anchor]);
    let task = groups.get(key);
    if (!task) {
      task = {
        id: `${item.rule}-${createHash('sha256').update(key).digest('hex').slice(0, 12)}`,
        kind: item.level === 'error' ? 'manual-fix' : 'review',
        rule: item.rule,
        message: item.message,
        anchor: item.anchor,
        locations: [],
      };
      groups.set(key, task);
    }
    task.locations.push({ file: item.file, line: item.line, column: item.column });
  }
  return [...groups.values()].sort((a, b) => a.kind.localeCompare(b.kind));
};

export const createReport = (
  { diffs: _diffs, ...result }: RunResult,
  { dry = false, paths = ['src'], artifacts, cwd = process.cwd() }: ReportContext = {},
) => {
  const tasks = groupTasks(result.items);
  const manualTasks = tasks.filter((task) => task.kind === 'manual-fix').length;
  const firstTask = tasks[0];
  const nextAction =
    result.errors.length > 0
      ? {
          kind: 'parse-error',
          message: `Resolve parse errors before continuing; start with ${result.errors[0].file}.`,
        }
      : dry && result.changed.length > 0
        ? {
            kind: 'review-diff',
            message:
              'Review the saved patch, then run again without --dry to apply the mechanical changes.',
          }
        : firstTask
          ? {
              kind: firstTask.kind,
              taskId: firstTask.id,
              message: `Open task ${firstTask.id} in the report: ${firstTask.message}`,
            }
          : {
              kind: 'verify',
              message:
                'Complete the test, visual and runtime checks in nextSteps; a clean static scan does not verify the migration.',
            };
  return {
    schemaVersion: 1,
    codemodVersion: packageInfo.version,
    migration: 'v6',
    mode: dry ? 'dry-run' : 'write',
    status: result.errors.length > 0 ? 'parse-errors' : 'needs-verification',
    scope: { root: cwd, paths, locationBasis: 'after-transforms' },
    summary: {
      scannedFiles: result.files,
      changedFiles: result.changed.length,
      manualFindings: result.items.filter((item) => item.level === 'error').length,
      reviewFindings: result.items.filter((item) => item.level === 'info').length,
      parseErrors: result.errors.length,
      manualTasks,
      reviewTasks: tasks.length - manualTasks,
    },
    artifacts,
    nextAction,
    tasks,
    ...result,
    nextSteps: V6_NEXT_STEPS,
  };
};

const summary = (result: RunResult, dry: boolean) => {
  const manual = result.items.filter((i) => i.level === 'error').length;
  const info = result.items.length - manual;
  const manualText =
    manual === 1 ? '1 item needs a manual fix' : `${manual} items need a manual fix`;
  const infoText = info === 0 ? '' : info === 1 ? ', 1 info item' : `, ${info} info items`;
  return `${dry ? 'Would rewrite' : 'Rewrote'} ${result.changed.length} of ${result.files} files. ${manualText}${infoText}.`;
};

export const formatText = (result: RunResult, context: ReportContext = {}) => {
  const report = createReport(result, context);
  const lines = [
    summary(result, Boolean(context.dry)),
    `Tasks: ${report.summary.manualTasks} manual, ${report.summary.reviewTasks} review. Parse errors: ${report.summary.parseErrors}.`,
    `Next: ${report.nextAction.message}`,
  ];
  if (context.artifacts) {
    lines.push(
      `Markdown report: ${context.artifacts.markdown}`,
      `JSON report: ${context.artifacts.json}`,
    );
    if (context.artifacts.patch) lines.push(`Patch: ${context.artifacts.patch}`);
  }
  lines.push('Next steps (manual verification required): see the reports.');
  return lines.join('\n');
};

export const formatMarkdown = (result: RunResult, context: ReportContext = {}) => {
  const report = createReport(result, context);
  const lines = [
    '# @lobehub/ui v6 migration report',
    '',
    summary(result, Boolean(context.dry)),
    '',
    `Mode: ${report.mode}. Status: ${report.status}. Codemod: ${report.codemodVersion}.`,
    '',
    `Project root: \`${report.scope.root}\`. Finding paths are relative to this directory.`,
    '',
    `Scanned paths: ${report.scope.paths.map((p) => `\`${p}\``).join(', ')}. Line numbers refer to files after the mechanical transforms (including in dry-run).`,
    '',
    `Next: ${report.nextAction.message}`,
    '',
    'For agents: read JSON summary, nextAction and tasks first. Task IDs do not depend on file order or line numbers; each task retains every occurrence. The raw items field remains available for compatibility.',
    '',
  ];
  if (context.artifacts) {
    lines.push(`JSON report: \`${context.artifacts.json}\``, '');
    if (context.artifacts.patch) lines.push(`Patch: \`${context.artifacts.patch}\``, '');
  }
  for (const id of Object.keys(RULE_TITLES) as RuleId[]) {
    const tasks = report.tasks.filter((task) => task.rule === id);
    if (tasks.length === 0) continue;
    lines.push(
      `## ${id} ${RULE_TITLES[id]} (${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'})`,
      '',
    );
    for (const task of tasks) {
      lines.push(`- [ ] **${task.id}** (${task.kind}) ${task.message} ([guide](${task.anchor}))`);
      for (const location of task.locations)
        lines.push(`  - \`${location.file}:${location.line}:${location.column}\``);
    }
    lines.push('');
  }
  if (result.errors.length > 0) {
    lines.push(`## Parse errors (${result.errors.length})`, '');
    for (const error of result.errors) lines.push(`- [ ] \`${error.file}\` ${error.message}`);
    lines.push('');
  }
  lines.push('## Next steps (manual verification required)', '');
  for (const step of V6_NEXT_STEPS) lines.push(`- [ ] ${step.message} ([guide](${step.anchor}))`);
  lines.push('');
  return lines.join('\n');
};

export const formatJson = (result: RunResult, context: ReportContext = {}) =>
  JSON.stringify(createReport(result, context), null, 2);
