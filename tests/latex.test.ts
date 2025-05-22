import { describe, expect, it } from 'vitest';

import {
  convertLatexDelimiters,
  escapeLatexPipes,
  escapeMhchemCommands,
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
      const input = '```math\n\\[x^2\\]\n```';
      expect(convertLatexDelimiters(input)).toBe(input);
    });

    it('should preserve inline code', () => {
      const input = '`\\[x^2\\]`';
      expect(convertLatexDelimiters(input)).toBe(input);
    });

    it('should handle multiple expressions', () => {
      const input = '\\[x^2\\] and \\(y^2\\)';
      expect(convertLatexDelimiters(input)).toBe('$$x^2$$ and $y^2$');
    });
  });

  describe('escapeMhchemCommands', () => {
    it('should escape \\ce commands', () => {
      expect(escapeMhchemCommands('$\\ce{H2O}$')).toBe('$\\\\ce{H2O}$');
    });

    it('should escape \\pu commands', () => {
      expect(escapeMhchemCommands('$\\pu{123}$')).toBe('$\\\\pu{123}$');
    });

    it('should handle multiple commands', () => {
      const input = '$\\ce{H2O}$ $\\pu{123}$';
      const expected = '$\\\\ce{H2O}$ $\\\\pu{123}$';
      expect(escapeMhchemCommands(input)).toBe(expected);
    });
  });

  describe('escapeLatexPipes', () => {
    it('should not modify input', () => {
      const input = '$a|b$';
      expect(escapeLatexPipes(input)).toBe(input);
    });

    it('should preserve original text with multiple pipes', () => {
      const input = '$a|b|c$';
      expect(escapeLatexPipes(input)).toBe(input);
    });
  });

  describe('preprocessLaTeX', () => {
    it('should protect code blocks', () => {
      const input = '```math\n$x^2$\n```\n$y^2$';
      expect(preprocessLaTeX(input)).toBe(input);
    });

    it('should protect inline code', () => {
      const input = '`$x^2$` $y^2$';
      expect(preprocessLaTeX(input)).toBe(input);
    });

    it('should handle multiple LaTeX expressions', () => {
      const input = '\\[x^2\\] and \\(y^2\\)';
      expect(preprocessLaTeX(input)).toBe('$$x^2$$ and $y^2$');
    });

    it('should handle mhchem commands', () => {
      const input = '$\\ce{H2O}$';
      expect(preprocessLaTeX(input)).toBe('$\\\\ce{H2O}$');
    });

    it('should not escape dollar signs before numbers', () => {
      expect(preprocessLaTeX('$1$')).toBe('$1$');
    });

    it('should handle complex nested expressions', () => {
      const input = '```math\n\\[x^2\\]\n```\n\\(y^2\\)\n$\\ce{H2O}$';
      const expected = '```math\n\\[x^2\\]\n```\n$y^2$\n$\\\\ce{H2O}$';
      expect(preprocessLaTeX(input)).toBe(expected);
    });
  });

  describe('extractIncompleteFormula', () => {
    it('should return empty string for even number of $$', () => {
      expect(extractIncompleteFormula('$$x^2$$ $$y^2$$')).toBe('');
    });

    it('should extract content after last $$ for odd number of $$', () => {
      expect(extractIncompleteFormula('$$incomplete')).toBe('incomplete');
    });

    it('should return empty string if no $$', () => {
      expect(extractIncompleteFormula('plain text')).toBe('');
    });

    it('should handle multiple $$ correctly', () => {
      // The function extracts everything after the last $$ if the count of $$ is odd
      // For input: '$$x^2$$ $$y^2$$ $$incomplete'
      // $$ count: 5 (odd), so extract after last $$
      // The function extracts everything after the last $$, which is 'x^2$$ $$y^2$$ $$incomplete'
      expect(extractIncompleteFormula('$$x^2$$ $$y^2$$ $$incomplete')).toBe(
        'x^2$$ $$y^2$$ $$incomplete',
      );
    });

    it('should extract everything after last $$ for odd count', () => {
      // For input: 'abc $$x$$ $$y$$ $$z'
      // There are 5 $$, so odd, extract after last $$
      expect(extractIncompleteFormula('abc $$x$$ $$y$$ $$z')).toBe('x$$ $$y$$ $$z');
      // For input: '$$a$$ $$b$$ $$c$$ $$d'
      // There are 7 $$, so odd, extract after last $$
      expect(extractIncompleteFormula('$$a$$ $$b$$ $$c$$ $$d')).toBe('a$$ $$b$$ $$c$$ $$d');
    });

    it('should return empty string for even number of $$, even with trailing text', () => {
      expect(extractIncompleteFormula('$$a$$ $$b$$ $$c$$ $$d$$')).toBe('');
    });
  });

  describe('isLastFormulaRenderable', () => {
    it('should return true for valid formula', () => {
      expect(isLastFormulaRenderable('$$x^2$$ $$y^2$$')).toBe(true);
    });

    it('should return true when no incomplete formula', () => {
      expect(isLastFormulaRenderable('plain text')).toBe(true);
    });

    it('should return false for invalid formula', () => {
      expect(isLastFormulaRenderable('$$\\invalid')).toBe(false);
    });

    it('should handle empty string', () => {
      expect(isLastFormulaRenderable('')).toBe(true);
    });

    it('should return true for valid incomplete formula', () => {
      expect(isLastFormulaRenderable('$$\\frac{1}{2}')).toBe(true);
    });

    it('should return true for even number of $$ and trailing text', () => {
      expect(isLastFormulaRenderable('$$a$$ $$b$$ trailing')).toBe(true);
    });
  });
});
