import { describe, expect, it } from 'vitest';
import { escapeDollarNumber } from './utils';

describe('escapeDollarNumber', () => {
  it('should escape dollar signs followed by numbers', () => {
    expect(escapeDollarNumber('This costs $10.')).toBe('This costs \\$10.');
    expect(escapeDollarNumber('I have $20 and you have $30')).toBe('I have \\$20 and you have \\$30');
  });

  it('should not escape dollar signs in code blocks', () => {
    expect(escapeDollarNumber('```\n$10\n```')).toBe('```\n$10\n```');
    expect(escapeDollarNumber('This is a inline code block: `$10`')).toBe('This is a inline code block: `$10`');
  });

  it('should handle multiple cases', () => {
    expect(escapeDollarNumber('This costs $10. But this code is fine: `$10`.')).toBe('This costs \\$10. But this code is fine: `$10`.');
  });

  it('should handle edge cases', () => {
    expect(escapeDollarNumber('')).toBe(''); 
    expect(escapeDollarNumber('$')).toBe('$'); 
    expect(escapeDollarNumber('$$')).toBe('$$'); 
    expect(escapeDollarNumber('$1$2$3')).toBe('\\$1\\$2\\$3'); // 多个需要转义的情况
  });
});
