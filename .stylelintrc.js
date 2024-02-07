module.exports = {
  extends: require('@lobehub/lint').stylelint,
  plugins: ['stylelint-use-logical-spec'],
  rules: {
    'liberty/use-logical-spec': ['always', { except: ['float', /^((min|max)-)?(height|width)$/i] }],
    'custom-property-pattern': null,
    'selector-pseudo-element-no-unknown': null,
    'no-descending-specificity': null,
  },
};
