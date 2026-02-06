import { stylelint } from '@lobehub/lint';

export default {
  ...stylelint,
  rules: {
    'custom-property-pattern': null,
    'no-descending-specificity': null,
    ...stylelint.rules,
  },
};
