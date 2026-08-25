// Must stay CJS: clean-package loads this via `require`, and Node's require(ESM)
// hands back a namespace object whose `.default` it never unwraps — an .mjs
// config silently strips nothing.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require('./packages/streamdown/package.json');

module.exports = {
  indent: 2,
  // `publishConfig` is deliberately NOT stripped: it carries access/provenance
  // that npm still needs at publish time, and this config was a silent no-op
  // until now, so nothing has ever published without it.
  remove: ['lint-staged', 'devDependencies', 'clean-package'],
  // npm publish (what semantic-release runs) does not understand the
  // `workspace:` protocol; pin the published range to the version this repo
  // currently builds against.
  replace: {
    'dependencies.@lobehub/streamdown': `^${version}`,
  },
};
