import * as stylex from '@stylexjs/stylex';

import { a2ui } from '@/internal/a2ui/tokens.stylex';

// Adapted from CopilotKit Gen UI 2.0 standard catalog (MIT): `Radio`, `RadioGroup`
// (`radioOptionStyle`) and the `.a2ui-std-check[type=radio]` rules of the standard stylesheet:
// a 20px circle that becomes a 6px accent ring when checked.
const checked = ':has([data-checked])';
const disabledOption = ':has([data-disabled])';

export const styles = stylex.create({
  description: {
    color: a2ui.fgMuted,
    fontSize: '0.875em',
    lineHeight: 1.429,
  },
  dot: {
    margin: 0,
    padding: 0,
    borderColor: { 'default': a2ui.lineStrong, ':is([data-checked])': a2ui.accent },
    borderRadius: 9999,
    borderStyle: 'solid',
    borderWidth: { 'default': 1, ':is([data-checked])': 6 },
    outlineColor: { 'default': null, ':focus-visible': a2ui.info },
    outlineOffset: { 'default': null, ':focus-visible': 1 },
    outlineStyle: { 'default': null, ':focus-visible': 'solid' },
    outlineWidth: { 'default': null, ':focus-visible': 2 },
    backgroundColor: a2ui.surface2,
    boxSizing: 'border-box',
    cursor: { 'default': 'pointer', ':is([data-disabled])': 'not-allowed' },
    flexShrink: 0,
    height: 20,
    width: 20,
  },
  group: {
    margin: 0,
    padding: 0,
    borderStyle: 'none',
    borderWidth: 0,
    minWidth: 0,
  },
  legend: {
    marginBottom: 4,
  },
  option: {
    gap: 8,
    alignItems: 'center',
    color: a2ui.fg,
    cursor: { default: 'pointer', [disabledOption]: 'not-allowed' },
    display: 'inline-flex',
    fontSize: '1em',
    lineHeight: 1.625,
    opacity: { default: null, [disabledOption]: 0.5 },
  },
  optionCards: {
    borderColor: { default: a2ui.line, [checked]: a2ui.accent },
    borderRadius: a2ui.radius,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 12,
    alignItems: 'flex-start',
  },
  optionPills: {
    borderColor: { default: a2ui.line, [checked]: a2ui.accent },
    borderRadius: 9999,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingBlock: 4,
    paddingInline: 12,
  },
  options: {
    gap: 8,
    display: 'flex',
    flexWrap: 'wrap',
  },
  optionsCol: {
    flexDirection: 'column',
  },
  optionsList: {
    gap: 12,
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
  },
});
