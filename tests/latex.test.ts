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
    it('should convert LaTeX bracket delimiters to dollar sign delimiters', () => {
      const input = 'This is \\[x^2\\] and \\(y^2\\)';
      const expected = 'This is $$x^2$$ and $y^2$';
      expect(convertLatexDelimiters(input)).toBe(expected);
    });

    it('should preserve code blocks during conversion', () => {
      const input = '```math\n\\[x^2\\]\n```\n`\\[y^2\\]`';
      expect(convertLatexDelimiters(input)).toBe(input);
    });

    it('should handle multiple expressions', () => {
      const input = '\\[x^2\\] text \\(y^2\\) more \\[z^2\\]';
      const expected = '$$x^2$$ text $y^2$ more $$z^2$$';
      expect(convertLatexDelimiters(input)).toBe(expected);
    });

    it('should handle expressions with newlines', () => {
      const input = '\\[\nx^2\n\\]';
      const expected = '$$\nx^2\n$$';
      expect(convertLatexDelimiters(input)).toBe(expected);
    });
  });

  describe('escapeMhchemCommands', () => {
    it('should escape mhchem commands', () => {
      const input = '$\\ce{H2O}$ and $\\pu{123 J}$';
      const expected = '$\\\\ce{H2O}$ and $\\\\pu{123 J}$';
      expect(escapeMhchemCommands(input)).toBe(expected);
    });

    it('should handle multiple commands', () => {
      const input = '$\\ce{H2O}$ and $\\pu{123 J}$';
      const expected = '$\\\\ce{H2O}$ and $\\\\pu{123 J}$';
      expect(escapeMhchemCommands(input)).toBe(expected);
    });

    it('should handle commands at start and end', () => {
      const input = '$\\ce{H2O}$ and $\\pu{123 J}$';
      const expected = '$\\\\ce{H2O}$ and $\\\\pu{123 J}$';
      expect(escapeMhchemCommands(input)).toBe(expected);
    });
  });

  describe('escapeLatexPipes', () => {
    it('should not modify the input text', () => {
      const input = '$a|b$';
      expect(escapeLatexPipes(input)).toBe(input);
    });

    it('should preserve pipes in tables', () => {
      const input = '| a | b |\n|---|---|\n| 1 | 2 |';
      expect(escapeLatexPipes(input)).toBe(input);
    });
  });

  describe('escapeTextUnderscores', () => {
    it('should escape unescaped underscores in \\text commands', () => {
      const input = '\\text{node_domain}';
      const expected = '\\text{node\\_domain}';
      expect(escapeTextUnderscores(input)).toBe(expected);
    });

    it('should not escape already escaped underscores', () => {
      const input = '\\text{node\\_domain}';
      expect(escapeTextUnderscores(input)).toBe(input);
    });

    it('should handle multiple \\text commands', () => {
      const input = '\\text{a_b} and \\text{c_d}';
      const expected = '\\text{a\\_b} and \\text{c\\_d}';
      expect(escapeTextUnderscores(input)).toBe(expected);
    });

    it('should handle mixed escaped and unescaped underscores', () => {
      const input = '\\text{a_b\\_c_d}';
      const expected = '\\text{a\\_b\\_c\\_d}';
      expect(escapeTextUnderscores(input)).toBe(expected);
    });
  });

  describe('preprocessLaTeX', () => {
    it('should apply all LaTeX preprocessing steps', () => {
      const input = '\\[x^2\\] and \\text{node_domain} and $\\ce{H2O}$';
      const expected = '$$x^2$$ and \\text{node\\_domain} and $\\\\ce{H2O}$';
      expect(preprocessLaTeX(input)).toBe(expected);
    });

    it('should handle complex mixed content', () => {
      const input = '```math\n\\[x^2\\]\n```\n\\text{a_b} $\\ce{H2O}$';
      const expected = '```math\n\\[x^2\\]\n```\n\\text{a\\_b} $\\\\ce{H2O}$';
      expect(preprocessLaTeX(input)).toBe(expected);
    });
  });

  describe('extractIncompleteFormula', () => {
    it('should return empty string with even count of $$', () => {
      expect(extractIncompleteFormula('$$formula1$$ $$formula2$$')).toBe('');
    });

    it('should handle empty string', () => {
      expect(extractIncompleteFormula('')).toBe('');
    });
  });

  describe('isLastFormulaRenderable', () => {
    it('should return true for valid formula', () => {
      expect(isLastFormulaRenderable('$$x^2$$ $$y^2$$')).toBe(true);
    });

    it('should return true when no incomplete formula exists', () => {
      expect(isLastFormulaRenderable('$$x^2$$')).toBe(true);
    });

    it('should return true for empty string', () => {
      expect(isLastFormulaRenderable('')).toBe(true);
    });
  });
});
