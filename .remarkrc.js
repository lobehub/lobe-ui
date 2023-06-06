module.exports = {
  plugins: [
    'remark-frontmatter',
    'remark-lint-frontmatter-schema',
    'remark-preset-lint-recommended',
    ['remark-lint-list-item-indent', 'space'],
    ['remark-lint-no-literal-urls', false],
    ['remark-toc', { heading: 'TOC', maxDepth: 3 }],
  ],
};
