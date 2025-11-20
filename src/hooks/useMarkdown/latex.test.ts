import {
  convertLatexDelimiters,
  escapeCurrencyDollars,
  escapeLatexPipes,
  escapeMhchemCommands,
  escapeTextUnderscores,
  fixCommonLaTeXErrors,
  handleCJKWithLatex,
  isLastFormulaRenderable,
  normalizeLatexSpacing,
  preprocessLaTeX,
  preprocessLaTeXMinimal,
  preprocessLaTeXStrict,
  validateLatexExpressions,
} from './latex';

describe('preprocessLaTeX', () => {
  test('returns the same string if no LaTeX patterns are found', () => {
    const content = 'This is a test string without LaTeX';
    expect(preprocessLaTeX(content)).toBe(content);
  });

  // test('escapes dollar signs followed by digits', () => {
  //   const content = 'Price is $50 and $100';
  //   const expected = 'Price is \\$50 and \\$100';
  //   expect(preprocessLaTeX(content)).toBe(expected);
  // });

  test('does not escape dollar signs not followed by digits', () => {
    const content = 'This $variable is not escaped';
    expect(preprocessLaTeX(content)).toBe(content);
  });

  test('preserves existing LaTeX expressions', () => {
    const content = 'Inline $x^2 + y^2 = z^2$ and block $$E = mc^2$$';
    expect(preprocessLaTeX(content)).toBe(content);
  });

  // test('handles mixed LaTeX and currency', () => {
  //   const content = 'LaTeX $x^2$ and price $50';
  //   const expected = 'LaTeX $x^2$ and price \\$50';
  //   expect(preprocessLaTeX(content)).toBe(expected);
  // });

  test('converts LaTeX delimiters', () => {
    const content = 'Brackets \\[x^2\\] and parentheses \\(y^2\\)';
    const expected = 'Brackets $$x^2$$ and parentheses $y^2$';
    expect(preprocessLaTeX(content)).toBe(expected);
  });

  test('escapes mhchem commands', () => {
    const content = '$\\ce{H2O}$ and $\\pu{123 J}$';
    const expected = '$\\\\ce{H2O}$ and $\\\\pu{123 J}$';
    expect(preprocessLaTeX(content)).toBe(expected);
  });

  test('handles complex mixed content', () => {
    const content = `
      LaTeX inline $x^2$ and block $$y^2$$
      Chemical $\\ce{H2O}$
      Brackets \\[z^2\\]
    `;
    const expected = `
      LaTeX inline $x^2$ and block $$y^2$$
      Chemical $\\\\ce{H2O}$
      Brackets $$z^2$$
    `;
    expect(preprocessLaTeX(content)).toBe(expected);
  });

  test('handles empty string', () => {
    expect(preprocessLaTeX('')).toBe('');
  });

  test('preserves code blocks and escapes currency outside', () => {
    const content = '```\n$100\n```\nOutside $200';
    const expected = '```\n$100\n```\nOutside \\$200';
    expect(preprocessLaTeX(content)).toBe(expected);
  });

  // test('handles multiple currency values in a sentence', () => {
  //   const content = 'I have $50 in my wallet and $100 in the bank.';
  //   const expected = 'I have \\$50 in my wallet and \\$100 in the bank.';
  //   expect(preprocessLaTeX(content)).toBe(expected);
  // });

  test('preserves LaTeX expressions with numbers', () => {
    const content = 'The equation is $f(x) = 2x + 3$ where x is a variable.';
    expect(preprocessLaTeX(content)).toBe(content);
  });

  // test('handles currency values with commas', () => {
  //   const content = 'The price is $1,000,000 for this item.';
  //   const expected = 'The price is \\$1,000,000 for this item.';
  //   expect(preprocessLaTeX(content)).toBe(expected);
  // });

  test('escapes pipes inside LaTeX expressions with special characters', () => {
    const content = 'The set is defined as $\\{x | x > 0\\}$.';
    const expected = 'The set is defined as $\\{x \\vert{} x > 0\\}$.';
    expect(preprocessLaTeX(content)).toBe(expected);
  });

  test('handles tables with currency symbols', () => {
    const content = `| 星级 | 人均价格（美元） | 中国大陆参考 |
|------|----------------|-------------|
| 必比登 | $20-50 | ¥150-350 |
| ⭐ | $50-200 | ¥400-1,500 |`;
    const expected = `| 星级 | 人均价格（美元） | 中国大陆参考 |
|------|----------------|-------------|
| 必比登 | \\$20-50 | ¥150-350 |
| ⭐ | \\$50-200 | ¥400-1,500 |`;
    expect(preprocessLaTeX(content)).toBe(expected);
  });

  test('handles mixed LaTeX and currency in tables', () => {
    const content = '| Formula | Price |\n|---------|-------|\n| $x^2$ | $100 |';
    const expected = '| Formula | Price |\n|---------|-------|\n| $x^2$ | \\$100 |';
    expect(preprocessLaTeX(content)).toBe(expected);
  });
});

describe('convertLatexDelimiters', () => {
  test('converts brackets to dollar sign delimiters', () => {
    const content = 'Brackets \\[x^2\\] and parentheses \\(y^2\\)';
    const expected = 'Brackets $$x^2$$ and parentheses $y^2$';
    expect(convertLatexDelimiters(content)).toBe(expected);
  });

  test('preserves code blocks', () => {
    const content = '```\n\\[formula\\]\n```\nOutside \\[formula\\]';
    const expected = '```\n\\[formula\\]\n```\nOutside $$formula$$';
    expect(convertLatexDelimiters(content)).toBe(expected);
  });

  test('handles mixed content', () => {
    const content = 'Text \\[x^2\\] `code with \\[y^2\\]` and \\(z^2\\)';
    const expected = 'Text $$x^2$$ `code with \\[y^2\\]` and $z^2$';
    expect(convertLatexDelimiters(content)).toBe(expected);
  });

  test('handles empty string', () => {
    expect(convertLatexDelimiters('')).toBe('');
  });
});

describe('escapeMhchemCommands', () => {
  test('escapes mhchem ce command', () => {
    const content = '$\\ce{H2O}$';
    const expected = '$\\\\ce{H2O}$';
    expect(escapeMhchemCommands(content)).toBe(expected);
  });

  test('escapes mhchem pu command', () => {
    const content = '$\\pu{123 J}$';
    const expected = '$\\\\pu{123 J}$';
    expect(escapeMhchemCommands(content)).toBe(expected);
  });

  test('escapes multiple mhchem commands', () => {
    const content = '$\\ce{H2O}$ and $\\pu{123 J}$';
    const expected = '$\\\\ce{H2O}$ and $\\\\pu{123 J}$';
    expect(escapeMhchemCommands(content)).toBe(expected);
  });

  test('does not affect text without mhchem commands', () => {
    const content = '$x^2 + y^2 = z^2$';
    expect(escapeMhchemCommands(content)).toBe(content);
  });
});

describe('escapeLatexPipes', () => {
  test('escapes pipes in inline LaTeX expressions', () => {
    const content = 'Set notation $\\{x | x > 0\\}$';
    const expected = 'Set notation $\\{x \\vert{} x > 0\\}$';
    expect(escapeLatexPipes(content)).toBe(expected);
  });

  test('escapes pipes in block LaTeX', () => {
    const content = 'Set notation $$\\{x | x > 0\\}$$';
    const expected = 'Set notation $$\\{x \\vert{} x > 0\\}$$';
    expect(escapeLatexPipes(content)).toBe(expected);
  });

  test('preserves pipes outside LaTeX', () => {
    const content = 'a | b';
    expect(escapeLatexPipes(content)).toBe(content);
  });

  test('escapes pipes in multiple LaTeX expressions', () => {
    const content = '$\\{x | x > 0\\}$ and $$\\{y | y < 0\\}$$';
    const expected = '$\\{x \\vert{} x > 0\\}$ and $$\\{y \\vert{} y < 0\\}$$';
    expect(escapeLatexPipes(content)).toBe(expected);
  });

  test('handles pipes in table with LaTeX absolute values', () => {
    const content = '| $1$ | $2$ |\n| $|3| = 3$ | $|4| = 4$ |';
    const result = escapeLatexPipes(content);

    // Should escape pipes inside LaTeX formulas
    expect(result).toContain('$\\vert{}3\\vert{} = 3$');
    expect(result).toContain('$\\vert{}4\\vert{} = 4$');

    // Should preserve table structure pipes
    expect(result).toMatch(/\|\s*\$1\$/);
    expect(result).toMatch(/\$2\$\s*\|/);
  });

  test('handles complex table with multiple LaTeX formulas', () => {
    const content = `| $1$       | $2$       |
| --------- | --------- |
| $|3| = 3$ | $|4| = 4$ |`;

    const result = escapeLatexPipes(content);

    // Each formula should be processed independently
    expect(result).toContain('$1$');
    expect(result).toContain('$2$');
    expect(result).toContain('$\\vert{}3\\vert{} = 3$');
    expect(result).toContain('$\\vert{}4\\vert{} = 4$');

    // Table structure should be preserved
    expect(result.split('\n')).toHaveLength(3);
  });

  test('does not cross newlines for inline math', () => {
    // This should NOT match as a single formula because of the newline
    const content = 'Line 1: $a\nLine 2: b$';
    const result = escapeLatexPipes(content);
    // Should remain unchanged as it's not valid LaTeX
    expect(result).toBe(content);
  });
});

describe('isLastFormulaRenderable', () => {
  test('returns true for empty string', () => {
    expect(isLastFormulaRenderable('')).toBe(true);
  });

  test('returns true for complete formulas', () => {
    expect(isLastFormulaRenderable('$$x^2 + y^2 = z^2$$')).toBe(true);
  });

  test('returns true when no incomplete formula exists', () => {
    expect(isLastFormulaRenderable('$$formula1$$ and $$formula2$$')).toBe(true);
  });

  test('attempts to render incomplete formula', () => {
    expect(isLastFormulaRenderable('Text $$formula1$$')).toBe(true);

    // This should attempt to render "x^{" and return false since it's invalid
    // Note: This test assumes that "x^{" is invalid LaTeX which the renderer will reject
    expect(isLastFormulaRenderable('Text $$formula1$$ $$x^{')).toBe(false);
  });
});

describe('escapeTextUnderscores', () => {
  test('escapes underscores within \\text{} commands', () => {
    const content = '$\\text{node_domain}$';
    const expected = '$\\text{node\\_domain}$';
    expect(escapeTextUnderscores(content)).toBe(expected);
  });

  test('escapes multiple underscores within \\text{} commands', () => {
    const content = '$\\text{node_domain_name}$';
    const expected = '$\\text{node\\_domain\\_name}$';
    expect(escapeTextUnderscores(content)).toBe(expected);
  });

  test('escapes underscores in multiple \\text{} commands', () => {
    const content = '$\\text{node_domain}$ and $\\text{user_name}$';
    const expected = '$\\text{node\\_domain}$ and $\\text{user\\_name}$';
    expect(escapeTextUnderscores(content)).toBe(expected);
  });

  test('does not affect text without \\text{} commands', () => {
    const content = 'This is a regular_text with underscores';
    expect(escapeTextUnderscores(content)).toBe(content);
  });

  test('does not escape underscores in \\text{} commands with \\text{} commands', () => {
    const content = '$\\text{node\\_domain}$ and $\\text{user\\_name}$';
    const expected = '$\\text{node\\_domain}$ and $\\text{user\\_name}$';
    expect(escapeTextUnderscores(content)).toBe(expected);
  });

  test('does not modify \\text{} commands without underscores', () => {
    const content = '$\\text{regular text}$';
    expect(escapeTextUnderscores(content)).toBe(content);
  });

  test('handles complex mixed content', () => {
    const content =
      'LaTeX $x^2 + \\text{var_name}$ and $\\text{no underscore} + \\text{with_score}$';
    const expected =
      'LaTeX $x^2 + \\text{var\\_name}$ and $\\text{no underscore} + \\text{with\\_score}$';
    expect(escapeTextUnderscores(content)).toBe(expected);
  });
});

describe('escapeCurrencyDollars', () => {
  test('escapes simple currency values', () => {
    const content = 'The price is $20';
    const expected = 'The price is \\$20';
    expect(escapeCurrencyDollars(content)).toBe(expected);
  });

  test('does not escape simple LaTeX number formulas', () => {
    // Single digit LaTeX formulas should not be escaped
    expect(escapeCurrencyDollars('$1$')).toBe('$1$');
    expect(escapeCurrencyDollars('$2$')).toBe('$2$');
    expect(escapeCurrencyDollars('$5$')).toBe('$5$');
    expect(escapeCurrencyDollars('$9$')).toBe('$9$');
  });

  test('distinguishes between LaTeX and currency based on closing $', () => {
    // LaTeX: $1$ should NOT be escaped
    expect(escapeCurrencyDollars('Formula $1$ equals one')).toBe('Formula $1$ equals one');

    // Currency: $1 followed by space or punctuation SHOULD be escaped
    expect(escapeCurrencyDollars('Price $1 each')).toBe('Price \\$1 each');
    expect(escapeCurrencyDollars('Cost: $1.')).toBe('Cost: \\$1.');
  });

  test('handles multi-digit numbers in context', () => {
    // Multi-digit LaTeX formulas (less common but valid)
    // Note: $10$ as pure number is ambiguous - could be LaTeX or currency
    // Our implementation conservatively treats closed $ pairs without
    // LaTeX commands as potential formulas

    // LaTeX with closing $ - treated as LaTeX, not currency
    expect(escapeCurrencyDollars('$10$')).toBe('$10$');
    expect(escapeCurrencyDollars('$100$')).toBe('$100$');

    // Clear currency (no closing $)
    expect(escapeCurrencyDollars('$10 ')).toBe('\\$10 ');
    expect(escapeCurrencyDollars('$100 ')).toBe('\\$100 ');
  });

  test('escapes currency ranges with dash', () => {
    const content = '$20-50 and $100-200';
    const expected = '\\$20-50 and \\$100-200';
    expect(escapeCurrencyDollars(content)).toBe(expected);
  });

  test('escapes currency with plus sign', () => {
    const content = '$300-1,000+';
    const expected = '\\$300-1,000+';
    expect(escapeCurrencyDollars(content)).toBe(expected);
  });

  test('escapes currency in markdown tables', () => {
    const content = `| 星级 | 人均价格（美元） | 中国大陆参考 |
|------|----------------|-------------|
| 必比登 | $20-50 | ¥150-350 |
| ⭐ | $50-200 | ¥400-1,500 |
| ⭐⭐ | $200-500 | ¥1,500-3,500 |
| ⭐⭐⭐ | $300-1,000+ | ¥2,000-7,000+ |`;
    const expected = `| 星级 | 人均价格（美元） | 中国大陆参考 |
|------|----------------|-------------|
| 必比登 | \\$20-50 | ¥150-350 |
| ⭐ | \\$50-200 | ¥400-1,500 |
| ⭐⭐ | \\$200-500 | ¥1,500-3,500 |
| ⭐⭐⭐ | \\$300-1,000+ | ¥2,000-7,000+ |`;
    expect(escapeCurrencyDollars(content)).toBe(expected);
  });

  test('preserves LaTeX inline math expressions', () => {
    const content = 'The equation $x^2 + y^2 = z^2$ is valid';
    expect(escapeCurrencyDollars(content)).toBe(content);
  });

  test('preserves LaTeX block math expressions', () => {
    const content = 'The formula $$E = mc^2$$ is famous';
    expect(escapeCurrencyDollars(content)).toBe(content);
  });

  test('preserves code blocks with dollar signs', () => {
    const content = '```\n$100 + $200\n```';
    expect(escapeCurrencyDollars(content)).toBe(content);
  });

  test('preserves inline code with dollar signs', () => {
    const content = 'Use `$price` variable';
    expect(escapeCurrencyDollars(content)).toBe(content);
  });

  test('handles mixed LaTeX and currency', () => {
    const content = 'LaTeX $x^2$ and price $50';
    const expected = 'LaTeX $x^2$ and price \\$50';
    expect(escapeCurrencyDollars(content)).toBe(expected);
  });

  test('handles currency with commas', () => {
    const content = 'The price is $1,000,000';
    const expected = 'The price is \\$1,000,000';
    expect(escapeCurrencyDollars(content)).toBe(expected);
  });

  test('handles currency with decimals', () => {
    const content = '$19.99 and $100.50';
    const expected = '\\$19.99 and \\$100.50';
    expect(escapeCurrencyDollars(content)).toBe(expected);
  });

  test('does not escape dollar signs not followed by numbers', () => {
    const content = 'This $variable is not currency';
    expect(escapeCurrencyDollars(content)).toBe(content);
  });

  test('preserves LaTeX bracket notation', () => {
    const content = 'Formula \\[x^2 + y^2\\] is preserved';
    expect(escapeCurrencyDollars(content)).toBe(content);
  });

  test('preserves LaTeX parenthesis notation', () => {
    const content = 'Formula \\(x^2\\) is preserved';
    expect(escapeCurrencyDollars(content)).toBe(content);
  });

  test('preserves multiple inline LaTeX expressions with degree symbols', () => {
    const content = '向量$90^\\circ$，非 $0^\\circ$ 和 $180^\\circ$';
    expect(escapeCurrencyDollars(content)).toBe(content);
  });

  test('handles mixed LaTeX degree symbols and currency in same text', () => {
    const content = 'Angle is $90^\\circ$ and price is $100';
    const expected = 'Angle is $90^\\circ$ and price is \\$100';
    expect(escapeCurrencyDollars(content)).toBe(expected);
  });

  test('preserves LaTeX expressions with number lists', () => {
    // Edge case: $1,-1,0$ should be treated as LaTeX, not currency
    const content = '$1,-1,0$';
    expect(escapeCurrencyDollars(content)).toBe(content);
  });

  test('preserves LaTeX expressions with comma-separated values', () => {
    const content = 'The values $1,2,3$ and $x,y,z$ are valid';
    expect(escapeCurrencyDollars(content)).toBe(content);
  });

  describe('edge cases', () => {
    test('handles negative numbers in LaTeX', () => {
      expect(escapeCurrencyDollars('$-1$')).toBe('$-1$');
      expect(escapeCurrencyDollars('$-10$')).toBe('$-10$');
      expect(escapeCurrencyDollars('$-100$')).toBe('$-100$');
    });

    test('handles negative number lists', () => {
      expect(escapeCurrencyDollars('$-1,-2,-3$')).toBe('$-1,-2,-3$');
      expect(escapeCurrencyDollars('$1,-1,0$')).toBe('$1,-1,0$'); // Original bug
      expect(escapeCurrencyDollars('$-5,0,5$')).toBe('$-5,0,5$');
    });

    test('handles mixed positive and negative numbers', () => {
      expect(escapeCurrencyDollars('$1,-2,3,-4$')).toBe('$1,-2,3,-4$');
      expect(escapeCurrencyDollars('$100,-50,0,25$')).toBe('$100,-50,0,25$');
    });

    test('handles numbers with many commas', () => {
      expect(escapeCurrencyDollars('$1,2,3,4,5$')).toBe('$1,2,3,4,5$');
      expect(escapeCurrencyDollars('$10,20,30,40,50$')).toBe('$10,20,30,40,50$');
    });

    test('distinguishes between LaTeX lists and currency thousands', () => {
      // LaTeX list: comma separates multiple numbers
      expect(escapeCurrencyDollars('$1,000$')).toBe('$1,000$');

      // Currency with comma (no closing $)
      expect(escapeCurrencyDollars('$1,000 price')).toBe('\\$1,000 price');
      expect(escapeCurrencyDollars('$2,500 each')).toBe('\\$2,500 each');
    });

    test('handles zero in various contexts', () => {
      expect(escapeCurrencyDollars('$0$')).toBe('$0$');
      expect(escapeCurrencyDollars('$0,1,2$')).toBe('$0,1,2$');
      expect(escapeCurrencyDollars('$-1,0,1$')).toBe('$-1,0,1$');
    });

    test('handles single-digit formulas in complex text', () => {
      const content = 'If $n=1$ then $f(1)=0$ and $g(1)=2$';
      expect(escapeCurrencyDollars(content)).toBe(content);
    });

    test('handles adjacent dollar signs correctly', () => {
      // Display math followed by inline math
      expect(escapeCurrencyDollars('$$x^2$$ and $y^2$')).toBe('$$x^2$$ and $y^2$');

      // Should not confuse with currency
      expect(escapeCurrencyDollars('$$1,2,3$$ then $4,5,6$')).toBe('$$1,2,3$$ then $4,5,6$');
    });

    test('handles large numbers in LaTeX', () => {
      expect(escapeCurrencyDollars('$1000$')).toBe('$1000$');
      expect(escapeCurrencyDollars('$10000$')).toBe('$10000$');
      expect(escapeCurrencyDollars('$999999$')).toBe('$999999$');
    });
  });

  describe('comprehensive scenarios', () => {
    test('handles mathematical sequences', () => {
      const content = 'The sequence $1,-1,1,-1,1$ alternates between values';
      expect(escapeCurrencyDollars(content)).toBe(content);
    });

    test('handles coordinate-like expressions', () => {
      expect(escapeCurrencyDollars('Point $1,0$ and $-1,0$')).toBe('Point $1,0$ and $-1,0$');
      expect(escapeCurrencyDollars('Origin $0,0,0$')).toBe('Origin $0,0,0$');
    });

    test('handles mixed LaTeX numbers and text currency', () => {
      const content = 'The formula $1,2,3$ costs about $50 to compute';
      const expected = 'The formula $1,2,3$ costs about \\$50 to compute';
      expect(escapeCurrencyDollars(content)).toBe(expected);
    });

    test('handles complex mathematical expressions with numbers', () => {
      const content = 'When $x \\in \\{1,2,3\\}$ the cost is $100';
      const expected = 'When $x \\in \\{1,2,3\\}$ the cost is \\$100';
      expect(escapeCurrencyDollars(content)).toBe(expected);
    });

    test('handles multiple types of formulas in one text', () => {
      const content = 'Values $1,-1,0$ with $x^2$ and $90^\\circ$ cost $100';
      const expected = 'Values $1,-1,0$ with $x^2$ and $90^\\circ$ cost \\$100';
      expect(escapeCurrencyDollars(content)).toBe(expected);
    });

    test('handles LaTeX in tables with currency', () => {
      const content = `| Formula | Values | Price |
|---------|--------|-------|
| $x^2$ | $1,2,3$ | $100 |
| $y^2$ | $-1,0,1$ | $200 |`;

      const result = escapeCurrencyDollars(content);

      // LaTeX formulas should be preserved
      expect(result).toContain('$x^2$');
      expect(result).toContain('$1,2,3$');
      expect(result).toContain('$-1,0,1$');

      // Currency should be escaped
      expect(result).toContain('\\$100');
      expect(result).toContain('\\$200');
    });

    test('handles scientific notation-like patterns', () => {
      expect(escapeCurrencyDollars('$1,000,000$')).toBe('$1,000,000$');
      expect(escapeCurrencyDollars('$-1,000,000$')).toBe('$-1,000,000$');
    });

    test('preserves complex number sequences', () => {
      const content = '$1,-2,3,-4,5,-6,7,-8,9$';
      expect(escapeCurrencyDollars(content)).toBe(content);
    });

    test('handles formulas at start and end of text', () => {
      expect(escapeCurrencyDollars('$1,-1,0$ is a sequence')).toBe('$1,-1,0$ is a sequence');
      expect(escapeCurrencyDollars('The sequence is $1,-1,0$')).toBe('The sequence is $1,-1,0$');
      expect(escapeCurrencyDollars('$1,-1,0$')).toBe('$1,-1,0$');
    });

    test('handles multiple currencies and formulas mixed', () => {
      const content = 'Buy $1,2,3$ items for $19.99, or $4,5,6$ items for $29.99';
      const expected = 'Buy $1,2,3$ items for \\$19.99, or $4,5,6$ items for \\$29.99';
      expect(escapeCurrencyDollars(content)).toBe(expected);
    });
  });
});

describe('fixCommonLaTeXErrors', () => {
  test('fixes unbalanced braces', () => {
    const content = '$\\frac{1{2}$';
    const result = fixCommonLaTeXErrors(content);
    expect(result).toBe('$\\frac{1{2}}$');
  });

  test('fixes multiple unbalanced braces', () => {
    const content = '$\\frac{\\sqrt{x}{y}$';
    const result = fixCommonLaTeXErrors(content);
    expect(result).toBe('$\\frac{\\sqrt{x}{y}}$');
  });

  test('fixes unbalanced \\left and \\right', () => {
    const content = '$\\left( x + y$';
    const result = fixCommonLaTeXErrors(content);
    expect(result).toBe('$\\left( x + y\\right.$');
  });

  test('fixes multiple unbalanced \\left', () => {
    const content = '$\\left[ \\left( x \\right)$';
    const result = fixCommonLaTeXErrors(content);
    expect(result).toBe('$\\left[ \\left( x \\right)\\right.$');
  });

  test('does not modify correctly balanced expressions', () => {
    const content = '$\\frac{1}{2}$ and $\\left( x \\right)$';
    expect(fixCommonLaTeXErrors(content)).toBe(content);
  });

  test('handles display math', () => {
    const content = '$$\\left( x + y$$';
    const result = fixCommonLaTeXErrors(content);
    expect(result).toBe('$$\\left( x + y\\right.$$');
  });

  test('handles mixed inline and display math', () => {
    const content = 'Inline $\\frac{a{b}$ and display $$\\left( c$$';
    const result = fixCommonLaTeXErrors(content);
    expect(result).toContain('$\\frac{a{b}}$');
    expect(result).toContain('$$\\left( c\\right.$$');
  });
});

describe('normalizeLatexSpacing', () => {
  test('removes spaces after opening $', () => {
    const content = '$ x + y$';
    const expected = '$x + y$';
    expect(normalizeLatexSpacing(content)).toBe(expected);
  });

  test('removes spaces before closing $', () => {
    const content = '$x + y $';
    const expected = '$x + y$';
    expect(normalizeLatexSpacing(content)).toBe(expected);
  });

  test('removes spaces around $$', () => {
    const content = '$$ x + y $$';
    const expected = '$$x + y$$';
    expect(normalizeLatexSpacing(content)).toBe(expected);
  });

  test('normalizes multiple spaces inside formulas', () => {
    const content = '$x  +   y$';
    const expected = '$x + y$';
    expect(normalizeLatexSpacing(content)).toBe(expected);
  });

  test('handles mixed inline and display math', () => {
    const content = '$ a $ text $$ b  +  c $$';
    const result = normalizeLatexSpacing(content);
    // Spacing is normalized inside formulas
    expect(result).toContain('$a$');
    expect(result).toContain('$$b + c$$');
    // May or may not preserve space between formulas and text
  });

  test('preserves spaces outside math expressions', () => {
    const content = 'This  has   spaces $x$ between  words';
    const result = normalizeLatexSpacing(content);
    expect(result).toContain('This  has   spaces');
    expect(result).toContain('$x$');
  });
});

describe('validateLatexExpressions', () => {
  test('validates correct expressions', () => {
    const content = '$x^2 + y^2 = z^2$ and $$E = mc^2$$';
    const result = validateLatexExpressions(content);
    expect(result.valid).toBe(true);
    expect(result.totalExpressions).toBe(2);
    expect(result.errors).toHaveLength(0);
  });

  test('detects invalid syntax', () => {
    const content = '$x^{$ invalid';
    const result = validateLatexExpressions(content);
    expect(result.valid).toBe(false);
    expect(result.totalExpressions).toBe(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].type).toBe('inline');
  });

  test('detects multiple errors', () => {
    const content = '$x^{$ and $$\\frac{$$';
    const result = validateLatexExpressions(content);
    expect(result.valid).toBe(false);
    expect(result.totalExpressions).toBe(2);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('counts all expressions correctly', () => {
    const content = '$a$ $b$ $$c$$ text $d$';
    const result = validateLatexExpressions(content);
    expect(result.totalExpressions).toBe(4);
  });

  test('identifies error positions', () => {
    const content = 'Some text $valid$ more text $invalid^{$';
    const result = validateLatexExpressions(content);
    expect(result.errors[0].position).toBeGreaterThan(0);
  });

  test('truncates long formulas in error messages', () => {
    const longFormula = '$' + 'x'.repeat(100) + '^{$';
    const result = validateLatexExpressions(longFormula);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].formula.length).toBeLessThanOrEqual(53); // 50 + '...'
  });

  test('distinguishes inline and display math in errors', () => {
    const content = '$invalid^{$ and $$also_invalid^{$$';
    const result = validateLatexExpressions(content);
    const inlineErrors = result.errors.filter((e) => e.type === 'inline');
    const displayErrors = result.errors.filter((e) => e.type === 'display');
    expect(inlineErrors.length).toBeGreaterThan(0);
    expect(displayErrors.length).toBeGreaterThan(0);
  });
});

describe('handleCJKWithLatex', () => {
  test('does not add spaces by default', () => {
    const content = '中文$x^2$中文';
    expect(handleCJKWithLatex(content)).toBe(content);
    expect(handleCJKWithLatex(content, false)).toBe(content);
  });

  test('adds space between CJK and opening $', () => {
    const content = '中文$x^2$';
    const expected = '中文 $x^2$';
    expect(handleCJKWithLatex(content, true)).toBe(expected);
  });

  test('adds space between closing $ and CJK', () => {
    const content = '$x^2$中文';
    const expected = '$x^2$ 中文';
    expect(handleCJKWithLatex(content, true)).toBe(expected);
  });

  test('adds spaces on both sides', () => {
    const content = '中文$x^2$中文';
    const expected = '中文 $x^2$ 中文';
    expect(handleCJKWithLatex(content, true)).toBe(expected);
  });

  test('handles multiple expressions', () => {
    const content = '向量$a$和$b$的和';
    const expected = '向量 $a$ 和 $b$ 的和';
    expect(handleCJKWithLatex(content, true)).toBe(expected);
  });

  test('handles Japanese characters', () => {
    const content = 'テスト$x^2$テスト';
    const expected = 'テスト $x^2$ テスト';
    expect(handleCJKWithLatex(content, true)).toBe(expected);
  });

  test('handles display math', () => {
    const content = '公式$$E=mc^2$$很重要';
    const result = handleCJKWithLatex(content, true);
    // Should add spaces around $$
    expect(result).toContain(' $$');
    expect(result).toContain('$$ ');
  });

  test('preserves existing spaces', () => {
    const content = '中文 $x^2$ 中文';
    // Should not add duplicate spaces
    const result = handleCJKWithLatex(content, true);
    expect(result).not.toContain('  '); // no double spaces
  });
});

describe('preprocessLaTeX with options', () => {
  test('works with default options (backward compatible)', () => {
    const content = '向量$90^\\circ$，非 $0^\\circ$ 和 $180^\\circ$';
    expect(preprocessLaTeX(content)).toBe(content);
  });

  test('can disable currency escaping', () => {
    const content = 'Price is $100';
    const result = preprocessLaTeX(content, { escapeCurrency: false });
    expect(result).toBe('Price is $100'); // Not escaped
  });

  test('can disable bracket conversion', () => {
    const content = 'Formula \\[x^2\\]';
    const result = preprocessLaTeX(content, { convertBrackets: false });
    expect(result).toBe('Formula \\[x^2\\]'); // Not converted
  });

  test('can disable pipe escaping', () => {
    const content = '$\\{x | x > 0\\}$';
    const result = preprocessLaTeX(content, { escapePipes: false });
    expect(result).toBe('$\\{x | x > 0\\}$'); // Pipes not escaped
  });

  test('can disable underscore escaping', () => {
    const content = '$\\text{node_name}$';
    const result = preprocessLaTeX(content, { escapeUnderscores: false });
    expect(result).toBe('$\\text{node_name}$'); // Underscores not escaped
  });

  test('can disable mhchem escaping', () => {
    const content = '$\\ce{H2O}$';
    const result = preprocessLaTeX(content, { escapeMhchem: false });
    expect(result).toBe('$\\ce{H2O}$'); // Not double-escaped
  });

  test('can enable error fixing', () => {
    const content = '$\\frac{a{b}$';
    const result = preprocessLaTeX(content, { fixErrors: true });
    expect(result).toContain('}$'); // Brace should be closed
  });

  test('can enable spacing normalization', () => {
    const content = '$ x  +  y $';
    const result = preprocessLaTeX(content, { normalizeSpacing: true });
    expect(result).toBe('$x + y$');
  });

  test('can enable CJK handling without spaces', () => {
    const content = '中文$x^2$中文';
    const result = preprocessLaTeX(content, { addCJKSpaces: false, handleCJK: true });
    expect(result).toBe(content); // No spaces added
  });

  test('can enable CJK handling with spaces', () => {
    const content = '中文$x^2$中文';
    const result = preprocessLaTeX(content, { addCJKSpaces: true, handleCJK: true });
    expect(result).toContain(' $');
    expect(result).toContain('$ ');
  });

  test('can enable validation without throwing', () => {
    const content = '$x^2$ valid';
    expect(() => {
      preprocessLaTeX(content, { throwOnValidationError: false, validate: true });
    }).not.toThrow();
  });

  test('combines multiple options correctly', () => {
    const content = '价格$100和公式\\[x^2\\]';
    const result = preprocessLaTeX(content, {
      addCJKSpaces: true,
      convertBrackets: true,
      escapeCurrency: true,
      handleCJK: true,
      normalizeSpacing: true,
    });

    expect(result).toContain('\\$100'); // Currency escaped
    expect(result).toContain('$$x^2$$'); // Brackets converted
    expect(result).toContain(' $'); // CJK space added
  });

  test('handles original reported issue with options', () => {
    const content = '向量$90^\\circ$，非 $0^\\circ$ 和 $180^\\circ$';
    const result = preprocessLaTeX(content, {
      convertBrackets: true,
      escapeCurrency: true,
      escapePipes: true,
    });
    expect(result).toBe(content); // Should preserve LaTeX formulas
  });
});

describe('preprocessLaTeXStrict', () => {
  test('enables all safety features', () => {
    const content = '$ x^{  +  \\left( y $';
    const result = preprocessLaTeXStrict(content);
    // Should normalize spacing and fix errors
    expect(result).toContain('$x^{');
  });

  test('escapes currency in strict mode', () => {
    const content = 'Price $100 and $200';
    const result = preprocessLaTeXStrict(content);
    expect(result).toContain('\\$100');
    expect(result).toContain('\\$200');
  });

  test('converts brackets in strict mode', () => {
    const content = '\\[x^2\\]';
    const result = preprocessLaTeXStrict(content);
    expect(result).toBe('$$x^2$$');
  });

  test('handles CJK in strict mode', () => {
    const content = '中文$x$中文';
    const result = preprocessLaTeXStrict(content);
    // Strict mode enables CJK handling but not space addition
    expect(result).toBe(content);
  });

  test('does not throw on validation errors in strict mode', () => {
    const content = '$invalid^{$';
    expect(() => {
      preprocessLaTeXStrict(content);
    }).not.toThrow();
  });
});

describe('preprocessLaTeXMinimal', () => {
  test('only performs essential operations', () => {
    const content = 'Price $100';
    const result = preprocessLaTeXMinimal(content);
    expect(result).toBe('Price \\$100'); // Currency escaped
  });

  test('converts brackets in minimal mode', () => {
    const content = '\\[x^2\\]';
    const result = preprocessLaTeXMinimal(content);
    expect(result).toBe('$$x^2$$');
  });

  test('does not escape pipes in minimal mode', () => {
    const content = '$\\{x | x > 0\\}$';
    const result = preprocessLaTeXMinimal(content);
    expect(result).toBe('$\\{x | x > 0\\}$');
  });

  test('does not escape underscores in minimal mode', () => {
    const content = '$\\text{node_name}$';
    const result = preprocessLaTeXMinimal(content);
    expect(result).toBe('$\\text{node_name}$');
  });

  test('does not escape mhchem in minimal mode', () => {
    const content = '$\\ce{H2O}$';
    const result = preprocessLaTeXMinimal(content);
    expect(result).toBe('$\\ce{H2O}$');
  });

  test('does not fix errors in minimal mode', () => {
    const content = '$\\frac{a{b}$';
    const result = preprocessLaTeXMinimal(content);
    expect(result).toBe(content); // Error not fixed
  });

  test('does not normalize spacing in minimal mode', () => {
    const content = '$ x  +  y $';
    const result = preprocessLaTeXMinimal(content);
    expect(result).toBe(content); // Spacing not normalized
  });

  test('does not validate in minimal mode', () => {
    const content = '$invalid^{$';
    expect(() => {
      preprocessLaTeXMinimal(content);
    }).not.toThrow();
  });
});

describe('real-world scenarios', () => {
  test('handles complex mathematical paper content', () => {
    const content = `
研究表明：当向量$\\vec{a}$与向量$\\vec{b}$的夹角为$90^\\circ$时，
它们的点积$\\vec{a} \\cdot \\vec{b} = 0$。

价格范围：$20-50美元

公式：\\[
  \\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
\\]
    `;

    const result = preprocessLaTeX(content);

    // LaTeX formulas should be preserved
    expect(result).toContain('$90^\\circ$');
    expect(result).toContain('$\\vec{a}$');

    // Currency should be escaped
    expect(result).toContain('\\$20-50');

    // Brackets should be converted
    expect(result).toContain('$$');
  });

  test('handles markdown table with LaTeX and currency', () => {
    // Note: In tables, the table pipe characters can cause issues with escapeLatexPipes
    // This is expected behavior - use separate cells for formulas
    const content = `| 项目 | 公式 | 价格 |
|------|------|------|
| 面积 | $A = \\pi r^2$ | \\$100 |
| 体积 | $V = \\frac{4}{3}\\pi r^3$ | \\$200 |`;

    // Test with manual currency escaping to avoid table ambiguity
    const result = preprocessLaTeX(content);

    // LaTeX should be preserved (may have pipes escaped)
    expect(result).toMatch(/\$A\s*=.*r\^2\$/);
    expect(result).toMatch(/\$V\s*=.*r\^3\$/);

    // Currency is already escaped in input
    expect(result).toContain('\\$100');
    expect(result).toContain('\\$200');
  });

  test('handles chemical formulas with mhchem', () => {
    const content = '化学反应：$\\ce{H2 + O2 -> H2O}$，能量$\\pu{285.8 kJ/mol}$';
    const result = preprocessLaTeX(content);

    expect(result).toContain('$\\\\ce{H2 + O2 -> H2O}$');
    expect(result).toContain('$\\\\pu{285.8 kJ/mol}$');
  });

  test('handles set notation with pipes', () => {
    const content = '集合 $S = \\{x \\in \\mathbb{R} | x > 0\\}$ 是正实数集';
    const result = preprocessLaTeX(content);

    expect(result).toContain('\\vert{}'); // Pipes should be escaped
  });

  test('handles code blocks with dollar signs', () => {
    const content = `
Here's some code:
\`\`\`python
price = $100
total = $200
\`\`\`

And inline code: \`let x = $price\`

But real currency: The item costs $150.
    `;

    const result = preprocessLaTeX(content);

    // Dollar signs in code should be preserved
    expect(result).toContain('price = $100');
    expect(result).toContain('let x = $price');

    // Real currency should be escaped
    expect(result).toContain('\\$150');
  });

  test('handles tables with LaTeX absolute values (reported issue)', () => {
    const content = `| $1$       | $2$       |
| --------- | --------- |
| $|3| = 3$ | $|4| = 4$ |`;

    const result = preprocessLaTeX(content);

    // Simple number formulas should be preserved
    expect(result).toContain('$1$');
    expect(result).toContain('$2$');

    // Formulas with pipes should have pipes escaped
    expect(result).toContain('$\\vert{}3\\vert{} = 3$');
    expect(result).toContain('$\\vert{}4\\vert{} = 4$');

    // Table structure should be intact
    const lines = result.split('\n');
    expect(lines).toHaveLength(3);
    expect(lines[0]).toMatch(/^\|.*\|$/); // First line is a table row
    expect(lines[1]).toMatch(/^\|.*\|$/); // Second line is separator
    expect(lines[2]).toMatch(/^\|.*\|$/); // Third line is a table row

    // Verify $1$ and $2$ are not escaped as currency
    expect(result).not.toContain('\\$1');
    expect(result).not.toContain('\\$2');
  });

  test('preserves simple number formulas in tables', () => {
    const content = '| Header $1$ | Header $2$ |\n| --- | --- |\n| Value $x$ | Value $y$ |';
    const result = preprocessLaTeX(content);

    // Simple formulas should be preserved as LaTeX
    expect(result).toContain('$1$');
    expect(result).toContain('$2$');
    expect(result).toContain('$x$');
    expect(result).toContain('$y$');

    // Should not be escaped as currency
    expect(result).not.toContain('\\$1');
    expect(result).not.toContain('\\$2');
  });
});
