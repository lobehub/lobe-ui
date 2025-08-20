const { marked } = require('marked');

// Replicate the current parseMarkdownIntoBlocks function
const parseMarkdownIntoBlocks = (markdown) => {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
};

const testMarkdown = `# Title

Some text before the equation.

$$
f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} d\\xi
$$

More text after the equation.`;

console.log('Testing current parseMarkdownIntoBlocks function:');
const blocks = parseMarkdownIntoBlocks(testMarkdown);
console.log(`Number of blocks: ${blocks.length}`);
blocks.forEach((block, index) => {
  console.log(`Block ${index}:`);
  console.log(`"${block}"`);
  console.log('---');
});
