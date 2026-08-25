module.exports = {
  indent: 2,
  // `publishConfig` is deliberately NOT stripped: it carries access/provenance
  // that npm still needs at publish time.
  remove: ['lint-staged', 'devDependencies', 'clean-package'],
};
