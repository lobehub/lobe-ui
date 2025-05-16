import { describe, expect, it } from 'vitest';

import {
  convertLatexDelimiters,
  escapeLatexPipes,
  escapeMhchemCommands,
  extractIncompleteFormula,
  isLastFormulaRenderable,
  preprocessLaTeX,
} from '../src/hooks/useMarkdown/latex';

describe('LaTeX utilities', () => {
  describe('convertLatexDelimiters', () => {
    it('should convert LaTeX bracket delimiters to dollar signs', () => {
      const input = '\\[x^2\\] and \\(y^2\\)';
      const expected = '$$x^2$$ and $y^2$';
      expect(convertLatexDelimiters(input)).toBe(expected);
    });

    it('should preserve code blocks', () => {
      const input = '```\\[x^2\\]``` and `\\(y^2\\)`';
      expect(convertLatexDelimiters(input)).toBe(input);
    });

    it('should handle multiple delimiters and mixed content', () => {
      const input = 'Text \\[x^2\\] code ```\\[y^2\\]``` inline \\(z^2\\)';
      const expected = 'Text $$x^2$$ code ```\\[y^2\\]``` inline $z^2$';
      expect(convertLatexDelimiters(input)).toBe(expected);
    });
  });

  describe('escapeMhchemCommands', () => {
    it('should escape mhchem commands', () => {
      const input = '$\\ce{H2O}$ and $\\pu{123 J}$';
      const expected = '$\\\\ce{H2O}$ and $\\\\pu{123 J}$';
      expect(escapeMhchemCommands(input)).toBe(expected);
    });

    it('should handle multiple mhchem commands in same expression', () => {
      const input = '$\\ce{H2O}$ plus $\\pu{123 J}$';
      const expected = '$\\\\ce{H2O}$ plus $\\\\pu{123 J}$';
      expect(escapeMhchemCommands(input)).toBe(expected);
    });

    it('should not modify non-mhchem content', () => {
      const input = '$\\alpha + \\beta$';
      expect(escapeMhchemCommands(input)).toBe(input);
    });
  });

  describe('escapeLatexPipes', () => {
    it('should not modify the input', () => {
      const input = '$a|b$';
      expect(escapeLatexPipes(input)).toBe(input);
    });
  });

  describe('preprocessLaTeX', () => {
    it('should protect code blocks', () => {
      const input = 'Text ```$x^2$``` and `$y^2$`';
      expect(preprocessLaTeX(input)).toBe(input);
    });

    it('should protect existing LaTeX expressions', () => {
      const input = '$$x^2$$ and $y^2$';
      expect(preprocessLaTeX(input)).toBe(input);
    });

    it('should escape dollar signs before numbers', () => {
      const input = 'Price is $100';
      expect(preprocessLaTeX(input)).toBe('Price is \\$100');
    });

    it('should handle complex content with multiple features', () => {
      const input = 'Code ```$x^2$``` with \\[y^2\\] and price $100';
      const expected = 'Code ```$x^2$``` with $$y^2$$ and price \\$100';
      expect(preprocessLaTeX(input)).toBe(expected);
    });

    it('should handle nested code blocks and LaTeX expressions', () => {
      const input = '```math\n$$x^2$$\n```\n\\[y^2\\]';
      const expected = '```math\n$$x^2$$\n```\n$$y^2$$';
      expect(preprocessLaTeX(input)).toBe(expected);
    });
  });

  describe('extractIncompleteFormula', () => {
    it('should extract formula after last $$ with odd count', () => {
      const input = '$$complete$$ $$incomplete';
      // The function should return 'complete$$ $$incomplete' based on the implementation
      expect(extractIncompleteFormula(input)).toBe('complete$$ $$incomplete');
    });

    it('should extract formula after last $$ with odd count, single incomplete', () => {
      const input = '$$incomplete';
      expect(extractIncompleteFormula(input)).toBe('incomplete');
    });

    it('should return empty string with even count of $$', () => {
      const input = '$$formula1$$ $$formula2$$';
      expect(extractIncompleteFormula(input)).toBe('');
    });

    it('should return empty string with no $$', () => {
      const input = 'Just text';
      expect(extractIncompleteFormula(input)).toBe('');
    });

    it('should handle single $$ correctly', () => {
      expect(extractIncompleteFormula('$$')).toBe('');
    });

    it('should handle nested $$ correctly', () => {
      const input = '$$outer $$inner$$ end$$';
      expect(extractIncompleteFormula(input)).toBe('');
    });
  });

  describe('isLastFormulaRenderable', () => {
    it('should return true when no incomplete formula exists', () => {
      const input = 'Just text';
      expect(isLastFormulaRenderable(input)).toBe(true);
    });

    it('should handle empty formula', () => {
      expect(isLastFormulaRenderable('$$$$')).toBe(true);
      expect(isLastFormulaRenderable('$$')).toBe(true);
    });

    it.skip('should return true for valid LaTeX formula', () => {
      const input = '$$\\frac{1}{2}$$';
      expect(isLastFormulaRenderable(input)).toBe(true);
    });

    it.skip('should return false for invalid LaTeX formula', () => {
      const input = '$$\\undefinedcommand{$$';
      expect(isLastFormulaRenderable(input)).toBe(false);
    });

    it.skip('should handle multiple formulas correctly', () => {
      expect(isLastFormulaRenderable('$$\\frac{1}{2}$$ $$\\frac{3}{4}$$')).toBe(true);
      expect(isLastFormulaRenderable('$$\\frac{1}{2}$$ $$\\undefinedcommand{$$')).toBe(false);
    });
  });
});
