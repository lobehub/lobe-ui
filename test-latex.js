const { marked } = require('marked');

const markdown = `$$
f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} d\\xi
$$`;

const tokens = marked.lexer(markdown);
console.log('Number of tokens:', tokens.length);
console.log('Tokens:');
tokens.forEach((token, index) => {
  console.log(`${index}: type="${token.type}", raw="${token.raw}"`);
});
