import { stableClasses } from '@/utils/bem';

export const inputClasses = stableClasses({
  block: 'input',
  dataAttributes: ['variant', 'size', 'shadow'],
  elements: ['prefix', 'input', 'clear', 'suffix'],
});

export const inputNumberClasses = stableClasses({
  block: 'input-number',
  dataAttributes: ['variant', 'size', 'shadow'],
  elements: ['prefix', 'input', 'suffix', 'controls', 'increment', 'decrement'],
});

export const inputPasswordClasses = stableClasses({
  block: 'input-password',
  elements: ['toggle'],
});

export const inputOTPClasses = stableClasses({
  block: 'input-otp',
  dataAttributes: ['variant', 'size', 'shadow'],
  elements: ['input'],
});

export const textAreaClasses = stableClasses({
  block: 'text-area',
  dataAttributes: ['variant', 'shadow'],
  elements: ['input', 'clear', 'count'],
});
