import type { AntdProbeName } from './registry';

// The antd components @lobehub/ui internals can render. Kept in sync with the
// source tree by baseline.test.ts — a failure there means this list must change.
export const lobeUiAntdBaseline: AntdProbeName[] = [
  'alert',
  'anchor',
  'app',
  'auto-complete',
  'avatar',
  'button',
  'collapse',
  'date-picker',
  'divider',
  'drawer',
  'dropdown',
  'form',
  'input',
  'input-number',
  'input-textarea',
  'menu',
  'modal',
  'segmented',
  'select',
  'slider',
  'tabs',
  'tag',
  'tag-preset',
  'tag-status',
];
