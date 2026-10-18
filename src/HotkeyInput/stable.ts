import { stableClasses } from '@/utils/bem';

export const hotkeyInputClasses = stableClasses({
  block: 'hotkey-input',
  dataAttributes: ['variant', 'shadow', 'disabled', 'recording', 'error'],
  elements: ['control', 'value', 'placeholder', 'input', 'actions', 'reset', 'clear', 'error'],
});
