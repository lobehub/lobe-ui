import type { Node } from '@babel/types';

import { walk } from '../../ast';
import { DOCS_URL, type ReportItem, type Rule } from '../../report';

const ANT_PATTERN = /(?:\.ant-[\w-]*|(?<![\w-])--ant-[\w-]*)/g;

const SLOTS: Record<string, [component: string, slot: string]> = {
  '.ant-segmented': ['Segmented', 'root'],
  '.ant-segmented-group': ['Segmented', 'list'],
  '.ant-segmented-item': ['Segmented', 'item'],
  '.ant-segmented-item-icon': ['Segmented', 'itemIcon'],
  '.ant-segmented-item-label': ['Segmented', 'itemLabel'],
  '.ant-segmented-thumb': ['Segmented', 'indicator'],
  '.ant-picker': ['DatePicker / RangePicker', 'root'],
  '.ant-picker-suffix': ['DatePicker / RangePicker', 'suffix'],
  '.ant-picker-dropdown': ['DatePicker / RangePicker', 'popup.root'],
  '.ant-drawer-body': ['Drawer', 'bodyContent'],
  '.ant-drawer-header': ['Drawer', 'header'],
  '.ant-drawer-footer': ['Drawer', 'footer'],
  '.ant-drawer-title': ['Drawer', 'title'],
  '.ant-drawer-mask': ['Drawer', 'backdrop'],
  '.ant-select-selector': ['Select', 'trigger'],
  '.ant-select-dropdown': ['Select', 'popup'],
  '.ant-tag': ['Tag', 'root'],
  '.ant-tabs-nav': ['Tabs', 'list'],
  '.ant-tabs-tab': ['Tabs', 'tab'],
  '.ant-tabs-ink-bar': ['Tabs', 'indicator'],
  '.ant-tabs-tabpane': ['Tabs', 'panel'],
};

const TOKENS = new Set([
  'color-text',
  'color-text-secondary',
  'color-text-tertiary',
  'color-text-quaternary',
  'color-text-disabled',
  'color-text-placeholder',
  'color-bg-container',
  'color-bg-elevated',
  'color-bg-layout',
  'color-bg-mask',
  'color-border',
  'color-border-secondary',
  'color-split',
  'color-fill',
  'color-fill-secondary',
  'color-fill-tertiary',
  'color-fill-quaternary',
  'color-primary',
  'color-primary-hover',
  'color-primary-active',
  'color-primary-bg',
  'color-primary-border',
  'color-error',
  'color-error-bg',
  'color-warning',
  'color-warning-bg',
  'color-info',
  'color-info-bg',
  'color-success',
  'color-success-bg',
  'border-radius',
  'border-radius-sm',
  'border-radius-lg',
  'box-shadow',
]);

const hint = (name: string) => {
  if (name === '.ant-' || name === '--ant-')
    return 'This name is dynamically constructed; inspect the interpolation and choose a documented v6 slot / token manually.';
  if (name === '.ant-app')
    return 'Use `#lobe-ui-theme-app` (`document.getElementById(LOBE_THEME_APP_ID)`) instead of `.ant-app`.';
  if (name.startsWith('--ant-')) {
    const token = name.slice('--ant-'.length);
    if (TOKENS.has(token))
      return `Use \`--lobe-${token}\` (or \`cssVar\` from @lobehub/ui); import theme.css and verify light/dark colors against the app palette.`;
    return 'No verified token mapping. Choose a supported `cssVar` / `--lobe-*` token from https://ui.lobehub.com/design-tokens; do not blindly replace the prefix.';
  }
  const slot = SLOTS[name];
  if (slot?.[0] === 'Select')
    return `Use Select \`classNames.${slot[1]}\` with a CSS class; Select has no \`styles\` prop.`;
  if (slot)
    return `Use ${slot[0]} \`classNames.${slot[1]}\` / \`styles.${slot[1]}\`; check the v6 DOM before moving the override.`;
  return 'No verified selector mapping. Use the component `className` / documented `classNames` / `styles` slots or `data-*` attributes; inspect its v6 DOM.';
};

const messages = (value: string) =>
  [...new Set(value.match(ANT_PATTERN))].map(
    (name) => `\`${name}\` no longer targets lobe-ui v6. ${hint(name)}`,
  );

export const collectAntStyleReport = (code: string, file: string): ReportItem[] => {
  // Preserve offsets while ignoring CSS block comments; stylesheets are reported, never rewritten.
  const searchable = code.replaceAll(/\/\*[\s\S]*?\*\//g, (comment) =>
    comment.replaceAll(/[^\r\n]/g, ' '),
  );
  const lines = code.split('\n');
  const items: ReportItem[] = [];
  let line = 1;
  let lineStart = 0;
  let offset = 0;
  for (const match of searchable.matchAll(ANT_PATTERN)) {
    for (; offset < match.index; offset++) {
      if (code[offset] === '\n') {
        line++;
        lineStart = offset + 1;
      }
    }
    items.push({
      anchor: `${DOCS_URL}#behavior-changes`,
      column: match.index - lineStart + 1,
      file,
      level: 'error',
      line,
      message: messages(match[0])[0],
      rule: 'R9',
      snippet: lines[line - 1].trim(),
    });
  }
  return items;
};

export const antClassNames: Rule = ({ ast, report }) => {
  const antPrefixes = new Set<string>();
  walk(ast, (node, parent) => {
    if (
      parent?.type === 'VariableDeclaration' &&
      parent.kind === 'const' &&
      node.type === 'VariableDeclarator' &&
      node.id.type === 'Identifier' &&
      node.init?.type === 'StringLiteral' &&
      node.init.value === 'ant'
    )
      antPrefixes.add(node.id.name);
  });
  const check = (node: Node, value: string) => {
    for (const message of messages(value))
      report(node, {
        anchor: 'behavior-changes',
        message,
        rule: 'R9',
      });
  };
  walk(ast, (node) => {
    if (node.type === 'StringLiteral') check(node, node.value);
    if (node.type === 'TemplateLiteral') {
      const text = node.quasis
        .map((q, index) => {
          const expression = node.expressions[index];
          const prefix = expression?.type === 'Identifier' && antPrefixes.has(expression.name);
          return q.value.raw + (expression ? (prefix ? 'ant' : '${…}') : '');
        })
        .join('');
      check(node, text);
    }
  });
};
