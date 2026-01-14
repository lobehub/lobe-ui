const config = require('@lobehub/lint').eslint;

module.exports = {
  ...config,
  rules: {
    ...config.rules,
    'no-undef': 0,
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
  },
};
