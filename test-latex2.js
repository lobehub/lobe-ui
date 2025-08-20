const { marked } = require('marked');

// Test different scenarios
const scenarios = [
  {
    markdown: `$$
f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} d\\xi
$$`,
    name: 'Simple LaTeX block',
  },
  {
    markdown: `Here is a formula:

$$
f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} d\\xi
$$`,
    name: 'LaTeX block with text before',
  },
  {
    markdown: `$$
f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} d\\xi
$$

This is some text after.`,
    name: 'LaTeX block with text after',
  },
  {
    markdown: `# Title

Some text before the equation.

$$
f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} d\\xi
$$

More text after the equation.

$$
g(x) = x^2 + 2x + 1
$$

Final text.`,
    name: 'Mixed content with multiple blocks',
  },
];

scenarios.forEach(({ name, markdown }) => {
  console.log(`\n=== ${name} ===`);
  const tokens = marked.lexer(markdown);
  console.log(`Number of tokens: ${tokens.length}`);
  tokens.forEach((token, index) => {
    console.log(
      `${index}: type="${token.type}", raw="${token.raw.slice(0, 50)}${token.raw.length > 50 ? '...' : ''}"`,
    );
  });
});
