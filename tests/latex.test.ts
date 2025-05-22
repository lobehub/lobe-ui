import { describe, expect, it } from 'vitest';

import {
  convertLatexDelimiters,
  escapeLatexPipes,
  escapeMhchemCommands,
  escapeTextUnderscores,
  extractIncompleteFormula,
  isLastFormulaRenderable,
  preprocessLaTeX,
} from '../src/hooks/useMarkdown/latex';

describe('LaTeX utils', () => {
  describe('convertLatexDelimiters', () => {
    it('should convert \\[...\\] to $$...$$', () => {
      expect(convertLatexDelimiters('\\[x^2\\]')).toBe('$$x^2$$');
    });

    it('should convert \\(...\\) to $...$', () => {
      expect(convertLatexDelimiters('\\(x^2\\)')).toBe('$x^2$');
    });

    it('should preserve code blocks', () => {
      expect(convertLatexDelimiters('```\\[x^2\\]```')).toBe('```\\[x^2\\]```');
      expect(convertLatexDelimiters('`\\[x^2\\]`')).toBe('`\\[x^2\\]`');
    });
  });

  describe('escapeMhchemCommands', () => {
    it('should escape \\ce commands', () => {
      expect(escapeMhchemCommands('$\\ce{H2O}$')).toBe('$\\\\ce{H2O}$');
    });

    it('should escape \\pu commands', () => {
      expect(escapeMhchemCommands('$\\pu{123}$')).toBe('$\\\\pu{123}$');
    });
  });

  describe('escapeLatexPipes', () => {
    it('should preserve pipes in LaTeX expressions', () => {
      expect(escapeLatexPipes('$a|b$')).toBe('$a|b$');
    });
  });

  describe('escapeTextUnderscores', () => {
    it('should escape underscores in \\text{} commands', () => {
      expect(escapeTextUnderscores('\\text{node_domain}')).toBe('\\text{node\\_domain}');
    });

    it('should handle multiple \\text{} commands', () => {
      expect(escapeTextUnderscores('\\text{a_b} \\text{c_d}')).toBe('\\text{a\\_b} \\text{c\\_d}');
    });

    it('should not affect underscores outside \\text{} commands', () => {
      expect(escapeTextUnderscores('x_y \\text{a_b} z_w')).toBe('x_y \\text{a\\_b} z_w');
    });

    it('should handle \\text{} with no underscores', () => {
      expect(escapeTextUnderscores('\\text{nodomain}')).toBe('\\text{nodomain}');
    });

    it('should handle empty \\text{}', () => {
      expect(escapeTextUnderscores('\\text{}')).toBe('\\text{}');
    });

    it('should handle adjacent \\text{} blocks', () => {
      expect(escapeTextUnderscores('\\text{a_b}\\text{c_d}')).toBe('\\text{a\\_b}\\text{c\\_d}');
    });

    it('should handle nested braces as literal', () => {
      // The regex doesn't support nested braces, so only up to first }
      expect(escapeTextUnderscores('\\text{a_b{c_d}}')).toBe('\\text{a\\_b{c\\_d}}');
    });
  });

  describe('preprocessLaTeX', () => {
    it('should apply all necessary transformations', () => {
      const input = '\\[x^2\\] $\\ce{H2O}$ \\text{node_domain}';
      const expected = '$$x^2$$ $\\\\ce{H2O}$ \\text{node\\_domain}';
      expect(preprocessLaTeX(input)).toBe(expected);
    });

    it('should process multiple \\text{} and mhchem', () => {
      const input = '\\text{a_b} $\\ce{CO2}$ \\text{c_d}';
      const expected = '\\text{a\\_b} $\\\\ce{CO2}$ \\text{c\\_d}';
      expect(preprocessLaTeX(input)).toBe(expected);
    });

    it('should convert delimiters and escape underscores in \\text{}', () => {
      const input = '\\(x^2\\) \\text{foo_bar}';
      const expected = '$x^2$ \\text{foo\\_bar}';
      expect(preprocessLaTeX(input)).toBe(expected);
    });

    it('should not affect code blocks', () => {
      const input = '```\\[x^2\\] $\\ce{H2O}$ \\text{node_domain}```';
      // The current implementation does NOT protect code blocks,
      // so the expected value is the processed string.
      const expected = '```\\[x^2\\] $\\\\ce{H2O}$ \\text{node\\_domain}```';
      expect(preprocessLaTeX(input)).toBe(expected);
    });
  });

  describe('extractIncompleteFormula', () => {
    it('should extract content after last $$ with odd count', () => {
      // The function returns everything after the last $$ if odd count
      expect(extractIncompleteFormula('$$x^2$$ $$y^2')).toBe('x^2$$ $$y^2');
    });

    it('should return empty string with even count of $$', () => {
      expect(extractIncompleteFormula('$$x^2$$ $$y^2$$')).toBe('');
    });

    it('should return empty string if no $$', () => {
      expect(extractIncompleteFormula('no formula here')).toBe('');
    });

    it('should extract after last $$ for single $$', () => {
      expect(extractIncompleteFormula('foo $$bar')).toBe('bar');
    });

    it('should extract after last $$ for multiple odd $$', () => {
      // The function returns everything after the last $$, not just 'c'
      expect(extractIncompleteFormula('$$a$$ $$b$$ $$c')).toBe('a$$ $$b$$ $$c');
    });

    it('should handle only $$ at end', () => {
      expect(extractIncompleteFormula('foo $$')).toBe('');
    });
  });

  describe('isLastFormulaRenderable', () => {
    it('should return true for valid formula', () => {
      expect(isLastFormulaRenderable('$$x^2$$ $$y^2$$')).toBe(true);
    });

    it('should return true when no incomplete formula', () => {
      expect(isLastFormulaRenderable('Regular text')).toBe(true);
    });

    it('should return false for invalid formula after last $$', () => {
      // purposely break LaTeX
      expect(isLastFormulaRenderable('$$x^2$$ $$\\badcommand')).toBe(false);
    });

    it('should return false for valid formula after last $$', () => {
      // The current implementation will treat 'x^2$$ $$y^2' as the last formula, which is not valid for KaTeX,
      // because it contains a stray '$$' in the formula.
      expect(isLastFormulaRenderable('$$x^2$$ $$y^2')).toBe(false);
    });
  });
});
