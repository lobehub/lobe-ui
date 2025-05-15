import { describe, expect, it } from 'vitest';

import {
  areFormulasRenderable,
  escapeBrackets,
  escapeMhchem,
  extractFormulas,
  preprocessLaTeX,
} from '../src/hooks/useMarkdown/latex';

describe('latex utils', () => {
  describe('escapeBrackets', () => {
    it('should preserve code blocks', () => {
      const input = '```math\n\\[x^2\\]\n```';
      expect(escapeBrackets(input)).toBe('```math\n\\[x^2\\]\n```');
    });

    it('should convert \\[...\\] to $$...$$', () => {
      const input = '\\[x^2\\]';
      expect(escapeBrackets(input)).toBe('$$x^2$$');
    });

    it('should convert \\(...\\) to $...$', () => {
      const input = '\\(x^2\\)';
      expect(escapeBrackets(input)).toBe('$x^2$');
    });

    it('should handle multiple expressions', () => {
      const input = '\\[x^2\\] and \\(y^2\\)';
      expect(escapeBrackets(input)).toBe('$$x^2$$ and $y^2$');
    });

    it('should handle nested expressions', () => {
      const input = '```code\n\\[nested\\]\n``` \\[outside\\]';
      expect(escapeBrackets(input)).toBe('```code\n\\[nested\\]\n``` $$outside$$');
    });
  });

  describe('escapeMhchem', () => {
    it('should escape chemical equations', () => {
      const input = '$\\ce{H2O}$';
      expect(escapeMhchem(input)).toBe('$\\\\ce{H2O}$');
    });

    it('should escape physical units', () => {
      const input = '$\\pu{123 J/mol}$';
      expect(escapeMhchem(input)).toBe('$\\\\pu{123 J/mol}$');
    });

    it('should handle multiple expressions', () => {
      const input = '$\\ce{H2O}$ and $\\pu{123 J/mol}$';
      expect(escapeMhchem(input)).toBe('$\\\\ce{H2O}$ and $\\\\pu{123 J/mol}$');
    });

    it('should not modify other LaTeX commands', () => {
      const input = '$\\alpha$ and $\\beta$';
      expect(escapeMhchem(input)).toBe('$\\alpha$ and $\\beta$');
    });
  });

  describe('preprocessLaTeX', () => {
    it('should protect code blocks', () => {
      const input = 'Text `$x^2$` more text';
      expect(preprocessLaTeX(input)).toBe('Text `$x^2$` more text');
    });

    it('should escape currency indicators', () => {
      const input = 'Price: $100';
      expect(preprocessLaTeX(input)).toBe('Price: \\$100');
    });

    it('should handle multiple LaTeX expressions', () => {
      const input = '$$x^2$$ and \\[y^2\\]';
      const result = preprocessLaTeX(input);
      expect(result).toContain('$$x^2$$');
      expect(result).toContain('$$y^2$$');
    });

    it('should handle complex mixed content', () => {
      const input = '```math\n$$x^2$$\n``` Price: $100 and \\[y^2\\]';
      const result = preprocessLaTeX(input);
      expect(result).toContain('```math\n$$x^2$$\n```');
      expect(result).toContain('\\$100');
      expect(result).toContain('$$y^2$$');
    });

    it('should handle nested code blocks and LaTeX', () => {
      const input = '```\n\\[x^2\\]\n```\n$$y^2$$';
      const result = preprocessLaTeX(input);
      expect(result).toContain('```\n\\[x^2\\]\n```');
      expect(result).toContain('$$y^2$$');
    });
  });

  describe('extractFormulas', () => {
    it('should extract formula after last $$', () => {
      const input1 = '$$x^2$$ $$y^2$$';
      const input2 = '$$x^2$$ $$y^2$$ $$z^2';
      expect(extractFormulas(input1)).toBe('');
      // The function returns everything after the last unmatched $$
      expect(extractFormulas(input2)).toBe('x^2$$ $$y^2$$ $$z^2');
    });

    it('should return empty string for even number of $$', () => {
      expect(extractFormulas('$$x^2$$ $$y^2$$')).toBe('');
    });

    it('should handle empty string', () => {
      expect(extractFormulas('')).toBe('');
    });

    it('should handle text without $$', () => {
      expect(extractFormulas('plain text')).toBe('');
    });

    it('should handle single $$', () => {
      expect(extractFormulas('$$formula')).toBe('formula');
    });

    it('should handle multiple formulas', () => {
      // The function returns everything after the last unmatched $$
      expect(extractFormulas('$$complete$$ $$formula$$ $$last')).toBe(
        'complete$$ $$formula$$ $$last',
      );
    });

    it('should handle newlines in formulas', () => {
      expect(extractFormulas('$$a\nb\nc')).toBe('a\nb\nc');
    });

    it('should handle formulas with leading and trailing spaces', () => {
      expect(extractFormulas('   $$a$$   $$b$$   $$c')).toBe('a$$   $$b$$   $$c');
    });

    it('should handle formulas with text before and after', () => {
      expect(extractFormulas('text $$a$$ text $$b')).toBe('a$$ text $$b');
    });

    it('should handle formulas where the last $$ is at end of string', () => {
      expect(extractFormulas('$$a$$ $$b$$')).toBe('');
    });
  });

  describe('areFormulasRenderable', () => {
    it('should return true for valid LaTeX', () => {
      expect(areFormulasRenderable('$$x^2$$')).toBe(true);
    });

    it('should return true when no formulas present', () => {
      expect(areFormulasRenderable('plain text')).toBe(true);
    });

    it('should return false for invalid LaTeX', () => {
      expect(areFormulasRenderable('$$\\invalid{')).toBe(false);
    });

    it('should handle empty string', () => {
      expect(areFormulasRenderable('')).toBe(true);
    });

    it('should handle multiple formulas with last one invalid', () => {
      expect(areFormulasRenderable('$$x^2$$ $$\\invalid{')).toBe(false);
    });

    it('should handle multiple formulas with last one valid', () => {
      expect(areFormulasRenderable('$$x^2$$ $$y^2$$')).toBe(true);
    });

    it('should handle malformed LaTeX', () => {
      expect(areFormulasRenderable('$$\\frac{1}{2')).toBe(false);
    });

    it('should handle nested structures', () => {
      expect(areFormulasRenderable('$$\\begin{matrix} 1 & 2 \\\\ 3 & 4 \\end{matrix}$$')).toBe(
        true,
      );
    });
  });
});
